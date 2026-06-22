const API_URL = 'http://localhost:3000/lojas';

function mostrarFeedback(mensagem, tipo = 'success') {
  const el = document.getElementById('mensagem-feedback');
  el.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${mensagem}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
  el.scrollIntoView({ behavior: 'smooth' });
}

async function cadastrarLoja() {
  const nome = document.getElementById('nome').value.trim();
  const categoria = document.getElementById('categoria').value;
  const descricaoCurta = document.getElementById('descricaoCurta').value.trim();
  const descricaoCompleta = document.getElementById('descricaoCompleta').value.trim();

  if (!nome || !categoria || !descricaoCurta || !descricaoCompleta) {
    mostrarFeedback('Preencha todos os campos obrigatórios (*).', 'warning');
    return;
  }

  const tagsRaw = document.getElementById('tags').value;
  const tags = tagsRaw
    .split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0);

  const novaLoja = {
    nome,
    categoria,
    descricaoCurta,
    descricaoCompleta,
    endereco: document.getElementById('endereco').value.trim(),
    telefone: document.getElementById('telefone').value.trim(),
    horario: document.getElementById('horario').value.trim(),
    imagem: document.getElementById('imagem').value.trim() || 'img/placeholder.svg',
    preco: document.getElementById('preco').value.trim(),
    tags,
    destaque: document.getElementById('destaque').checked
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaLoja)
    });

    if (!response.ok) throw new Error('Falha ao cadastrar');

    const lojasCriada = await response.json();
    mostrarFeedback(
      `Loja <strong>${lojasCriada.nome}</strong> cadastrada com sucesso! 
       <a href="details.html?id=${lojasCriada.id}" class="alert-link">Ver detalhes</a>`
    );

    // Limpa o formulário
    document.getElementById('campos-formulario').querySelectorAll('input, textarea, select').forEach(el => {
      if (el.type === 'checkbox') el.checked = false;
      else el.value = '';
    });

  } catch (error) {
    console.error(error);
    mostrarFeedback(
      'Erro ao cadastrar loja. Verifique se o JSON Server está em execução (porta 3000).',
      'danger'
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnCadastrar').addEventListener('click', cadastrarLoja);

  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
  }
});

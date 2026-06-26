const API_LOJAS_URL = 'http://localhost:3000/lojas';

function getCategoria() {
  if (document.getElementById('lojas-masculinas')) return 'Moda Masculina';
  if (document.getElementById('lojas-femininas')) return 'Moda Feminina';
  return null;
}

function getContainerId() {
  if (document.getElementById('lojas-masculinas')) return 'lojas-masculinas';
  if (document.getElementById('lojas-femininas')) return 'lojas-femininas';
  return null;
}

async function fetchLojas() {
  try {
    const response = await fetch(API_LOJAS_URL);
    if (!response.ok) throw new Error('Servidor indisponível');
    return response.json();
  } catch {
    console.warn('JSON Server não encontrado. Usando dados locais.');
    return [];
  }
}

function createCard(loja) {
  const usuario = JSON.parse(sessionStorage.getItem('usuarioCorrente') || 'null');
  const col = document.createElement('div');
  col.className = 'col-12 col-md-6 col-lg-4';
  col.innerHTML = `
    <div class="card h-100 shadow-sm position-relative">
      ${usuario ? `<button class="btn-favorito" style="color:red;" title="Favoritar" data-id="${loja.id}">🤍</button>` : ''}
      <img src="${loja.imagem}" class="card-img-top" alt="${loja.nome}"
           style="height:200px;object-fit:cover;"
           onerror="this.src='img/placeholder.svg'">
      <div class="card-body d-flex flex-column">
        <span class="badge bg-secondary mb-2 align-self-start">${loja.categoria}</span>
        <h3 class="card-title h5">${loja.nome}</h3>
        <p class="card-text text-muted mb-1">${loja.descricaoCurta}</p>
        <p class="fw-semibold mb-3">${loja.preco}</p>
        <a href="details.html?id=${loja.id}" class="btn btn-dark mt-auto">Ver detalhes</a>
      </div>
    </div>
  `;

  const btnFav = col.querySelector('.btn-favorito');
  if (btnFav && usuario) {
    fetch(`http://localhost:3000/favoritos?usuarioId=${usuario.id}`)
      .then(r => r.json())
      .then(favs => {
        const existente = favs.find(f => String(f.lojaId) === String(loja.id));
        if (existente) btnFav.textContent = '❤️';
      });

    btnFav.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const favs = await fetch(`http://localhost:3000/favoritos?usuarioId=${usuario.id}`).then(r => r.json());
      const existente = favs.find(f => String(f.lojaId) === String(loja.id));
      if (existente) {
        await fetch(`http://localhost:3000/favoritos/${existente.id}`, { method: 'DELETE' });
        btnFav.textContent = '🤍';
      } else {
        await fetch('http://localhost:3000/favoritos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usuarioId: usuario.id, lojaId: loja.id })
        });
        btnFav.textContent = '❤️';
      }
    });
  }

  return col;
}

async function init() {
  const categoria = getCategoria();
  const containerId = getContainerId();
  if (!categoria || !containerId) return;

  const lojas = await fetchLojas();
  const filtradas = lojas.filter(l => l.categoria === categoria);

  const container = document.getElementById(containerId);
  container.innerHTML = '';

  if (filtradas.length === 0) {
    container.innerHTML = '<p class="text-muted">Nenhuma loja encontrada.</p>';
    return;
  }

  filtradas.forEach(l => container.appendChild(createCard(l)));
}

document.addEventListener('DOMContentLoaded', () => {
  init();

  const menuToggle = document.getElementById('menuToggle');
  const navMenu    = document.getElementById('navMenu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
    navMenu.querySelectorAll('a').forEach(link =>
      link.addEventListener('click', () => navMenu.classList.remove('active'))
    );
  }
});

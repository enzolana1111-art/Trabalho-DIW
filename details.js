const API_URL = 'http://localhost:3000/lojas';

const LOJAS_FALLBACK = [
  { "id": 1, "nome": "Hugo Boss", "categoria": "Moda Masculina", "descricaoCurta": "Roupas sociais e perfumes de luxo.", "descricaoCompleta": "Hugo Boss é referência em moda masculina de alto padrão, com peças elegantes para trabalho e ocasiões especiais. A marca alemã combina sofisticação e modernidade em cada coleção, oferecendo desde ternos impecáveis até perfumes exclusivos.", "endereco": "Diamond Mall, piso 4 - Av. Olegário Maciel, 1600 - Lourdes / BH Shopping, piso 4 - Rodovia BR-356, 3049 / BH Outlet, piso 2 - Rodovia BR-356, 7515", "telefone": "(31) 4004-4000", "horario": "Seg-Sáb: 10h às 22h", "imagem": "img/hugo_boss.svg", "preco": "A partir de R$ 299,00", "tags": ["luxo", "social", "masculino", "perfumes", "ternos"], "destaque": true },
  { "id": 2, "nome": "Lacoste", "categoria": "Moda Masculina", "descricaoCurta": "Polo e roupas esportivas com estilo.", "descricaoCompleta": "Lacoste oferece peças icônicas com o crocodilo, unindo conforto esportivo e elegância para o dia a dia. Fundada em 1933, a marca francesa é sinônimo de estilo clássico e qualidade premium em camisas polo, vestuário e acessórios.", "endereco": "BH Shopping, piso 3 - Rodovia BR-356, 3049 / Diamond Mall, piso 4 - Av. Olegário Maciel, 1600 / Pátio Savassi, piso L2 - Av. do Contorno, 6061", "telefone": "(31) 4004-5000", "horario": "Seg-Sáb: 10h às 21h", "imagem": "img/lacoste.svg", "preco": "A partir de R$ 199,00", "tags": ["polo", "esportivo", "clássico", "masculino", "francês"], "destaque": true },
  { "id": 3, "nome": "Polo Ralph Lauren", "categoria": "Moda Masculina", "descricaoCurta": "Linha premium de camisas e acessórios.", "descricaoCompleta": "Polo Ralph Lauren apresenta roupas masculinas com estilo clássico e acabamento refinado para looks sofisticados. A marca americana é referência global em moda de alto padrão, com coleções que transitam entre o casual e o formal com elegância.", "endereco": "Não possui endereço em Belo Horizonte. Sugestões de lojas online seguras: Drop, Farfetch e Dafiti.", "telefone": "(31) 4004-6000", "horario": "Seg-Dom: 11h às 20h (online)", "imagem": "img/polo.svg", "preco": "A partir de R$ 350,00", "tags": ["premium", "americano", "clássico", "camisas", "acessórios"], "destaque": false },
  { "id": 4, "nome": "Zara", "categoria": "Moda Feminina", "descricaoCurta": "Tendências da moda feminina para todas as ocasiões.", "descricaoCompleta": "Zara oferece novidades da moda feminina com coleções que mudam frequentemente e peças modernas para várias ocasiões. A gigante espanhola do varejo de moda traz as últimas tendências das passarelas para o dia a dia com preços acessíveis.", "endereco": "BH Shopping, piso 1 - Rodovia BR-356, 3049 / Boulevard Shopping, piso 2 - Avenida dos Andradas, 3000", "telefone": "(31) 4004-7000", "horario": "Seg-Sáb: 10h às 22h", "imagem": "img/zara.svg", "preco": "A partir de R$ 89,00", "tags": ["tendência", "feminino", "versátil", "espanhol", "acessível"], "destaque": true },
  { "id": 5, "nome": "Guess", "categoria": "Moda Feminina", "descricaoCurta": "Looks jovens e cheios de personalidade.", "descricaoCompleta": "Guess reúne peças cheias de atitude, com estilo jovem e moderno, ideal para fashionistas que buscam destaque. A marca americana é conhecida pelo apelo sensual e pelo uso de jeans de alta qualidade, além de bolsas e acessórios icônicos.", "endereco": "BH Outlet, piso 1 - Rodovia BR-356, 7515", "telefone": "(31) 4004-8000", "horario": "Seg-Sáb: 10h às 21h", "imagem": "img/guess.svg", "preco": "A partir de R$ 199,00", "tags": ["jovem", "feminino", "americano", "jeans", "atitude"], "destaque": false },
  { "id": 6, "nome": "Vans", "categoria": "Moda Feminina", "descricaoCurta": "Roupas casuais e calçados descolados.", "descricaoCompleta": "Vans oferece estilo urbano para o público feminino, com tênis e roupas confortáveis para o dia a dia. A marca californiana nasceu do skate e conquistou o mundo com seu estilo alternativo e acessível, sendo ícone da cultura jovem urbana.", "endereco": "BH Shopping, piso 1 - Rodovia BR-356, 3049 / Pátio Savassi, piso L2 - Av. do Contorno, 6061", "telefone": "(31) 4004-9000", "horario": "Seg-Sáb: 10h às 22h", "imagem": "img/vans.svg", "preco": "A partir de R$ 129,00", "tags": ["casual", "skate", "urbano", "feminino", "tênis"], "destaque": false }
];

function getIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function fetchItemById(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Servidor indisponível');
    return response.json();
  } catch {
    console.warn('JSON Server não encontrado. Usando dados locais.');
    const loja = LOJAS_FALLBACK.find(l => l.id === Number(id));
    if (!loja) throw new Error('Loja não encontrada');
    return loja;
  }
}

function renderDetails(loja) {
  const container = document.getElementById('detalhe-container');
  if (!container) return;

  const tagsHtml = loja.tags
    .map(tag => `<span class="badge bg-secondary me-1 mb-1">${tag}</span>`)
    .join('');

  container.innerHTML = `
    <div class="row g-4">
      <div class="col-lg-5">
        <img src="${loja.imagem}" alt="${loja.nome}"
             class="img-fluid rounded detalhe-img w-100"
             onerror="this.src='img/placeholder.svg'">
      </div>
      <div class="col-lg-7">
        <span class="badge bg-secondary mb-2">${loja.categoria}</span>
        <h1 class="mb-2">${loja.nome}</h1>
        <p class="lead text-muted mb-2">${loja.descricaoCurta}</p>
        <p class="fw-bold fs-5 mb-3">${loja.preco}</p>

        <div class="info p-3 rounded bg-light mb-3">
          <p><strong>Endereço:</strong> ${loja.endereco}</p>
          <p><strong>Telefone:</strong> ${loja.telefone}</p>
          <p><strong>Horário:</strong> ${loja.horario}</p>
          <p class="mb-0"><strong>Sobre:</strong> ${loja.descricaoCompleta}</p>
        </div>

        <div class="mb-4">
          <strong>Tags:</strong>
          <div class="mt-1">${tagsHtml}</div>
        </div>

        <a href="index.html" class="btn btn-dark">← Voltar</a>
      </div>
    </div>
  `;
}

function showError(message) {
  const container = document.getElementById('detalhe-container');
  if (!container) return;
  container.innerHTML = `
    <div class="alert alert-warning" role="alert">
      <h4 class="alert-heading">Ops!</h4>
      <p>${message}</p>
      <a href="index.html" class="btn btn-dark mt-2">← Voltar para a Home</a>
    </div>
  `;
}

async function init() {
  const id = getIdFromUrl();

  if (!id) {
    showError('Nenhum ID de loja foi informado na URL.');
    return;
  }

  try {
    const loja = await fetchItemById(id);
    renderDetails(loja);
  } catch (error) {
    console.error(error);
    showError(`Loja com ID <strong>${id}</strong> não encontrada. Verifique o link ou volte para a Home.`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  init();

  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
  }
});

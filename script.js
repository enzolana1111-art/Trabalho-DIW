const API_URL = 'http://localhost:3000/lojas';

const LOJAS_FALLBACK = [
  {
    "id": 1,
    "nome": "Hugo Boss",
    "categoria": "Moda Masculina",
    "descricaoCurta": "Roupas sociais e perfumes de luxo.",
    "descricaoCompleta": "Hugo Boss é referência em moda masculina de alto padrão, com peças elegantes para trabalho e ocasiões especiais. A marca alemã combina sofisticação e modernidade em cada coleção, oferecendo desde ternos impecáveis até perfumes exclusivos.",
    "endereco": "Diamond Mall, piso 4 - Av. Olegário Maciel, 1600 - Lourdes / BH Shopping, piso 4 - Rodovia BR-356, 3049 / BH Outlet, piso 2 - Rodovia BR-356, 7515",
    "telefone": "(31) 4004-4000",
    "horario": "Seg-Sáb: 10h às 22h",
    "imagem": "img/hugo_boss.svg",
    "preco": "A partir de R$ 299,00",
    "tags": ["luxo", "social", "masculino", "perfumes", "ternos"],
    "destaque": true
  },
  {
    "id": 2,
    "nome": "Lacoste",
    "categoria": "Moda Masculina",
    "descricaoCurta": "Polo e roupas esportivas com estilo.",
    "descricaoCompleta": "Lacoste oferece peças icônicas com o crocodilo, unindo conforto esportivo e elegância para o dia a dia. Fundada em 1933, a marca francesa é sinônimo de estilo clássico e qualidade premium em camisas polo, vestuário e acessórios.",
    "endereco": "BH Shopping, piso 3 - Rodovia BR-356, 3049 / Diamond Mall, piso 4 - Av. Olegário Maciel, 1600 / Pátio Savassi, piso L2 - Av. do Contorno, 6061",
    "telefone": "(31) 4004-5000",
    "horario": "Seg-Sáb: 10h às 21h",
    "imagem": "img/lacoste.svg",
    "preco": "A partir de R$ 199,00",
    "tags": ["polo", "esportivo", "clássico", "masculino", "francês"],
    "destaque": true
  },
  {
    "id": 3,
    "nome": "Polo Ralph Lauren",
    "categoria": "Moda Masculina",
    "descricaoCurta": "Linha premium de camisas e acessórios.",
    "descricaoCompleta": "Polo Ralph Lauren apresenta roupas masculinas com estilo clássico e acabamento refinado para looks sofisticados. A marca americana é referência global em moda de alto padrão, com coleções que transitam entre o casual e o formal com elegância.",
    "endereco": "Não possui endereço em Belo Horizonte. Sugestões de lojas online seguras: Drop, Farfetch e Dafiti.",
    "telefone": "(31) 4004-6000",
    "horario": "Seg-Dom: 11h às 20h (online)",
    "imagem": "img/polo.svg",
    "preco": "A partir de R$ 350,00",
    "tags": ["premium", "americano", "clássico", "camisas", "acessórios"],
    "destaque": false
  },
  {
    "id": 4,
    "nome": "Zara",
    "categoria": "Moda Feminina",
    "descricaoCurta": "Tendências da moda feminina para todas as ocasiões.",
    "descricaoCompleta": "Zara oferece novidades da moda feminina com coleções que mudam frequentemente e peças modernas para várias ocasiões. A gigante espanhola do varejo de moda traz as últimas tendências das passarelas para o dia a dia com preços acessíveis.",
    "endereco": "BH Shopping, piso 1 - Rodovia BR-356, 3049 / Boulevard Shopping, piso 2 - Avenida dos Andradas, 3000",
    "telefone": "(31) 4004-7000",
    "horario": "Seg-Sáb: 10h às 22h",
    "imagem": "img/zara.svg",
    "preco": "A partir de R$ 89,00",
    "tags": ["tendência", "feminino", "versátil", "espanhol", "acessível"],
    "destaque": true
  },
  {
    "id": 5,
    "nome": "Guess",
    "categoria": "Moda Feminina",
    "descricaoCurta": "Looks jovens e cheios de personalidade.",
    "descricaoCompleta": "Guess reúne peças cheias de atitude, com estilo jovem e moderno, ideal para fashionistas que buscam destaque. A marca americana é conhecida pelo apelo sensual e pelo uso de jeans de alta qualidade, além de bolsas e acessórios icônicos.",
    "endereco": "BH Outlet, piso 1 - Rodovia BR-356, 7515",
    "telefone": "(31) 4004-8000",
    "horario": "Seg-Sáb: 10h às 21h",
    "imagem": "img/guess.svg",
    "preco": "A partir de R$ 199,00",
    "tags": ["jovem", "feminino", "americano", "jeans", "atitude"],
    "destaque": false
  },
  {
    "id": 6,
    "nome": "Vans",
    "categoria": "Moda Feminina",
    "descricaoCurta": "Roupas casuais e calçados descolados.",
    "descricaoCompleta": "Vans oferece estilo urbano para o público feminino, com tênis e roupas confortáveis para o dia a dia. A marca californiana nasceu do skate e conquistou o mundo com seu estilo alternativo e acessível, sendo ícone da cultura jovem urbana.",
    "endereco": "BH Shopping, piso 1 - Rodovia BR-356, 3049 / Pátio Savassi, piso L2 - Av. do Contorno, 6061",
    "telefone": "(31) 4004-9000",
    "horario": "Seg-Sáb: 10h às 22h",
    "imagem": "img/vans.svg",
    "preco": "A partir de R$ 129,00",
    "tags": ["casual", "skate", "urbano", "feminino", "tênis"],
    "destaque": false
  }
];

// ── Fetch ────────────────────────────────────────────────────────────────────
async function fetchItems() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Servidor indisponível');
    return response.json();
  } catch {
    console.warn('JSON Server não encontrado. Usando dados locais.');
    return LOJAS_FALLBACK;
  }
}

// ── Card ─────────────────────────────────────────────────────────────────────
function createCard(item) {
  const col = document.createElement('div');
  col.className = 'col-12 col-md-6 col-lg-4';
  col.innerHTML = `
    <div class="card h-100 shadow-sm">
      <img src="${item.imagem}" class="card-img-top img-fluid" alt="${item.nome}"
           onerror="this.src='img/placeholder.svg'">
      <div class="card-body d-flex flex-column">
        <span class="badge bg-secondary mb-2 align-self-start">${item.categoria}</span>
        <h3 class="card-title h5">${item.nome}</h3>
        <p class="card-text text-muted mb-1">${item.descricaoCurta}</p>
        <p class="fw-semibold mb-3">${item.preco}</p>
        <a href="details.html?id=${item.id}" class="btn btn-dark mt-auto">Ver detalhes</a>
      </div>
    </div>
  `;
  return col;
}

// ── Render ───────────────────────────────────────────────────────────────────
function renderCards(items, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  if (items.length === 0) {
    container.innerHTML = '<p class="text-muted">Nenhuma loja encontrada.</p>';
    return;
  }
  items.forEach(item => container.appendChild(createCard(item)));
}

// ── Init ─────────────────────────────────────────────────────────────────────
async function init() {
  try {
    const items = await fetchItems();

    const masculinas = items.filter(i =>
      i.categoria.toLowerCase().includes('masculina')
    );
    const femininas = items.filter(i =>
      i.categoria.toLowerCase().includes('feminina')
    );

    renderCards(masculinas, 'lojas-masculinas');
    renderCards(femininas, 'lojas-femininas');

  } catch (error) {
    console.error(error);
  }
}

// ── Menu mobile ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  init();

  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
    navMenu.querySelectorAll('a').forEach(link =>
      link.addEventListener('click', () => navMenu.classList.remove('active'))
    );
  }
});

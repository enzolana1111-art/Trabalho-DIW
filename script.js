const API_LOJAS_URL = 'http://localhost:3000/lojas';
const API_FAVS      = 'http://localhost:3000/favoritos';

async function getFavoritosUsuario(usuarioId) {
  try {
    const res = await fetch(`${API_FAVS}?usuarioId=${usuarioId}`);
    return res.json();
  } catch { return []; }
}

async function toggleFavorito(lojaId, btnEl) {
  const usuario = JSON.parse(sessionStorage.getItem("usuarioCorrente") || "null");
  if (!usuario) { window.location.href = 'login.html'; return; }

  const favs     = await getFavoritosUsuario(usuario.id);
  const existente = favs.find(f => String(f.lojaId) === String(lojaId));

  if (existente) {
    await fetch(`${API_FAVS}/${existente.id}`, { method: 'DELETE' });
    btnEl.textContent = '🤍';
    btnEl.title = 'Adicionar aos favoritos';
    btnEl.classList.remove('favoritado');
  } else {
    await fetch(API_FAVS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuarioId: usuario.id, lojaId })
    });
    btnEl.textContent = '❤️';
    btnEl.title = 'Remover dos favoritos';
    btnEl.classList.add('favoritado');
  }
}

async function fetchLojas() {
  try {
    const res = await fetch(API_LOJAS_URL);
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    console.warn('JSON Server indisponível.');
    return [];
  }
}

function createCard(loja, favoritado = false) {
  const usuario = JSON.parse(sessionStorage.getItem("usuarioCorrente") || "null");
  const col = document.createElement('div');
  col.className = 'col-12 col-md-6 col-lg-4';

  const btnFavHtml = usuario
    ? `<button class="btn-favorito${favoritado ? ' favoritado' : ''}"
              title="${favoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}"
              data-id="${loja.id}">
         ${favoritado ? '❤️' : '🤍'}
       </button>`
    : '';

  col.innerHTML = `
    <div class="card h-100 shadow-sm position-relative">
      ${btnFavHtml}
      <img src="${loja.imagem}" class="card-img-top img-fluid" alt="${loja.nome}"
           style="height:200px;object-fit:contain;background:#f5f5f5;padding:1rem;"
           onerror="this.src='img/placeholder.svg'">
      <div class="card-body d-flex flex-column">
        <span class="badge bg-secondary mb-2 align-self-start">${loja.categoria}</span>
        <h3 class="card-title h5">${loja.nome}</h3>
        <p class="card-text text-muted mb-1">${loja.descricaoCurta}</p>
        <p class="fw-semibold mb-3">${loja.preco}</p>
        <a href="details.html?id=${loja.id}" class="btn btn-dark mt-auto">Ver detalhes</a>
      </div>
    </div>`;

  // Evento do coração
  const btnFav = col.querySelector('.btn-favorito');
  if (btnFav) {
    btnFav.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorito(loja.id, btnFav);
    });
  }

  return col;
}

function renderCarrossel(destaques) {
  const inner      = document.getElementById('carrossel-inner');
  const indicators = document.getElementById('carrossel-indicators');
  if (!inner) return;

  inner.innerHTML      = '';
  indicators.innerHTML = '';

  destaques.forEach((loja, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('data-bs-target', '#carrosselDestaques');
    btn.setAttribute('data-bs-slide-to', i);
    if (i === 0) { btn.classList.add('active'); btn.setAttribute('aria-current', 'true'); }
    indicators.appendChild(btn);

    const item = document.createElement('div');
    item.className = `carousel-item destaque-card${i === 0 ? ' active' : ''}`;
    item.innerHTML = `
      <a href="details.html?id=${loja.id}" class="text-decoration-none text-dark">
        <div class="row g-0 align-items-center">
          <div class="col-md-5">
            <img src="${loja.imagem}" class="d-block w-100 carrossel-img"
                 alt="${loja.nome}" onerror="this.src='img/placeholder.svg'">
          </div>
          <div class="col-md-7 p-4">
            <span class="badge bg-secondary mb-2">${loja.categoria}</span>
            <h2 class="h4 mb-2">${loja.nome}</h2>
            <p class="text-muted mb-2">${loja.descricaoCurta}</p>
            <p class="fw-semibold mb-3">${loja.preco}</p>
            <span class="btn btn-dark btn-sm">Ver detalhes →</span>
          </div>
        </div>
      </a>`;
    inner.appendChild(item);
  });
}

async function init() {
  const lojas    = await fetchLojas();
  const usuario  = JSON.parse(sessionStorage.getItem("usuarioCorrente") || "null");
  const favIds   = usuario ? (await getFavoritosUsuario(usuario.id)).map(f => String(f.lojaId)) : [];
  const destaques = lojas.filter(l => l.destaque);

  renderCarrossel(destaques);
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



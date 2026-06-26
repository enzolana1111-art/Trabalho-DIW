const API_LOJAS_URL  = 'http://localhost:3000/lojas';
const API_FAVS_URL = 'http://localhost:3000/favoritos';

function getCategoria() {
  if (document.getElementById('lojas-masculinas')) return 'Moda Masculina';
  if (document.getElementById('lojas-femininas'))  return 'Moda Feminina';
  return null;
}
function getContainerId() {
  if (document.getElementById('lojas-masculinas')) return 'lojas-masculinas';
  if (document.getElementById('lojas-femininas'))  return 'lojas-femininas';
  return null;
}

async function getFavoritosUsuario(usuarioId) {
  try {
    const res = await fetch(`${API_FAVS_URL}?usuarioId=${usuarioId}`);
    return res.json();
  } catch { return []; }
}

async function toggleFavorito(lojaId, btnEl) {
  const usuario = JSON.parse(sessionStorage.getItem("usuarioCorrente") || "null");
  if (!usuario) { window.location.href = 'login.html'; return; }

  const favs      = await getFavoritosUsuario(usuario.id);
  const existente = favs.find(f => String(f.lojaId) === String(lojaId));

  if (existente) {
    await fetch(`${API_FAVS_URL}/${existente.id}`, { method: 'DELETE' });
    btnEl.textContent = '🤍';
    btnEl.title = 'Adicionar aos favoritos';
    btnEl.classList.remove('favoritado');
  } else {
    await fetch(API_FAVS_URL, {
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
  } catch { console.warn('JSON Server indisponível.'); return []; }
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
      <img src="${loja.imagem}" class="card-img-top" alt="${loja.nome}"
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

async function init() {
  const categoria  = getCategoria();
  const containerId = getContainerId();
  if (!categoria || !containerId) return;

  const lojas    = await fetchLojas();
  const filtradas = lojas.filter(l => l.categoria === categoria);
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  if (filtradas.length === 0) {
    container.innerHTML = '<p class="text-muted">Nenhuma loja encontrada.</p>';
    return;
  }

  const usuario = JSON.parse(sessionStorage.getItem("usuarioCorrente") || "null");
  const favIds  = usuario
    ? (await getFavoritosUsuario(usuario.id)).map(f => String(f.lojaId))
    : [];

  filtradas.forEach(l => container.appendChild(createCard(l, favIds.includes(String(l.id)))));
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


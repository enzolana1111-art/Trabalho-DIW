const API_LOJAS = 'http://localhost:3000/lojas';
const API_FAVS  = 'http://localhost:3000/favoritos';

async function getFavoritos(usuarioId) {
  const res = await fetch(`${API_FAVS}?usuarioId=${usuarioId}`);
  return res.json();
}

async function toggleFavorito(lojaId) {
  const usuario = JSON.parse(sessionStorage.getItem("usuarioCorrente") || "null");
  if (!usuario) { window.location.href = 'login.html'; return; }

  const favs = await getFavoritos(usuario.id);
  const existente = favs.find(f => f.lojaId === lojaId);

  if (existente) {
    await fetch(`${API_FAVS}/${existente.id}`, { method: 'DELETE' });
    return false; // removido
  } else {
    await fetch(API_FAVS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuarioId: usuario.id, lojaId })
    });
    return true; // adicionado
  }
}

async function isFavorito(lojaId, usuarioId) {
  if (!usuarioId) return false;
  const favs = await getFavoritos(usuarioId);
  return favs.some(f => f.lojaId === lojaId);
}

function criarBotaoFavorito(lojaId, favoritado) {
  const btn = document.createElement('button');
  btn.className = `btn-favorito${favoritado ? ' favoritado' : ''}`;
  btn.title = favoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos';
  btn.innerHTML = favoritado ? '❤️' : '🤍';
  btn.dataset.lojaId = lojaId;

  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!!!sessionStorage.getItem("usuarioCorrente")) { window.location.href = 'login.html'; return; }
    const agora = await toggleFavorito(lojaId);
    btn.innerHTML = agora ? '❤️' : '🤍';
    btn.classList.toggle('favoritado', agora);
    btn.title = agora ? 'Remover dos favoritos' : 'Adicionar aos favoritos';
  });

  return btn;
}

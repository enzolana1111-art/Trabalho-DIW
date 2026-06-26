const API_LOJAS = 'http://localhost:3000/lojas';
const API_FAVS  = 'http://localhost:3000/favoritos';

async function init() {
  const usuario = Auth.getUsuario();

  if (!usuario) {
    window.location.href = 'login.html';
    return;
  }

  const subtitulo  = document.getElementById('subtitulo-favs');
  const container  = document.getElementById('container-favs');

  try {
    const [todasLojas, favs] = await Promise.all([
      fetch(API_LOJAS).then(r => r.json()),
      fetch(`${API_FAVS}?usuarioId=${usuario.id}`).then(r => r.json())
    ]);

    const favIds       = favs.map(f => String(f.lojaId));
    const lojasFavs    = todasLojas.filter(l => favIds.includes(String(l.id)));

    if (lojasFavs.length === 0) {
      subtitulo.textContent = 'Você ainda não favoritou nenhuma loja.';
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <p class="text-muted fs-5">Explore as lojas e clique no 🤍 para salvar aqui.</p>
          <a href="index.html" class="btn btn-dark mt-2">Ver lojas</a>
        </div>`;
      return;
    }

    subtitulo.textContent = `${lojasFavs.length} loja${lojasFavs.length > 1 ? 's' : ''} salva${lojasFavs.length > 1 ? 's' : ''}.`;

    lojasFavs.forEach(loja => {
      const col = document.createElement('div');
      col.className = 'col-12 col-md-6 col-lg-4';
      col.innerHTML = `
        <div class="card h-100 shadow-sm position-relative">
          <button class="btn-favorito favoritado" title="Remover dos favoritos" data-id="${loja.id}">❤️</button>
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

      const btn = col.querySelector('.btn-favorito');
      btn.addEventListener('click', async () => {
        const fav = favs.find(f => String(f.lojaId) === String(loja.id));
        if (fav) {
          await fetch(`${API_FAVS}/${fav.id}`, { method: 'DELETE' });
          col.remove();
          const restantes = container.querySelectorAll('.col-12').length;
          subtitulo.textContent = restantes === 0
            ? 'Você ainda não favoritou nenhuma loja.'
            : `${restantes} loja${restantes > 1 ? 's' : ''} salva${restantes > 1 ? 's' : ''}.`;
        }
      });

      container.appendChild(col);
    });

  } catch (err) {
    console.error(err);
    document.getElementById('subtitulo-favs').textContent = 'Erro ao carregar favoritos. Verifique o JSON Server.';
  }
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

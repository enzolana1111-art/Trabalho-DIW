// Trabalho Interdisciplinar 1 - Aplicações Web
//
// Esse módulo realiza o registro de novos usuários e login para aplicações com 
// backend baseado em API REST provida pelo JSONServer
// Os dados de usuário estão localizados no arquivo db.json que acompanha este projeto.
//
// Autor: Rommel Vieira Carneiro (rommelcarneiro@gmail.com)
// Data: 09/09/2024
//
// Código LoginApp  



const CADASTRO_URL = "cadastro.html";
const LOGIN_URL = "login.html";
let RETURN_URL = "index.html";
const API_URL = 'http://localhost:3000/usuarios';

var db_usuarios = [];

var usuarioCorrente = {};

function initLoginApp () {
    let pagina = window.location.pathname.split('/').pop();
    if (pagina == CADASTRO_URL) {
        carregarUsuarios(() => {
            console.log('Usuários carregados...');
        });
    } else if (pagina == LOGIN_URL) {
        let returnURL = sessionStorage.getItem('returnURL');
        if (returnURL && returnURL != LOGIN_URL && returnURL != CADASTRO_URL) {
            RETURN_URL = returnURL;
        }
        carregarUsuarios(() => {
            console.log('Usuários carregados...');
        });
    } else {
        sessionStorage.setItem('returnURL', pagina);
        RETURN_URL = pagina;
        usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
        if (usuarioCorrenteJSON) {
            usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
        }
        document.addEventListener('DOMContentLoaded', function () {
            showUserInfo('userInfo');
            atualizarMenu();
        });
    }
};

function usuarioExiste (login, email) {
    return db_usuarios.some(usuario => usuario.login === login || usuario.email === email);
}

function carregarUsuarios(callback) {
    fetch(API_URL)
    .then(response => response.json())
    .then(data => {
        db_usuarios = data;
        callback ()
    })
    .catch(error => {
        console.error('Erro ao ler usuários via API JSONServer:', error);
        displayMessage("Erro ao ler usuários");
    });
}

function loginUser (login, senha) {

   
    for (var i = 0; i < db_usuarios.length; i++) {
        var usuario = db_usuarios[i];

        if (login == usuario.login && senha == usuario.senha) {
            usuarioCorrente.id = usuario.id;
            usuarioCorrente.login = usuario.login;
            usuarioCorrente.email = usuario.email;
            usuarioCorrente.nome = usuario.nome;
            usuarioCorrente.tipo = usuario.tipo;

            sessionStorage.setItem ('usuarioCorrente', JSON.stringify (usuarioCorrente));

            return true;
        }
    }

    return false;
}

function logoutUser () {
    sessionStorage.removeItem ('usuarioCorrente');
    window.location = LOGIN_URL;
}

function addUser (nome, login, senha, email) {

    let usuario = { "login": login, "senha": senha, "nome": nome, "email": email, "tipo": "USUARIO"};

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
    })
        .then(response => response.json())
        .then(data => {
            db_usuarios.push (usuario);
            displayMessage("Usuário inserido com sucesso");
        })
        .catch(error => {
            console.error('Erro ao inserir usuário via API JSONServer:', error);
            displayMessage("Erro ao inserir usuário");
        });
}

function showUserInfo (element) {
    var elemUser = document.getElementById(element);
    if (elemUser) {
        elemUser.innerHTML = `${usuarioCorrente.nome} (${usuarioCorrente.login}) 
                    <a onclick="logoutUser()">❌</a>`;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    let formLogin = document.getElementById('loginForm');
    if (formLogin) {
        formLogin.addEventListener('submit', function (event) {
            event.preventDefault();
            let login = document.getElementById('username').value;
            let senha = document.getElementById('password').value;
            if (!login || !senha) {
                console.log("Por favor, preencha todos os campos.");
                return;
            }
            if (loginUser(login, senha)) {
                window.location.href = RETURN_URL;
            } else {
                console.log("Login ou senha incorretos.");
            }
        });

        
    }
    
});


document.addEventListener('DOMContentLoaded', function () {
    let formCadastro = document.getElementById('cadastroForm');
    if (!formCadastro) return;
    formCadastro.addEventListener('submit', function (e) {
        e.preventDefault();
        let nome = document.getElementById('nome').value;
        let login = document.getElementById('login').value;
        let email = document.getElementById('email').value;
        let senha = document.getElementById('password').value;
        if (!nome || !login || !senha || !email) {
            console.log("Por favor, preencha todos os campos.");
            return;
        }
        if (usuarioExiste(login, email)) {
            displayMessage("Já existe um usuário cadastrado com esse login ou email.");
            return;
        }
        addUser(nome, login, senha, email);
        formCadastro.reset();
        window.location.href = LOGIN_URL;
    });
});

document.addEventListener('DOMContentLoaded', function () {
    let logoutLink = document.getElementById('logout');
    if (logoutLink) {
        logoutLink.addEventListener('click', function (e) {
            e.preventDefault();
            logoutUser();
        });
    }
});

function atualizarMenu() {
    const nav = document.getElementById('navMenu');
    if (!nav) return;

    nav.querySelectorAll('.nav-dinamico').forEach(el => el.remove());

    const usuario = sessionStorage.getItem('usuarioCorrente')
        ? JSON.parse(sessionStorage.getItem('usuarioCorrente'))
        : null;

    if (usuario) {
        const linkFav = document.createElement('a');
        linkFav.href = 'favoritos.html';
        linkFav.textContent = '♡ Favoritos';
        linkFav.className = 'nav-dinamico';
        nav.appendChild(linkFav);

        if (usuario.tipo === 'ADMIN' || usuario.admin === true) {
            const linkCad = document.createElement('a');
            linkCad.href = 'cadastro_lojas.html';
            linkCad.textContent = 'Gerenciar Lojas';
            linkCad.className = 'nav-dinamico';
            nav.appendChild(linkCad);
        }

        const btnLogout = document.createElement('a');
        btnLogout.href = '#';
        btnLogout.id = 'logout';
        btnLogout.textContent = `Sair (${usuario.login})`;
        btnLogout.className = 'nav-dinamico nav-logout';
        btnLogout.addEventListener('click', (e) => { e.preventDefault(); logoutUser(); });
        nav.appendChild(btnLogout);
    } else {
        const linkLogin = document.createElement('a');
        linkLogin.href = 'login.html';
        linkLogin.textContent = 'Entrar';
        linkLogin.className = 'nav-dinamico';
        nav.appendChild(linkLogin);
    }
}

initLoginApp();


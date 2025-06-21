const LOGIN_URL = "login.html";
const apiUrl = "http://localhost:3000/usuarios";

var db_usuarios = [];
var usuarioCorrente = null;

// Função para gerar códigos randômicos (UUID)
function generateUUID() {
    var d = new Date().getTime();
    var d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;
        if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}


const dadosIniciais = {
    usuarios: [
        { "id": generateUUID(), "login": "admin", "senha": "123", "nomecompleto": "Administrador do Sistema", "email": "admin@abc.com", "admin": true, "favoritos": [] },
        { "id": generateUUID(), "login": "user", "senha": "123", "nomecompleto": "Usuario Comum", "email": "user@abc.com", "admin": false, "favoritos": [] },
    ]
};

// Inicializa usuarioCorrente e banco de dados de usuários
function initLoginApp(callback) {
    const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');

    if (usuarioCorrenteJSON) {
        usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
    } else {
        usuarioCorrente = null;
    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            db_usuarios = data;
            if (callback) callback();  // Executa callback após carregar usuários
        })
        .catch(error => {
            console.error('Erro ao ler usuários via API JSONServer:', error);
            displayMessage("Erro ao ler usuários");
        });
}

// Função de login
function loginUser(email, senha) {
  for (var i = 0; i < db_usuarios.length; i++) {
    var usuario = db_usuarios[i];
    if (email == usuario.email && senha == usuario.senha) {
      usuarioCorrente = {
        id: usuario.id,
        login: usuario.login,
        email: usuario.email,
        nomecompleto: usuario.nomecompleto,
        admin: usuario.admin,
        favoritos: usuario.favoritos || []
      };
      sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));
      return true;
    }
  }
  return false;
}



// Função para adicionar novo usuário
function addUser(nome, login, senha, email, admin) {
  let newId = generateUUID();
  let usuario = { "id": newId, "login": login, "senha": senha, "nomecompleto": nome, "email": email, "admin": admin, favoritos: [] };

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(usuario),
  })
  .then(response => {
    if (!response.ok) throw new Error("Erro ao inserir usuário");
    return response.json();
  })
  .then(data => {
    db_usuarios.push(data);
  })
  .catch(error => {
    console.error('Erro ao inserir usuário via API JSONServer:', error);
    alert("Erro ao inserir usuário");
  });
}


// Inicializa LoginApp
initLoginApp();




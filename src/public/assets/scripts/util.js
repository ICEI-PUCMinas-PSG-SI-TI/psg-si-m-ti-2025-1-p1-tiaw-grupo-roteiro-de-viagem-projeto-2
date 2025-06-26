const API_URL = "http://localhost:3000/duvidas";

// Carrega e exibe os comentários do usuário logado
async function carregarComentarios() {
    const container = document.getElementById("comentarios");
    if (!container) return;

    container.innerHTML = "<p>Carregando dúvidas...</p>";

    try {
        const resposta = await fetch(API_URL);
        const duvidas = await resposta.json();

        container.innerHTML = "";

        if (duvidas.length === 0) {
            container.innerHTML = "<p>Nenhuma dúvida encontrada.</p>";
            return;
        }

        // Obter usuário logado do sessionStorage
        const usuarioSalvo = sessionStorage.getItem("usuarioCorrente");
        let usuario = null;
        
        if (usuarioSalvo) {
            usuario = JSON.parse(usuarioSalvo);
        }

        // Filtrar apenas as dúvidas do usuário logado
        const duvidasUsuario = usuario 
            ? duvidas.filter(duvida => duvida.usuario && duvida.usuario.id === usuario.id)
            : [];

        if (duvidasUsuario.length === 0) {
            container.innerHTML = "<p>Você ainda não enviou nenhuma dúvida.</p>";
            return;
        }

        // Ordena por data (mais recente primeiro)
        duvidasUsuario.sort((a, b) => new Date(b.data) - new Date(a.data));
        
        duvidasUsuario.forEach((duvida) => {
            const div = document.createElement('div');
            div.className = 'comentario';
            
            div.innerHTML = `
                <p><strong>ENVIADO POR:</strong> ${duvida.usuario.nome.toUpperCase()}</p>
                <p><strong>DÚVIDA:</strong> ${duvida.texto}</p>
                ${duvida.contato ? `<p><strong>CONTATO:</strong> ${duvida.contato}</p>` : ''}
                <p class="text-muted"><small>${new Date(duvida.data).toLocaleString('pt-BR')}</small></p>
                <button class="btn btn-danger btn-sm btn-excluir" data-id="${duvida.id}">Excluir</button>
            `;
            container.appendChild(div);
        });

        // Adiciona eventos aos botões de excluir
        document.querySelectorAll('.btn-excluir').forEach(btn => {
            btn.addEventListener('click', async function() {
                const id = this.getAttribute('data-id');
                await excluirComentario(id);
            });
        });

    } catch (erro) {
        console.error("Erro ao carregar dúvidas:", erro);
        container.innerHTML = `<p class="text-danger">Erro ao carregar dúvidas: ${erro.message}</p>`;
    }
}

// Função para excluir um comentário específico
async function excluirComentario(id) {
    if (!confirm('Tem certeza que deseja excluir esta dúvida?')) {
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (resposta.ok) {
            carregarComentarios();
            alert('Dúvida excluída com sucesso!');
        } else {
            throw new Error('Erro ao excluir dúvida');
        }
    } catch (erro) {
        console.error("Erro ao excluir dúvida:", erro);
        alert('Erro ao excluir dúvida. Tente novamente.');
    }
}

// Adiciona um novo comentário
async function adicionarComentario() {
    const inputTexto = document.getElementById('inputComentario');
    const inputContato = document.getElementById('inputContato');
    if (!inputTexto || !inputContato) return;

    const texto = inputTexto.value.trim();
    const contato = inputContato.value.trim();

    if (!texto) {
        alert('Por favor, digite sua dúvida.');
        return;
    }

    // Obter usuário logado do sessionStorage
    const usuarioSalvo = sessionStorage.getItem("usuarioCorrente");
    let usuario = null;
    
    if (usuarioSalvo) {
        usuario = JSON.parse(usuarioSalvo);
    }

    const novaDuvida = {
        texto: texto,
        contato: contato,
        data: new Date().toISOString(),
        usuario: usuario ? {
            id: usuario.id,
            nome: usuario.nomecompleto || usuario.login || "Anônimo",
            login: usuario.login
        } : null
    };

    try {
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novaDuvida)
        });

        if (resposta.ok) {
            inputTexto.value = '';
            inputContato.value = '';
            carregarComentarios();
            alert('Dúvida enviada com sucesso!');
        } else {
            throw new Error('Erro ao enviar dúvida');
        }
    } catch (erro) {
        console.error("Erro ao enviar dúvida:", erro);
        alert('Erro ao enviar dúvida. Tente novamente.');
    }
}

// Atualiza o nome do usuário no cabeçalho
function atualizarNomeUsuario() {
    const usuarioSalvo = sessionStorage.getItem("usuarioCorrente");
    const nomeLoginElement = document.getElementById("nomelogin");
    
    if (usuarioSalvo && nomeLoginElement) {
        const usuario = JSON.parse(usuarioSalvo);
        // Convertendo para maiúsculas
        nomeLoginElement.textContent = (usuario.nomecompleto || usuario.login).toUpperCase();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Atualiza o nome do usuário no cabeçalho
    atualizarNomeUsuario();

    // Configura o botão de voltar
    document.getElementById('button_voltar')?.addEventListener('click', function() {
        window.history.back();
    });

    document.getElementById('logo')?.addEventListener('click', function() {
        window.history.back();
    });

    // Configura o botão de enviar
    document.querySelector('.btn-enviar')?.addEventListener('click', adicionarComentario);

    // Carrega os comentários do usuário
    carregarComentarios();
});
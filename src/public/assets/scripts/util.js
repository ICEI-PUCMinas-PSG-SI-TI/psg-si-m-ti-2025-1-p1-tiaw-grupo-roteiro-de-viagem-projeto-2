const API_URL = "http://localhost:3000/duvidas";

// Carrega e exibe os comentários
async function carregarComentarios() {
    const container = document.getElementById("comentarios");
    if (!container) return;

    container.innerHTML = "<p>Carregando comentários...</p>";

    try {
        const resposta = await fetch(API_URL);
        const comentarios = await resposta.json();

        container.innerHTML = "";

        if (comentarios.length === 0) {
            container.innerHTML = "<p>Nenhum comentário encontrado.</p>";
            return;
        }

        comentarios.forEach((comentario) => {
            const div = document.createElement('div');
            div.className = 'comentario mb-3 p-3 border rounded';
            div.innerHTML = `
                <p><strong>Comentário:</strong> ${comentario.texto}</p>
                <p><strong>Contato:</strong> ${comentario.contato || 'Não informado'}</p>
                <p><small><strong>Data:</strong> ${new Date(comentario.data).toLocaleString('pt-BR')}</small></p>
            `;
            container.appendChild(div);
        });
    } catch (erro) {
        console.error("Erro ao carregar comentários:", erro);
        container.innerHTML = "<p class='text-danger'>Erro ao carregar comentários. Verifique se o servidor está rodando.</p>";
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
        alert('Por favor, digite um comentário.');
        return;
    }

    if (!contato) {
        alert('Por favor, informe seu contato.');
        return;
    }

    const novoComentario = {
        texto: texto,
        contato: contato,
        data: new Date().toISOString()
    };

    try {
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoComentario)
        });

        if (resposta.ok) {
            inputTexto.value = '';
            inputContato.value = '';
            carregarComentarios();
            alert('Comentário adicionado com sucesso!');
        } else {
            throw new Error('Erro ao adicionar comentário');
        }
    } catch (erro) {
        console.error("Erro ao adicionar comentário:", erro);
        alert('Erro ao adicionar comentário. Tente novamente.');
    }
}

// Função para apagar todos os comentários
async function apagarTodosComentarios() {
    if (!confirm('Tem certeza que deseja apagar TODOS os comentários?')) {
        return;
    }

    try {
        const resposta = await fetch(API_URL);
        const comentarios = await resposta.json();

        for (const comentario of comentarios) {
            await fetch(`${API_URL}/${comentario.id}`, { method: "DELETE" });
        }

        carregarComentarios();
        alert('Todos os comentários foram apagados!');
    } catch (erro) {
        console.error("Erro ao apagar todos os comentários:", erro);
        alert('Erro ao apagar todos os comentários.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const comentariosDiv = document.getElementById('comentarios');
    const btnVer = document.querySelector('.btn-ver');
    const btnEnviar = document.querySelector('.btn-enviar');
    const btnApagar = document.querySelector('.btn-apagar');
    const isIndex3 = window.location.pathname.endsWith("index3.htm");

    // Só carrega comentários automaticamente se NÃO for a index.htm e NÃO for index3.htm
    if (comentariosDiv && window.location.pathname !== "/index.htm" && !isIndex3) {
        carregarComentarios();
    }

    // Se existe o botão de enviar, adiciona evento
    if (btnEnviar) {
        btnEnviar.addEventListener('click', adicionarComentario);
    }

    // Se está no index.htm, botão redireciona
    if (btnVer && window.location.pathname.endsWith("index.htm")) {
        btnVer.addEventListener('click', function() {
            window.location.href = "index3.htm";
        });
    }

    // Se está no index3.htm, oculta comentários e só mostra ao clicar no botão
    if (comentariosDiv && btnVer && isIndex3) {
        comentariosDiv.style.display = "none";
        btnVer.addEventListener('click', function() {
            comentariosDiv.style.display = "block";
            carregarComentarios();
        });
    }

    // Se está no index3.htm, ativa o botão apagar
    if (btnApagar && isIndex3) {
        btnApagar.addEventListener('click', apagarTodosComentarios);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const comentariosDiv = document.getElementById('comentarios');
    const btnVer = document.querySelector('.btn-ver');
    const btnEnviar = document.querySelector('.btn-enviar');
    const btnApagar = document.querySelector('.btn-apagar');
    const btnArzenamentos = document.querySelector('.btn-arzenamentos');
    const isIndex2 = window.location.pathname.endsWith("index2.htm");
    const isIndex3 = window.location.pathname.endsWith("index3.htm");

    // Só carrega comentários automaticamente se NÃO for a index.htm, index2.htm ou index3.htm
    if (comentariosDiv && !window.location.pathname.endsWith("index.htm") && !isIndex2 && !isIndex3) {
        carregarComentarios();
    }

    // Se existe o botão de enviar, adiciona evento
    if (btnEnviar) {
        btnEnviar.addEventListener('click', adicionarComentario);
    }

    // Botão ARMAZENAMENTOS leva para index3.htm
    if (btnArzenamentos) {
        btnArzenamentos.addEventListener('click', function() {
            window.location.href = "index3.htm";
        });
    }

    // Se está no index2.htm ou index3.htm, oculta comentários e só mostra ao clicar no botão
    if (comentariosDiv && btnVer && (isIndex2 || isIndex3)) {
        comentariosDiv.style.display = "none";
        btnVer.addEventListener('click', function() {
            comentariosDiv.style.display = "block";
            carregarComentarios();
        });
    }

    // Se está no index2.htm ou index3.htm, ativa o botão apagar
    if (btnApagar && (isIndex2 || isIndex3)) {
        btnApagar.addEventListener('click', apagarTodosComentarios);
    }
});
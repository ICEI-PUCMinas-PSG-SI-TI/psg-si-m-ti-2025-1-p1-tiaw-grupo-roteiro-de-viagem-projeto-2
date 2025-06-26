// Seleciona o corpo da tabela
const tabelaBody = document.querySelector("tbody");

// Carrega as recomendações da API
function carregarRecomendacoes() {
  fetch("http://localhost:3000/recomendacoes")
    .then(res => res.json())
    .then(recomendacoes => {
      tabelaBody.innerHTML = "";

      // Exibe apenas as recomendações pendentes
      const pendentes = recomendacoes.filter(r => r.status === "pendente");

      pendentes.forEach(rec => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${rec.usuario}</td>
          <td>${rec.nome_cidade.toUpperCase()}, ${rec.nome_estado}</td>
          <td>
            <button class="btn green" data-id="${rec.id}">✔️</button>
            <button class="btn red" data-id="${rec.id}">✖️</button>
          </td>
        `;

        tabelaBody.appendChild(tr);
      });

      adicionarEventosBotoes();
    });
}

// Função que liga os botões às ações
function adicionarEventosBotoes() {
  document.querySelectorAll(".btn.green").forEach(botao => {
    botao.addEventListener("click", () => {
      const id = botao.getAttribute("data-id");
      aceitarRecomendacao(id);
    });
  });

  document.querySelectorAll(".btn.red").forEach(botao => {
    botao.addEventListener("click", () => {
      const id = botao.getAttribute("data-id");
      recusarRecomendacao(id);
    });
  });
}

// Aceitar recomendação
function aceitarRecomendacao(id) {
  fetch(`http://localhost:3000/recomendacoes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status: "aceito" })
  })
    .then(() => {
      alert(`Recomendação ${id} aceita com sucesso!`);
      carregarRecomendacoes(); // Atualiza a tabela
    })
    .catch(err => console.error("Erro ao aceitar recomendação:", err));
}

// Recusar recomendação (deletar do json-server)
function recusarRecomendacao(id) {
  if (confirm("Tem certeza que deseja recusar esta recomendação?")) {
    fetch(`http://localhost:3000/recomendacoes/${id}`, {
      method: "DELETE"
    })
    .then(() => {
      alert(`Recomendação ${id} recusada.`);
      carregarRecomendacoes(); // Atualiza
    })
    .catch(err => {
      console.error("Erro ao recusar recomendação:", err);
    });
  }
}

// Carrega ao iniciar
carregarRecomendacoes();
document.getElementById("voltarBtn").addEventListener("click", () => {
    window.history.back();
});
const tabelaBody = document.querySelector("tbody");

function carregarRecomendacoes() {
  fetch("http://localhost:3000/recomendacoes")
    .then(response => response.json())
    .then(recomendacoes => {
      tabelaBody.innerHTML = ""; // limpa a tabela

      recomendacoes.forEach(rec => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${rec.usuario}</td>
          <td>${rec.nome_cidade.toUpperCase()}, ${rec.nome_estado}</td>
          <td>
            <button class="btn green" onclick="aceitarRecomendacao('${rec.id}')">✔️</button>
            <button class="btn red" onclick="recusarRecomendacao('${rec.id}')">✖️</button>
          </td>
        `;

        tabelaBody.appendChild(tr);
      });
    });
}

function aceitarRecomendacao(id) {
  alert(`Recomendação ${id} aceita!`);
  // Exemplo: futuramente pode enviar PATCH com status: "aceita"
}

function recusarRecomendacao(id) {
  if (confirm("Tem certeza que deseja recusar esta recomendação?")) {
    fetch(`http://localhost:3000/recomendacoes/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        alert(`Recomendação ${id} recusada com sucesso.`);
        carregarRecomendacoes(); // Atualiza a tabela
      })
      .catch(err => console.error("Erro ao recusar:", err));
  }
}

// Chama a função ao iniciar
carregarRecomendacoes();
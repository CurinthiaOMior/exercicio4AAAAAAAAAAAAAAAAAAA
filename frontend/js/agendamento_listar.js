const token = localStorage.getItem('token')

// Proteção da rota privada: se não tem token, redireciona para a Home
if (!token) {
    location.href = '../index.html'
}

let resposta = document.getElementById('resposta')
let btn_listar = document.getElementById('btn_listar')

btn_listar.addEventListener('click', (e) => {
    e.preventDefault()

    fetch('http://localhost:3000/agendamentos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
        .then(res => {
            if (!res.ok) {
                localStorage.clear()
                alert('Faça login novamente, tempo expirado!')
                location.href = '../index.html'
                throw new Error('Sessão expirada')
            }
            return res.json()
        })
        .then(dados => {
            resposta.innerHTML = ''
            resposta.innerHTML += `
            <table border="1">
                ${criarThead()}
                ${criarTbody(dados)}
            </table>
        `
        })
        .catch((err) => {
            console.error('Erro ao listar os dados', err)
            resposta.innerHTML = '<p>Erro ao conectar com o servidor.</p>'
        })
})

function criarTbody(dados) {
    let corpo = '<tbody>'
    dados.forEach(el => {
        const nomeCliente = el.ClienteAgendamento ? el.ClienteAgendamento.nome : 'N/A'
        const dadosVeiculo = el.VeiculoAgendamento
            ? `${el.VeiculoAgendamento.modelo} - ${el.VeiculoAgendamento.marca} (${el.VeiculoAgendamento.placa})`
            : 'N/A'
        const dataFormatada = new Date(el.data).toLocaleString('pt-BR')

        corpo += `<tr>`
        corpo += `<td>${el.codAgendamento}</td>`
        corpo += `<td>${dataFormatada}</td>`
        corpo += `<td>${el.tipo}</td>`
        corpo += `<td>${nomeCliente}</td>`
        corpo += `<td>${dadosVeiculo}</td>`
        corpo += `</tr>`
    })
    corpo += `</tbody>`
    return corpo
}

function criarThead() {
    return `
        <thead>
            <tr>
                <th>Código</th>
                <th>Data e Hora</th>
                <th>Tipo</th>
                <th>Cliente</th>
                <th>Veículo</th>
            </tr>
        </thead>
    `
}

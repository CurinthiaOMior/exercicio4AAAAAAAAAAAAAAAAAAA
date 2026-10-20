const token = localStorage.getItem('token')

// Proteção da rota privada: se não houver token, redireciona para a Home
if (!token) {
    location.href = '../index.html'
}

const btn_atualizar = document.getElementById('btn_atualizar')
const resposta = document.getElementById('resposta')

btn_atualizar.addEventListener('click', (e) => {
    e.preventDefault()

    const id = document.getElementById('id').value

    // Envia apenas os campos preenchidos (evita mandar "" ou 0 para o servidor)
    const valores = {}
    const data = document.getElementById('data').value
    const tipo = document.getElementById('tipo').value
    const idVeiculo = document.getElementById('idVeiculo').value
    const idCliente = document.getElementById('idCliente').value

    if (data) valores.data = data
    if (tipo) valores.tipo = tipo
    if (idVeiculo) valores.idVeiculo = Number(idVeiculo)
    if (idCliente) valores.idCliente = Number(idCliente)

    fetch(`http://localhost:3000/agendamento/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(valores)
    })
        .then(res => {
            if (res.status === 401 || res.status === 403) {
                localStorage.clear()
                alert('Faça login novamente, tempo expirado!')
                location.href = '../index.html'
                throw new Error('Sessão expirada')
            }
            return res.json().then(dados => ({ ok: res.ok, dados }))
        })
        .then(({ ok, dados }) => {
            resposta.innerHTML = `<p>${dados.message}</p>`
            if (ok) document.querySelector('form').reset()
        })
        .catch(err => {
            console.error('Erro ao atualizar agendamento:', err)
            resposta.innerHTML = '<p>Erro ao tentar conectar com o servidor.</p>'
        })
})

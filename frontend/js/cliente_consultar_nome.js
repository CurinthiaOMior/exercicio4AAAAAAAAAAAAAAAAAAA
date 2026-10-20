const token = localStorage.getItem('token')

if (!token) {
    location.href = '../index.html'
}

const btn_consultar = document.getElementById('btn_consultar')
const resposta = document.getElementById('resposta')

btn_consultar.addEventListener('click', (e) => {
    e.preventDefault()

    const nome = document.getElementById('nome').value

    fetch(`http://localhost:3000/cliente/buscarNome/${encodeURIComponent(nome)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
        .then(res => {
            // Só trata como sessão expirada quando o servidor negar o acesso
            if (res.status === 401 || res.status === 403) {
                localStorage.clear()
                alert('Faça login novamente, tempo expirado!')
                location.href = '../index.html'
                throw new Error('Sessão expirada')
            }
            return res.json()
        })
        .then(dados => {
            if (dados.message) {
                resposta.innerHTML = `<p>${dados.message}</p>`
            } else {
                resposta.innerHTML = ''
                resposta.innerHTML += `
                <table>
                    ${criarThead()}
                    ${criarTbody([dados])}
                </table>
                `
            }
        })
        .catch(err => {
            console.error('Erro ao consultar cliente:', err)
            resposta.innerHTML = '<p>Erro ao conectar com o servidor.</p>'
        })
})

function criarTbody(dados) {
    let corpo = '<tbody>'
    dados.forEach(el => {
        corpo += `<tr>`
        corpo += `<td>${el.codCliente}</td>`
        corpo += `<td>${el.nome}</td>`
        corpo += `<td>${el.email}</td>`
        corpo += `<td>${el.cpf}</td>`
        corpo += `<td>${el.endereco}</td>`
        corpo += `<td>${el.celular}</td>`
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
                <th>Nome</th>
                <th>Email</th>
                <th>CPF</th>
                <th>Endereço</th>
                <th>Celular</th>
            </tr>
        </thead>
    `
}

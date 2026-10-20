const token = localStorage.getItem('token')

// Proteção da rota privada: se não houver token, redireciona para a Home
if (!token) {
    location.href = '../index.html'
}

const btn_apagar = document.getElementById('btn_apagar')
const resposta = document.getElementById('resposta')

btn_apagar.addEventListener('click', (e) => {
    e.preventDefault()

    const id = document.getElementById('id').value

    if (!id) {
        resposta.innerHTML = '<p>Informe o Código do Cliente!</p>'
        return
    }

    if (!confirm('Tem certeza que deseja excluir este cliente?')) {
        return
    }

    fetch(`http://localhost:3000/cliente/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
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
            console.error('Erro ao apagar cliente:', err)
            resposta.innerHTML = '<p>Erro ao tentar conectar com o servidor.</p>'
        })
})

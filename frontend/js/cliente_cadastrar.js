const btn_cadastrar = document.getElementById('btn_cadastrar')
const resposta = document.getElementById('resposta')

btn_cadastrar.addEventListener('click', (e) => {
    e.preventDefault()

    const valores = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value,
        cpf: document.getElementById('cpf').value,
        endereco: document.getElementById('endereco').value,
        celular: document.getElementById('celular').value
    }

    fetch('http://localhost:3000/cliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(valores)
    })
    .then(res => res.json().then(dados => ({ ok: res.ok, dados })))
    .then(({ ok, dados }) => {
        resposta.innerHTML = `<p>${dados.message}</p>`
        if (ok) document.querySelector('form').reset()
    })
    .catch(err => {
        console.error('Erro ao cadastrar cliente:', err)
        resposta.innerHTML = '<p>Erro ao tentar conectar com o servidor.</p>'
    })
})

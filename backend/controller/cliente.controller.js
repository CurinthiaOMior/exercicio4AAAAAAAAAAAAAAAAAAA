const Cliente = require('../models/Cliente')
const CryptoJS = require('crypto-js')
const CHAVE_SECRETA = 'segredo'

const cadastrar = async (req, res) => {
    const valores = req.body

    if (!valores.nome || !valores.email || !valores.senha || !valores.cpf || !valores.endereco || !valores.celular) {
        return res.status(400).json({ message: 'Todos os campos (nome, email, senha, cpf, endereço, celular) são obrigatórios!' })
    }

    if (valores.cpf.length !== 11) {
        return res.status(400).json({ message: 'O CPF deve conter exatamente 11 dígitos!' })
    }

    try {
        const cpfCriptografado = CryptoJS.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString()
        const senhaCriptografada = CryptoJS.AES.encrypt(valores.senha, CHAVE_SECRETA).toString()

        await Cliente.create({
            nome: valores.nome,
            email: valores.email,
            senha: senhaCriptografada,
            cpf: cpfCriptografado,
            endereco: valores.endereco,
            celular: valores.celular
        })

        return res.status(201).json({ message: 'Cliente cadastrado com sucesso!' })
    } catch (err) {
        console.error('Erro ao cadastrar Cliente:', err)
        return res.status(500).json({ message: 'Erro ao cadastrar cliente!' })
    }
}

const listar = async (req, res) => {
    try {
        const cliente = await Cliente.findAll()
        let resultado = []

        cliente.forEach((el)=>{
            let cpfDescriptografado = ''
            try{
                const bytes = CryptoJS.AES.decrypt(el.cpf, CHAVE_SECRETA)
                cpfDescriptografado = bytes.toString(CryptoJS.enc.Utf8)
            }catch(err){
                cpfDescriptografado = 'Erro ao descriptografar'
                console.error(cpfDescriptografado, err)
            }
            resultado.push({
                codCliente: el.codCliente,
                nome: el.nome,
                email: el.email,
                cpf: cpfDescriptografado,
                endereco: el.endereco,
                celular: el.celular
            })
        })

        return res.status(200).json(resultado)
    } catch (err) {
        console.error('Erro ao listar cliente:', err)
        return res.status(500).json({ message: 'Erro ao listar cliente!' })
    }
}

const consultar = async (req, res) => {
    const id = req.params.id
    try {
        const cliente = await Cliente.findByPk(id)
        if (!cliente) {
            return res.status(404).json({ message: 'cliente não encontrado!' })
        }

        const bytes = CryptoJS.AES.decrypt(cliente.cpf, CHAVE_SECRETA)
        console.log('bytes = ',bytes)
        const cpfDescriptografado = bytes.toString(CryptoJS.enc.Utf8)
        console.log('cpf descriptografado = ',cpfDescriptografado)

        return res.status(200).json({
            codCliente: cliente.codCliente,
            nome: cliente.nome,
            email: cliente.email,
            cpf: cpfDescriptografado,
            endereco: cliente.endereco,
            celular: cliente.celular
        })
    } catch (err) {
        console.error('Erro ao consultar cliente:', err)
        return res.status(500).json({ message: 'Erro ao consultar cliente!' })
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id
    const valores = req.body

    try {
        const cliente = await Cliente.findByPk(id)
        if (!cliente) {
            return res.status(404).json({ message: 'cliente não encontrado!' })
        }

        const dadosAtualizados = { ...valores }

        if (valores.cpf) {
            if (valores.cpf.length !== 11) {
                return res.status(400).json({ message: 'O CPF deve conter exatamente 11 dígitos!' })
            }
            dadosAtualizados.cpf = CryptoJS.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString()
        }

        if (valores.senha) {
            dadosAtualizados.senha = CryptoJS.AES.encrypt(valores.senha, CHAVE_SECRETA).toString()
        }

        await Cliente.update(dadosAtualizados, { where: { codCliente: id } })
        return res.status(200).json({ message: 'Cliente atualizado com sucesso!' })
    } catch (err) {
        console.error('Erro ao atualizar Cliente:', err)
        return res.status(500).json({ message: 'Erro ao atualizar Cliente!' })
    }
}

const apagar = async (req, res) => {
    const id = req.params.id
    try {
        const cliente = await Cliente.findByPk(id)
        if (!cliente) {
            return res.status(404).json({ message: 'cliente não encontrado!' })
        }

        await Cliente.destroy({ where: { codcliente: id } })
        return res.status(200).json({ message: 'cliente excluído com sucesso!' })
    } catch (err) {
        console.error('Erro ao apagar cliente:', err)
        return res.status(500).json({ message: 'Erro ao apagar cliente!' })
    }
}

const consultarNome = async (req, res) => {
    const nome = req.params.nome

    try {
        const cliente = await Cliente.findOne({ where: { nome: nome } })

        if (!cliente) {
            return res.status(404).json({ message: 'cliente não encontrado!' })
        }

        const bytes = CryptoJS.AES.decrypt(cliente.cpf, CHAVE_SECRETA)
        const cpfDescriptografado = bytes.toString(CryptoJS.enc.Utf8)

        return res.status(200).json({
            codCliente: cliente.codCliente,
            nome: cliente.nome,
            email: cliente.email,
            cpf: cpfDescriptografado,
            endereco: cliente.endereco,
            celular: cliente.celular
        })
    } catch (err) {
        console.error('Erro ao consultar Cliente por nome:', err)
        return res.status(500).json({ message: 'Erro ao consultar Cliente por nome!' })
    }
}

module.exports = { cadastrar, listar, consultar, atualizar, apagar, consultarNome }	  	
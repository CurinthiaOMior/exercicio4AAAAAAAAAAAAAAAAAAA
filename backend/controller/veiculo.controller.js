const Veiculo = require('../models/Veiculo')
const Cliente = require('../models/Cliente')
const CryptoJS = require('crypto-js')

const CHAVE_SECRETA = 'segredo'

const cadastrar = async (req, res) => {
    const valores = req.body

    if (!valores.modelo || !valores.marca || !valores.placa || !valores.codigoRastreio || !valores.idCliente) {
        return res.status(400).json({ message: 'Todos os campos (modelo, marca, placa, codigoRastreio, idCliente) são obrigatórios!' })
    }

    try {
        const cliente = await Cliente.findByPk(valores.idCliente)
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente informado não existe!' })
        }
        const codigoRastreioCriptografado = CryptoJS.AES.encrypt(valores.codigoRastreio, CHAVE_SECRETA).toString()
        const novaVeiculo = await Veiculo.create({
            modelo: valores.modelo,
            marca: valores.marca,
            placa: valores.placa,
            codigoRastreio: codigoRastreioCriptografado,
            idCliente: valores.idCliente
        })
        return res.status(201).json({ message: 'Veiculo cadastrada com sucesso!', veiculo: novaVeiculo })
    } catch (err) {
        console.error('Erro ao cadastrar Veiculo:', err)
        return res.status(500).json({ message: 'Erro ao cadastrar Veiculo!' })
    }
}

module.exports = { cadastrar }
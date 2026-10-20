const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Agendamento = db.define('agendamento', {
    codAgendamento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    data: {
        type: DataTypes.DATE,
        allowNull: false
    },
    tipo: {
        type: DataTypes.ENUM('revisao', 'manutencao', 'instalacao'),
        allowNull: false
    },
    idVeiculo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'veiculos',
            key: 'codVeiculo'
        }
    },
    idCliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'clientes',
            key: 'codCliente'
        }
    }
}, {
    timestamps: false,
    tableName: 'agendamentos'
})

module.exports = Agendamento
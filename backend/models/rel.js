const Agendamento = require("./Agendamento")
const Cliente = require("./Cliente")
const Veiculo = require("./Veiculo")



Cliente.hasMany(Veiculo, { 
    foreignKey: 'idCliente', 
    as: 'VeiculosCliente', 
    onDelete: 'CASCADE' })

Veiculo.belongsTo(Cliente, {
    foreignKey: 'idCliente', 
    as: 'ClienteVeiculo',
    allowNull: false
})

Veiculo.hasMany(Agendamento, {
    foreignKey: 'idVeiculo',
    as: 'agendamentosVeiculo',
    onDelete: 'CASCADE'
})

Agendamento.belongsTo(Veiculo, {
    foreignKey: 'idVeiculo', 
    as: 'VeiculoAgendamento',
    allowNull: false
})

Cliente.hasMany(Agendamento, {
    foreignKey: 'idCliente',
    as: 'agendamentosCliente',
    onDelete: 'CASCADE'
})
Agendamento.belongsTo(Cliente, {
    foreignKey: 'idCliente',
    as: 'ClienteAgendamento',
    allowNull: false
})

module.exports = { Cliente, Veiculo, Agendamento }
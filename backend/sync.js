const { Cliente, Veiculo, Agendamento } = require('./models/rel')
const db = require('./db/conn')

async function syncDB(){
    try{
        await db.sync({ force: true })
    }catch(err){
        console.log('erro', err)
    }finally{
        await db.close()
        console.log('fechando')
    }
}
syncDB()
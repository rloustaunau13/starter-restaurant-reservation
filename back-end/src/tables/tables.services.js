


const knex = require("../db/connection");


async function update(table) {
  
    const table_id = table.table_id;
  //  table.reservation_id=null;
   
  // Update the table with the given table_id to set occupied to true and status to "seated"
  await knex('tables')
  .where('table_id', '=', table_id)
  .update(table);


    //  return the updated table
    const updatedTable = await knex('tables').where({ table_id: table_id }).first();



    return updatedTable;
}


async function create(table) {

    
    const insertedTablesIds = await knex('tables')
    .returning('table_id')  // This returns the inserted reservation_id
    .insert(table);

  const insertedTable = await knex('tables').where({ table_id: insertedTablesIds[0] }).first();


 
  return  insertedTable;
}

async function list() {
    const tables = await knex('tables').orderBy('table_name');

  return  tables;
}


async function readReservation(id) {
  

  


    // console.log("movieId"+movieId);
   return knex('reservations')
         .select('*')
         .where({ 'reservation_id': id })
         .first();
     
     
   }
   async function read(tableId) {
  
   console.log("tableID"+tableId);
   return knex('tables')
         .select('*')
         .where({ 'table_id': tableId })
         .first();
     
     
   }

   async function readReservationWithTableId(table_Id) {
  
    // console.log("movieId"+movieId);
   return knex('reservations')
         .select('*')
         .where({ 'table_id': table_Id })
         .first();
     
     
   }

   async function deleteReserv(reservation) {
    return knex("reservations")
      .where({ reservation_id: reservation.reservation_id })
      .update({ status: "finished" });
  }

module.exports = {
    create,
    list,
    readReservation,
    read,
    update,
    readReservationWithTableId,
    deleteReserv,
   };
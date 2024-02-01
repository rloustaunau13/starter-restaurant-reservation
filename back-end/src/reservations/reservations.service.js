

  
const knex = require("../db/connection");





async function isReservationTimeAvailable(reservation_time, reservation_date) {
  // Implement your logic to check if the reservation time is available
  // For example, you can query the database to check if there's any existing reservation for the given time
  const existingReservations = await knex('reservations')
    .where({
      reservation_date: reservation_date,
      reservation_time: reservation_time,
    })
    .select();

  return existingReservations.length === 0; // Return true if no existing reser
  }
  
    
async function create(reservation) {

    
    const insertedReservationIds = await knex('reservations')
    .returning('reservation_id')  // This returns the inserted reservation_id
    .insert(reservation);
  

  const insertedReservation = await knex('reservations').where({ reservation_id: insertedReservationIds[0] }).first();


 
  return  insertedReservation;
}



async function update(reservation) {


  

    await knex('reservations')
    .where('reservation_id', '=', reservation.reservation_id)
    .update(reservation);
  

    //  return the updated table
    const updatedTable = await knex('reservations').where({ reservation_id: reservation.reservation_id }).first();


    
   
    return updatedTable;

}
  
  

async function list(param) {
    
    if(!param){
        let all=await knex('reservations')
        .select("*")
        .andWhere(function() {
            this.where('status', 'booked')
              .orWhere('status', 'seated')
              .orWhereNull('status'); // Assuming an empty string is considered as null
          })
          .orderBy('reservation_time', 'asc');
      


        return all;
    }

    let res1 = await knex('reservations')
    .select("*")
    .where({ reservation_date: param })
    .andWhere(function() {
      this.where('status', 'booked')
        .orWhere('status', 'seated')
        .orWhereNull('status'); // Assuming an empty string is considered as null
    })
    .orderBy('reservation_time', 'asc');

  return res1;
    }



    async function read(reservationId) {

      return knex('reservations')
            .select('*')
            .where({ 'reservation_id': reservationId })
            .first();
        
        
      }
      


      async function listMobileNumber(mobileNumber) {

           
            return knex('reservations')
              .select('*')
              .where('mobile_number', 'like', `%${mobileNumber}%`);



          }
        
    
         
 




  module.exports = {
    create,
    list,
    isReservationTimeAvailable,
    read,
    update,
    listMobileNumber,
    update
  
   };
    
// To this line
const service = require("./tables.services");

const reservationsService=require("../reservations/reservations.service");

  // To this line
  const asyncErrorBoundary = require("../errors/asyncErrorBoundary");




  async function put(req,res,next) {


     let updatedTable=res.locals.table;
     let reservation=res.locals.reservation;
    // reservationsController.update
    

    //update table to occupied === true
    updatedTable.occupied=true;

    //set table reservation ID to reservation ID
    updatedTable.reservation_id=reservation.reservation_id;
      // Perform the update operation


      const data = await service.update(updatedTable);

 
      if(reservation.status=='seated'){
        return next({ status: 400, message: "Reservation is already seated" });
      }
    

     
     //change reservation to seated
      reservation.status="seated";
      // Log the result of the update operation
           
       
      const updatedReservation = await reservationsService.update(reservation);


     


 return  res.status(200).json({ data: updatedReservation[0] });
}

  function hasProperties(req, res, next) {
    const { data: {table_name, capacity,reservation_id,occupied} = {} } = req.body;

 
    //console.log('Checking properties:'+!first_name+!last_name+!mobile_number+!reservation_date+!reservation_time+!people);
    if (!table_name || !capacity || table_name.length==1||typeof capacity !="number") {
      return next({ status: 400, message: "All of data table_name, capacity" });
    }
  
  
  
    // Validation passed
    next();
  }


  



  async function reservationExists(req, res, next) {
    const { data } = req.body;
    const { table_id } = req.params; 

    
  

      if (!data ) {
        return next({ status: 400, message: "Data is missing" });
      }


  if (!data.reservation_id) {
    return next({ status: 400, message: "reservation_id is missing" });
  }

    
 
    const reservation= await service.readReservation(data.reservation_id);
    

// Check if reservation_id is missing
    if (!reservation) {
      
     
    res.status(404).json({ error: `${data.reservation_id}  cannot be found` });
    }


    //Get table
    const table= await service.read(table_id);



// Check if table is occupied
if (table.occupied==true) {
    return next({ status: 400, message: "Table is occupied" });
  }




    //Check for capcity
    if(reservation.people>table.capacity){
        
       
        return next({ status: 400, message: "Table does not have sufficient capacity" });
    }else{
        
        res.locals.table = table;
        res.locals.reservation=reservation;
        return next();
      
    }

    
  }
  


async function create(req,res,next) {
    const { data} = req.body;
   
 
  
if(data.reservation_id>0){
 
    data.occupied=true;
}
  
     const table = await service.create(data);
  
     
     res.status(201).json({ data: table });
   }



   async function tableExists(req,res,next) {

    const { table_id } = req.params; 
   


    const table = await service.read(table_id);



 //check if table exists
   if(!table){
       return next({ status: 404, message: "non-existent table_id "+table_id});
   }

   res.locals.table=table;


    return next();
   }

   async function destroy(req,res,next) {



     const table = res.locals.table;


    if(table.occupied==false){
     
        next({ status: 400, message: "table is not occupied"});
    }


    
   //get reservation ID
   const reservation_id= table.reservation_id;



//get reservation OBJECT
const reservation= await service.readReservation(reservation_id);





    //update reservation
   await service.deleteReserv(reservation);



  console.log('TABLE OBJECT'+table.table_id);

    //UPDATE TABLE OCCUPIED TO FALSE
    table.occupied=false;
    //add reservation_id to table
    let updatedTable=await service.update(table);

    //console.log(updatedTable);

    return  res.status(200).json({});
    
   }


   async function list(req,res,next) {

   

    
  
  
     const tables = await service.list();
   
     
     res.status(200).json({ data: tables });
   }




module.exports = {
    list,
    create:[asyncErrorBoundary(hasProperties),asyncErrorBoundary(create)],
    put: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(put)],
    destroy:[asyncErrorBoundary(tableExists),asyncErrorBoundary(destroy)]
   };





// To this line
const service = require("./reservations.service");
 // To this line
 const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
/**
 * List handler for reservation resources
 */
async function list(req, res) {

  
  //check to see if query is a mobile_number
  if(req.query.mobile_number){
    const { mobile_number } = req.query;
  

 //get reservations with mobile number
    const reservMobile = await service.listMobileNumber(mobile_number);
  

    return res.json({
      data: reservMobile,
    })

  }
  




  const reservations = await service.list(req.query.date);

 


  res.json({
    data: reservations,
  });
}
// Function to check if a string is a valid date
function isValidDate(dateString) {

   
  const parsedDate = Date.parse(dateString);
  return !isNaN(parsedDate);
}

function hasProperties(req, res, next) {
  let { data: { first_name, last_name, mobile_number, reservation_date, reservation_time, people,status } = {} } = req.body;



   // Regular expression to match the HH:MM time format
   const timeFormatRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;


   if(status=="seated"){
    return next({ status: 400, message: "status cant be a seated" });
  }

  if(status=="finished"){
    return next({ status: 400, message: "status cant be finished" });
  }

if(!reservation_time){
  return next({ status: 400, message: "All of first_name, last_name, mobile_number, reservation_date, reservation_time, and people are required." });
}

 
  if (!first_name || !last_name || !mobile_number || !isValidDate(reservation_date)  || !timeFormatRegex.test(reservation_time.slice(0,5)||0) ||
  !people || !typeof people === "number"|| typeof people === "string" || isNaN(people)) {
   
    
    return next({ status: 400, message: "All of first_name, last_name, mobile_number, reservation_date, reservation_time, and people are required." });
  }


  // Get the current date
  const currentDate = new Date();

// Assuming reservation_date and reservation_time are the reservation date and time
const reservationDateTime = new Date(`${reservation_date}T${reservation_time}`);

// Check if the reservation date and time are in the future
if (currentDate.getTime() > reservationDateTime.getTime()) {
  return next({ status: 400, message: "Reservation must be for a future date and time" });
}

    // Check if the reservation date falls on a Tuesday (day of the week = 1)
    if (new Date(reservation_date).getDay() === 1) {
      return next({ status: 400, message: "Tuesdays restaurant is closed" });
    }

  // Validation passed
  next();
}




async function read(req, res) {

  const reservation=res.locals.reservation;
    
    
    
    res.json({data:reservation});
  }



  async function reservationExists(req, res, next) {
    const { reservation_Id } = req.params;
    const { data } = req.body;
    


    
   if(!reservation_Id){
      
       return next({ status: 404, message: `Reservation cannot be found. `+reservation_Id });
    }
    
    const reservation = await service.read(reservation_Id);
    
   
    

    if (!reservation) {
      
     
    res.status(404).json({ error: "Reservation cannot be found "+reservation_Id});
    }


  


    // res.locals.review.review_id=reviewId;
     res.locals.reservation = reservation;
      return next();
    
  }




  async function updateStatus(req,res,next) {


    const { data} = req.body;
    const { reservation_Id } = req.params;
 
  let reserv=await service.read(reservation_Id);



  if (data.status !== 'booked' && data.status !== 'seated' && data.status !== 'finished'&& data.status !== 'cancelled') {
    return next({ status: 400, message: 'unknown status' });
  }




  if (reserv.status=="finished") {
    return next({ status: 400, message: "A finished reservation cannot be updated" });
  }




//reservation is updated

reserv.status=data.status;
 const UpdatedReservation = await service.update(reserv);



return   res.status(200).json({ data: UpdatedReservation});
  }

  
async function update(req,res,next) {
  const { data} = req.body;

  let reserv=res.locals.reservation;
    

  if (data.status !== 'booked' && data.status !== 'seated' && data.status !== 'finished'&& data.status!==null) {
    return next({ status: 400, message: 'unknown status' });
  }




  if (reserv.status=="finished") {
    return next({ status: 400, message: "A finished reservation cannot be updated" });
  }



//reservation is updated
  const UpdatedReservation = await service.update(data);



return   res.status(200).json({ data: UpdatedReservation });
}







async function create(req,res,next) {
  const { data} = req.body;
 
  //console.log('DATA RESRVER'+data.reservation_date);
  
  // Check reservation_time availability
  
  const reservationTimeString = data.reservation_time;


  
  if (reservationTimeString < "10:30:00"||reservationTimeString > "21:30:00") {
    return next({ status: 400, message: "Reservation time is not available" });
  }


   const reservation = await service.create(data);
 
   
   res.status(201).json({ data: reservation });
 }
 

module.exports = {
  list,
  create:[hasProperties,asyncErrorBoundary(create)],
  update:[asyncErrorBoundary(reservationExists),asyncErrorBoundary(hasProperties),asyncErrorBoundary(update)],
  read:[asyncErrorBoundary(reservationExists),asyncErrorBoundary(read)],
  updateStatus:[asyncErrorBoundary(reservationExists),asyncErrorBoundary(updateStatus)]
  
};

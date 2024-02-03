import React, { useEffect, useState } from "react";
import { listReservations,listTables,finishTable, updateStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from 'react-router-dom';
import { today } from "../utils/date-time";
import { previous } from "../utils/date-time";
import { next } from "../utils/date-time";
import { ArrowRight } from 'react-bootstrap-icons';
import { ArrowLeft } from 'react-bootstrap-icons';


/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({date}) {
  
  
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tablesError, setTablesError] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const abortController = new AbortController();
  const history = useHistory();
  const [currentDate, setCurrentDate] = useState(date);



  const goToPreviousDay = () => {

    
    const previousDay = previous(currentDate);
    setCurrentDate(previousDay);
    history.push(`/dashboard?date=${previousDay}`);
  };
  
  const goToNextDay = () => {
   
    const nextDay = next(currentDate);
    setCurrentDate(nextDay);
    history.push(`/dashboard?date=${nextDay}`);
  };
  
  const goToToday = () => {
    let day=today();
    setCurrentDate(day);
    history.push(`/dashboard?date=${day}`);
  };


  async function handleCancel(reservation) {

  
    try {
      const result = window.confirm("Do you want to cancel this reservation?");
  
      if (result) {
        // User clicked OK
        reservation.people = Number(reservation.people);
        reservation.status = 'finished';
  
        // Update reservation status
        await updateStatus(reservation, abortController.signal);
  
        // Refresh page
        history.go();
      }
    } catch (error) {
     setReservationsError(error);
      console.error("Error handling cancellation:", error);
    }
  }




  async function handleFinish(table){
    // Add your logic to handle cancel button click
    // For example, you can use React Router's useHistory to go back to the previous page.
    // Import useHistory from 'react-router-dom'.
    // const history = useHistory();
    // history.goBack();


    setSelectedTable(table);

    const result = window.confirm("Is this table ready to seat new guests?");

    try {
     // Check the result
     if (result) {
      // User clicked OK
    
    await finishTable(table.table_id, abortController.signal);
     

      loadDashboard();
      loadTables();
      
     }
    } catch (error) {
    
      console.error("Error handling cancellation:", error);
      setReservationsError(error);
    }
  }
   





  useEffect(() => {
    loadDashboard();
    loadTables();
  
    return () => abortController.abort();
  }, [currentDate]);

  async function loadDashboard() {
   
    setReservationsError(null);
  
    try {

   
      setReservationsError(null);



      setIsLoading(true);
     
      const reservations = await listReservations(date, abortController.signal);
     
      setReservations(reservations);
      
      setIsLoading(false);
    } catch (error) {
      setReservationsError(error);
    }
  
    return () => abortController.abort();
  }

  async function loadTables() {
   
    setTablesError(null);

    try {
      setIsLoading(true);

      const tablesData = await listTables(abortController.signal);
      setTables(tablesData);

      setIsLoading(false);
    } catch (error) {
      setReservationsError(error);
      setIsLoading(false);
    }

    return () => abortController.abort();
  }



  return (
    <main>
    
        <h2 className="mt-4" align="center">Reservations for {date}</h2>
      
    <div>
    <ArrowLeft onClick={goToPreviousDay} color="royalblue" size={50} />
      <ArrowRight onClick={goToNextDay} color="royalblue" size={50} />
      <button type="button" className="btn btn-secondary" onClick={goToToday}>
          Today
        </button>
    </div>
    <ErrorAlert error={reservationsError} />

    {isLoading ? (
      <p>Loading...</p>
    ) : (
      <div className="table-responsive">
      <table className="table">
      <thead className="thead-dark">
          <tr>
            <th scope="col">Reservation ID</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Date</th>
            <th scope="col">Reservation Time</th>
            <th scope="col">People</th>
            <th scope="col">Status</th>
           
            <th scope="col">Actions</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
           
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.reservation_id}>
              <td>{reservation.reservation_id}</td>
              <td>{reservation.first_name}</td>
              <td>{reservation.last_name}</td>
              <td>{reservation.reservation_date}</td>
              <td>{reservation.reservation_time}</td>
              <td>{reservation.people}</td>
              <td data-reservation-id-status={reservation.reservation_id}>{reservation.status||"Booked"}</td>

              <td>
              {reservation.status=='booked' && (
          <a
            className="btn btn-secondary"
            role="button"
            href={`/reservations/${reservation.reservation_id}/seat`}
          >
            Seat
          </a>
              )}
                  </td>
                  <td>

                  <a
            className="btn btn-success"
            role="button"
            href={`/reservations/${reservation.reservation_id}/edit`}
          >
           Edit
          </a>
          </td>
          <td>
          <button data-reservation-id-cancel={reservation.reservation_id} type="button" className="btn btn-primary" onClick={()=>handleCancel(reservation)}>
            Cancel
          </button>
                  </td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr
        style={{
          background: 'gray',
          color: 'gray',
          borderColor: 'gray',
          height: '10px',
        }}
      />

<h2 align="center">Tables</h2>
<ErrorAlert error={reservationsError} />
          <table className="table" >
          <thead className="thead-dark">
              <tr>
                <th scope="col">Table ID</th>
                <th scope="col">Capacity</th>
                <th scope="col">Table Name</th>
                <th scope="col">Id</th>
                <th scope="col">Status</th>
                

              </tr>
            </thead>
            <tbody>
              {tables.map((table) => (
                <tr key={table.table_id} data-table-id-status={table.table_id}>
                  <td>{table.table_id}</td>
                  <td>{table.capacity}</td>
                  <td>{table.table_name}</td>
                  <td>{table.reservation_id||100}</td>
                  <td id="cellToChange">
  {table.occupied ? "Occupied" : "Free"}
</td>
<td>
{table.occupied && (

            <button
              className="btn btn-secondary"
              role="button"
              data-table-id-finish={table.table_id}
              onClick={() => handleFinish(table)}
            >
              Finish
            </button>
          )}
</td>
                </tr>
              ))}
              <td>

         
              </td>
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default Dashboard;



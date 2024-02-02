import React, { useEffect, useState } from "react";
import { listReservations,listTables,finishTable, updateStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from 'react-router-dom';

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
     tablesError(error);
      console.error("Error handling cancellation:", error);
    }
  }
   





  useEffect(() => {
    loadDashboard();
    loadTables();
  
    return () => abortController.abort();
  }, [date]);

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
      setTablesError(error);
      setIsLoading(false);
    }

    return () => abortController.abort();
  }



  return (
    <main>
    <h1>Reservations Dashboard</h1>
    <div className="d-md-flex mb-3">
      <h4 className="mb-0">Reservations for {date}</h4>
    </div>
    <ErrorAlert error={reservationsError} />

    {isLoading ? (
      <p>Loading...</p>
    ) : (
      <div>
      <table className="table">
        <thead>
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

<h2>Available Tables</h2>
<ErrorAlert error={tablesError} />
          <table className="table" >
            <thead>
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



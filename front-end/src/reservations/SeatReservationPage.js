import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { readReservation, seatReservation, listTables } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';


function SeatReservationPage() {
  const { reservationId } = useParams();
  const history = useHistory();
  const [reservation, setReservation] = useState(null);
  const [tables, setTables] = useState(null);
  const [selectedTable, setSelectedTable] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [reservationsError, setReservationsError] = useState(null);
  const controller = new AbortController();

  useEffect(() => {
    // Fetch reservation details
    readReservation(reservationId, controller.signal)
      .then((reservationData) => {
      
        setReservation(reservationData);
        // Fetch all tables
        return listTables(controller.signal);
      })
      .then((tablesData) => {
      
        setTables(tablesData);
        setIsLoading(false);
      })
      .catch((error) => {
        // Handle error (e.g., redirect back to dashboard)
        console.error('Error fetching reservation data:', error);
        setReservationsError(error);
        // history.push('/dashboard');
      });
  }, []);

  const handleTableChange = (event) => {
    setSelectedTable(event.target.value);
  };

  const handleSeatReservation = (event) => {
    event.preventDefault(); // Prevents the default form submission behavior
    // Perform the logic to seat the reservation and update the table status
    seatReservation(reservationId, selectedTable, controller.signal)
      .then(() => {
        // Redirect back to the dashboard after seating the reservation
        history.push('/dashboard');
      })
      .catch((error) => {
        // Handle error (e.g., display an error message)
        console.error('Error seating reservation:', error);
        setReservationsError(error);
      });
  };

  if (!reservation || isLoading) {
    // Display loading or error message
    return <p>Loading...</p>;
  }

  const handleCancel = () => {
    // Redirect back to the dashboard without seating the reservation
    history.push('/dashboard');
  };

  const options = tables.map((table) => (
    <option key={table.table_id} value={table.table_id}>
      {`${table.table_name} - ${table.capacity}`}
    </option>
  ));

  return (
    <div className="container mt-4">
    <h2 className="mb-4">Seat Reservation</h2>
    <h3>Reservation ID: {reservation.reservation_id}</h3>
    <h3>Party of {reservation.people}</h3>
    <ErrorAlert error={reservationsError} />

    <form onSubmit={handleSeatReservation} className="seat-reservation-form">
      <div className="mb-3">
        <label htmlFor="table_id" className="form-label">
          Select a table:
        </label>
        <select
          id="table_id"
          name="table_id"
          onChange={handleTableChange}
          className="form-select"
          required
        >
          <option defaultValue>Select a table</option>
          {options}
        </select>
      </div>
      <button className="btn btn-primary ml-5" type="submit">
        Submit
      </button>
      <button className="btn btn-secondary ml-5" onClick={handleCancel}>
        Cancel
      </button>
    </form>
  </div>
  );
}

export default SeatReservationPage;
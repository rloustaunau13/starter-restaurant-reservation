
import React, { useState } from 'react';
import { searchReservationsByPhoneNumber } from '../utils/api'; //  API function

function SearchReservations() {
  const [reservations, setReservations] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [reservationsError, setReservationsError] = useState(null);
  const controller = new AbortController();
  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleSearch = async () => {
    try {
      // Call  API function to search reservations by phone number
      const results = await searchReservationsByPhoneNumber({ mobile_number: phoneNumber }, controller.signal);
      console.log(results);
      setSearchResults(results);
      setReservations(results);
      if(results.length==0){
        setReservationsError('No reservations found for the provided mobile number.');
      }else{
        setReservationsError(null);
      }
      setError(null);
    } catch (error) {
      setSearchResults([]);
      setError(error.message);
    }
  };

  return (
    <div className="container mt-4">
    <h2>Reservation Search</h2>
    <div className="mb-3">
      <label htmlFor="phoneInput" className="form-label">Phone Number:</label>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          id="phoneInput"
          name="mobile_number"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
        />
        <button type="submit" className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>

      {error && <p>Error: {error}</p>}

      {reservations!=null && reservationsError && (
        <div className="alert alert-warning" role="alert">
         No reservations found for the provided mobile number.
        </div>
      )}
      <ul className="list-group">
        {searchResults.map((reservation) => (
          <li key={reservation.reservation_id} className="list-group-item">
            {reservation.first_name} {reservation.last_name} - {reservation.mobile_number}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchReservations;
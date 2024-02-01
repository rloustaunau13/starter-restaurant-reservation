import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ErrorAlert from '../layout/ErrorAlert'; 
import { postReservation, putReservation } from '../utils/api'; 
import formatReservationDate from "../utils/format-reservation-date";
import { formatAsDate } from "../utils/date-time";
const FormReservation = ({ reservation, onSubmit, onCancel }) => {
  const history = useHistory();
  const controller = new AbortController();
  const [reservationsError, setReservationsError] = useState(null);
  const [formData, setFormData] = useState({
    first_name: reservation.first_name || '',
    last_name: reservation.last_name || '',
    mobile_number: reservation.mobile_number || '',
    reservation_date: formatAsDate(reservation?.reservation_date || '0000-00-00') || '',
    reservation_time: reservation.reservation_time || '',
    people: reservation.people || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

      setFormData((prevData) => ({ ...prevData, [name]: value }));

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  

    try {
      formData.people = Number(formData.people);

      if (onSubmit === postReservation) {
        await postReservation(formData, controller.signal);
       
      } else if (onSubmit === putReservation) {
       formData.reservation_id=reservation.reservation_id;
       formData.status="booked";
       formData.people = Number(formData.people);
        await putReservation(formData, controller.signal);
      }

      const date = formData.reservation_date;
      history.push(`/dashboard?date=${date}`);
    } catch (error) {
      setReservationsError(error);
      console.error('Error processing reservation:', error.message);
    }
  };

  const handleCancel = () => {
    onCancel();

  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Reservation Form</h3>
      <ErrorAlert error={reservationsError} />
      <form onSubmit={handleSubmit}>
      <div className="mb-3">
            <label className="form-label">
              First Name:
              <input type="text" className="form-control" name="first_name" value={formData.first_name} onChange={handleChange} required />
            </label>
          </div>
  
          <div className="mb-3">
            <label className="form-label">
              Last Name:
              <input type="text" className="form-control" name="last_name" value={formData.last_name} onChange={handleChange} required />
            </label>
          </div>
  
          <div className="mb-3">
            <label className="form-label">
              Mobile Number:
              <input type="text" className="form-control" name="mobile_number" value={formData.mobile_number} onChange={handleChange} required />
            </label>
          </div>
  
          <div className="mb-3">
            <label className="form-label">
              Date of Reservation:
              <input type="date" className="form-control" name="reservation_date" value={formData.reservation_date} onChange={handleChange} required />
            </label>
          </div>
  
          <div className="mb-3">
            <label className="form-label">
              Reservation Time:
              <input type="time" className="form-control" name="reservation_time" value={formData.reservation_time} onChange={handleChange} required />
            </label>
          </div>
  
          <div className="mb-3">
            <label className="form-label">
              Number of People:
              <input type="text" className="form-control" name="people" value={formData.people} onChange={handleChange} required />
            </label>
          </div>
  
        <div className="d-flex mt-3">
          <button type="submit" className="btn btn-primary me-2">
            Submit
          </button>
          <button type="button" className="btn btn-secondary ml-5" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormReservation;
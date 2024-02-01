

import FormReservation, { Form } from './Form';
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from 'react-router-dom';
import {  putReservation,readReservation } from '../utils/api';
import ErrorAlert from "../layout/ErrorAlert";

export const EditReservationForm= () => {
   
    const history = useHistory();
    const [reservations, setReservation] = useState(null);
    const { reservationId } = useParams();
    const [reservationsError, setReservationsError] = useState(null);

    
    useEffect(() => {

        const controller = new AbortController();
    
        const fetchReservation = async () => {
          try {
            const reservationData = await readReservation(reservationId, controller.signal);
            reservationData.reservation_id=reservationId;
            
            setReservation(reservationData);
          
          } catch (error) {
            console.error('Error fetching reservation:', error);
            setReservationsError(error);
     
          }
        };
    
        fetchReservation();
    
        // Cleanup function to abort the fetch if the component unmounts
        return () => controller.abort();
      }, [reservationId, history]);



  




    return (
        <>
         <ErrorAlert error={reservationsError} />
        {reservations!=null && (
            
          <FormReservation
            reservation={reservations}
            onSubmit={putReservation}
            onCancel={() => history.push('/dashboard')}
          />
        )}
      </>
      
      );
    


    }


    export default EditReservationForm;
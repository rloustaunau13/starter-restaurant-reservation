

import React, { useState } from "react";

import { useHistory } from 'react-router-dom';
import FormReservation from "./Form";

import {  postReservation } from '../utils/api'; 

export const ReservationForm= () => {
    const history = useHistory();




    return (
        <FormReservation
      reservation={[]}
      onSubmit={postReservation}
      onCancel={() => history.push('/dashboard')}
    />
      );
    


    }


    export default ReservationForm;
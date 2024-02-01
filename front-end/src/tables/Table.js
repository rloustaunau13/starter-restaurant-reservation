


import React, { useState } from "react";
import { today } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";

import { useHistory } from 'react-router-dom';
import { postTable} from "../utils/api";

export const Table= () => {
    const history = useHistory();
    const [tablesError, setTablesError] = useState(null);


    const [formData, setFormData] = useState({
        table_name: '',
        capacity: '',
      });
    
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const controller = new AbortController();


        try {

        
         formData.capacity = Number(formData.capacity);
           // formData.reservation_date = new Date(formData.reservation_date); // Use Date()
           //console.log(formData);
           //formData.reservation_time = new Date(reservationTimeString);
           

           // API request 
         await postTable(formData,controller.signal);
         const date = today();
         history.push(`/dashboard/${date}`);
      
        } catch (error) {
          // Handle errors and display error messages
          setTablesError(error);
          console.error('Error creating reservation:', error.message);
        }

      };




    const handleCancel = () => {
        // Add your logic to handle cancel button click
        // For example, you can use React Router's useHistory to go back to the previous page.
        // Import useHistory from 'react-router-dom'.
        // const history = useHistory();
        // history.goBack();

         // Use history.goBack() to go back to the previous page
           history.goBack();
      };




    return (
        <div className="container mt-4">
        <h3 className="mb-4">New Table</h3>
        <ErrorAlert error={tablesError} />
        <form onSubmit={handleSubmit}>
            
          <div className="mb-3">
            <label className="form-label">
             Table Name
              <input type="text" className="form-control" name="table_name" value={formData.table_name} onChange={handleChange} required />
            </label>
          </div>
  
          <div className="mb-3">
            <label className="form-label">
             Capacity
              <input type="text" className="form-control" name="capacity" value={formData.capacity} onChange={handleChange} required />
            </label>
          </div>
  
         
        <div className="d-flex mt-3">
          <button type="submit" className="btn btn-primary me-2" onClick={handleSubmit}>Submit</button>
          <button type="button" className="btn btn-secondary ml-5" onClick={handleCancel}>cancel</button>
        </div>
        </form>
      </div>
      );
    


    }


    export default Table;
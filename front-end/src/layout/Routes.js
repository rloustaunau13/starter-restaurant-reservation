import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import ReservationForm from "../reservations/ReservationForm.js";
import SearchReservations from "../reservations/SearchReservations.js";
import Table from "../tables/Table.js"
import SeatReservationPage from "../reservations/SeatReservationPage.js";
import useQuery from "../utils/useQuery";
import EditReservationForm from "../reservations/EditReservation.js";
/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 *      
      
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery();
  const date = query.get("date");
 
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/search">
        <SearchReservations />
      </Route>
      <Route path="/reservations/:reservationId/edit">
        <EditReservationForm />
      </Route>
      <Route exact={true} path="/tables/new">
      <Table />
      </Route>
         <Route path="/reservations/new">
        <ReservationForm />
      </Route>
         <Route path="/reservations/:reservationId/seat">
        <SeatReservationPage/>
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date || today()} />
      </Route>
     
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;

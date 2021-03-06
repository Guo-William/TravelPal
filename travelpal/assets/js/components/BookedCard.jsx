import React from 'react';
import { connect } from 'react-redux';
import { Card, CardBody, Button, Row, Col } from 'reactstrap';

import api from '../api';
import TripCardHeader from './TripCardHeader';
import BookedForm from './BookedForm';
import BookedTripInfo from './BookedTripInfo';
import Itinerary from './Itinerary';

// Renders the details of an individual booked trip
function BookedCard(props) {
  // Sends a request to delete the trip
  function unbook() {
    api.delete_booked_trip(props.trip.id);
  }

  // Toggles the edit form
  function toggle() {
    $('#trip-details-' + props.trip.id).toggle();
    $('#trip-edit-' + props.trip.id).toggle();
    // Hide any errors
    $(".form-error").hide();
  }

  // Clears and closes the edit form
  function cancel() {
    props.dispatch({
      type: 'CLEAR_BOOKED_FORM',
    });
    toggle();
  }

  // Sends a request to update the booked trip with the values from the form
  function submit(ev) {
    api.edit_booked_trip(props.form);
    // Go back to the overview after submitting so user can see changes
    $('#trip-info-' + props.trip.id).show();
    $('#trip-itinerary-' + props.trip.id).hide();
    cancel();
  }

  // Validates the form inputs
  function validate() {
    let formLeft = document.forms["booked-left-form"];
    let formRight = document.forms["booked-right-form"];
    let cost = formLeft["cost"].value;
    let passengers = formLeft["passengers"].value;
    let hotel = formRight["hotel_id"].value;
    let rooms = formRight["rooms"].value;
    let successful = true;
    // Check if the cost is at least 0
    if (!cost || cost < 0) {
      $(".cost-error").show();
      successful = false;
    }
    // Check if the number of passengers is at least 1
    if (!passengers || passengers < 1) {
      $(".passengers-error").show();
      successful = false;
    }
    // Check if the number of rooms is at least 1 if the user chose a hotel
    if (hotel && rooms < 1 || !hotel && rooms != 0) {
      $(".rooms-error").show();
      successful = false;
    }
    // Successfully validated, so submit the form
    if (successful) {
      // Hide any errors
      $(".form-error").hide();
      submit();
    }
  }

  // Toggles the itinerary
  function viewItinerary(ev) {
    $('#trip-info-' + props.trip.id).toggle();
    $('#trip-itinerary-' + props.trip.id).toggle();
    let btn = $(ev.target);
    if (btn.text() == "View Itinerary") {
      $(btn).text("View Overview");
    }
    else {
      $(btn).text("View Itinerary");
    }
  }

  return (
    <Col md="12">
      <Card>
        <TripCardHeader destination={props.trip.destination}
          origin={props.trip.origin} startDate={props.trip.start_date}
          endDate={props.trip.end_date} />
        <CardBody className="trip-edit" id={"trip-edit-" + props.trip.id}>
          <BookedForm form={props.form} id={props.trip.id} trip={props.trip}
            hotels={props.hotels} />
          <Row>
            <Col md="12" className="trip-btn">
              <Button type="button" onClick={cancel}>Cancel</Button>
              <Button type="submit" onClick={validate}>Submit</Button>
            </Col>
          </Row>
        </CardBody>
        <CardBody className="trip-details" id={"trip-details-" + props.trip.id}>
          <Itinerary flight={props.trip.flight} id={props.trip.id} />
          <BookedTripInfo trip={props.trip} />
          <Row>
            <Col md="12" className="trip-btn">
              <Button type="button" onClick={viewItinerary}>
                View Itinerary
              </Button>
              <Button type="button" onClick={toggle}>Edit</Button>
              <Button type="button" onClick={unbook}>Unbook</Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

function state2props(state) {
  return {
    form: state.booked
  };
};

export default connect(state2props)(BookedCard);

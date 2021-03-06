import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Card, CardBody } from 'reactstrap';

import api from '../api';
import TravelCard from './TravelCard';
import TravelForm from './TravelForm';

// Renders the user's travel dates
function TravelDates(props) {
  let trips = _.map(props.travelDates, function(tt) {
    return <TravelCard key={tt.id} trip={tt} form={props.form} />;
  });

  // Display none message if no travel dates
  if (trips.length == 0) {
    trips = <Col><b>You have no dates set aside for travel.</b></Col>;
  }

  // Toggles the new travel date form
  function toggle() {
    $('#travel-dates').toggle();
    $('#trip-create').toggle();
    // Hide any errors
    $(".form-error").hide();
  }

  // Closes the new travel date form
  function cancel() {
    props.dispatch({
      type: 'CLEAR_TRAVEL_FORM',
    });
    toggle();
  }

  // Sends a request to create a new travel date
  function submit() {
    api.create_travel_date(props.form);
    // Clear and close the form afterward
    cancel();
  }

  // Validates the form inputs
  function validate() {
    let formLeft = document.forms["travel-left-form"];
    let formRight = document.forms["travel-right-form"];
    let destination = formRight["destination"].value;
    let start = formLeft["start_date"].value;
    let end = formRight["end_date"].value;
    let origin = formLeft["origin"].value;
    let price = formLeft["price_limit"].value;
    let passengers = formRight["passengers"].value;
    let successful = true;
    let today = new Date();
    // Set today's time to midnight
    today.setHours(0,0,0,0);

    // Check if the user entered a destination
    if (!destination) {
      $(".destination-error").show();
      successful = false;
    }

    // Check if the user entered an origin
    if (!origin) {
      $(".origin-error").show();
      successful = false;
    }

    // Check if the start or end dates are null
    if (!start || !end) {
      $(".start-error").show();
      $(".end-error").show();
      successful = false;
    }
    // Check if departure date is <= arrival date and that departure date is
    // no earlier than today's date
    else {
      // Add 1 day to the dates because Javascript is weird
      let startDate = new Date(start);
      startDate.setDate(startDate.getDate() + 1);
      let endDate = new Date(end);
      endDate.setDate(endDate.getDate() + 1);

      if (startDate > endDate || startDate < today) {
        $(".start-error").show();
        $(".end-error").show();
        successful = false;
      }
    }

    // Check if the price is at least 0
    if (!price || price < 0) {
      $(".price-error").show();
      successful = false;
    }
    // Check if the number of passengers is at least 1
    if (!passengers || passengers < 1) {
      $(".passengers-error").show();
      successful = false;
    }
    // Successfully validated, so submit the form
    if (successful) {
      // Hide any errors
      $(".form-error").hide();
      submit();
    }
  }

  return (
    <div className="page-content">
      <div id="trip-create">
        <Row>
          <Col md="12">
            <h3>New Travel Date</h3>
            <Card>
              <CardBody>
                <TravelForm form={props.form} userId={props.userId} />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12" className="trip-btn">
            <Button type="button" onClick={cancel}>Cancel</Button>
            <Button type="button" onClick={validate}>Submit</Button>
          </Col>
          </Row>
      </div>
      <div id="travel-dates">
        <Row>
          <Col md="6">
            <h3>Travel Dates</h3>
          </Col>
          <Col md="6" className="trip-btn">
            <Button type="button" onClick={toggle}>+ Add</Button>
          </Col>
        </Row>
        <Row>{trips}</Row>
      </div>
    </div>
  );
};

function state2props(state) {
  return {
    form: state.travel
  };
};

export default connect(state2props)(TravelDates);

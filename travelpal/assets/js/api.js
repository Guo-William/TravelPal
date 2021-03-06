// Adapted from Nat's lecture notes
import store from './store';

class TheServer {
  dispatchAlert(text, color = "danger") {
    store.dispatch({
      type: 'ALERT',
      data: {
        color,
        text
      }
    })
  }

  request_users() {
    return $.ajax("/api/v1/users", {
      method: "get",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      success: (resp) => {
        store.dispatch({
          type: 'USERS_LIST',
          users: resp.data,
        });
      },
      error: (resp) => {
        this.dispatchAlert("Could not load users");
      }
    });
  }

  request_friends() {
    return $.ajax("/api/v1/friends", {
      method: "get",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      success: (resp) => {
        store.dispatch({
          type: 'FRIENDS_LIST',
          friends: resp.data,
        });
      },
      error: (resp) => {
        this.dispatchAlert("Could not load friends.");
      }
    });
  }

  request_travel_dates() {
    return $.ajax("/api/v1/traveldates", {
      method: "get",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      success: (resp) => {
        store.dispatch({
          type: 'TRAVEL_DATES_LIST',
          travelDates: resp.data,
        });
      },
      error: (resp) => {
        this.dispatchAlert("Could not load travel dates.");
      }
    });
  }

  request_booked_trips() {
    return $.ajax("/api/v1/bookedtrips", {
      method: "get",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      success: (resp) => {
        store.dispatch({
          type: 'BOOKED_TRIPS_LIST',
          bookedTrips: resp.data,
        });
      },
      error: (resp) => {
        this.dispatchAlert("Could not load booked trips.");
      }
    });
  }

  request_flights() {
    return $.ajax("/api/v1/travel/flights/all", {
      method: "get",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      success: (resp) => {
        store.dispatch({
          type: 'FLIGHTS_LIST',
          flights: resp.data,
        });
      },
      error: (resp) => {
        this.dispatchAlert("Could not load flights.");
      }
    });
  }

  request_hotels(data) {
    return $.ajax("/api/v1/hotels/fetch", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({ info: data }),
      success: (resp) => {
        store.dispatch({
          type: 'ADD_HOTEL',
          hotels: resp.data,
        });
      },
      error: (resp) => {
        this.dispatchAlert("Could not load hotels.");
      }
    });
  }

  request_all_hotels() {
    return $.ajax("/api/v1/hotels", {
      method: "get",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      success: (resp) => {
        store.dispatch({
          type: 'HOTELS_LIST',
          hotels: resp.data,
        });
      },
      error: (resp) => {
        this.dispatchAlert("Could not load hotels.");
      }
    });
  }

  submit_login(data) {
    $.ajax("/api/v1/token", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(data),
      success: (resp) => {
        store.dispatch({
          type: 'SET_TOKEN',
          token: resp,
        });
      },
      error: (resp) => {
        this.dispatchAlert("Could not log in. Please try again.");
      }
    });
  }

  create_user(data) {
    $.ajax("/api/v1/users", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({ user: data }),
      success: (resp) => {
        this.dispatchAlert("Successfully registered! You can now log in.", "success");
        store.dispatch({
          type: 'ADD_USER',
          user: resp.data,
        });
        $("#registration").hide();
        $("#login").show();
      },
      error: (resp) => {
        this.dispatchAlert("Failed to register. Please try again.");
      },
    });
  }

  edit_user({ field, data }) {
    $.ajax("/api/v1/users/" + data.id, {
      method: "patch",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({ user: data }),
      success: (resp) => {
        store.dispatch({
          type: 'USERS_LIST',
          users: resp.data,
        })
        store.dispatch({
          type: 'SET_TOKEN',
          token: data
        })
        $('#' + field).toggle();
        $('#' + field + '-edit').toggle();
      },
      error: (resp) => {
        this.dispatchAlert("Could not save the edit. Please try again.");
      }
    });
  }

  friend_request(data) {
    $.ajax("/api/v1/friends/", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({ friend: data }),
      success: (resp) => {
        this.request_friends();
      }
    });
  }

  delete_friend(data) {
    $.ajax("/api/v1/friends/" + data, {
      method: "delete",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(data),
      success: (resp) => {
        store.dispatch({
          type: 'FRIENDS_LIST',
          friends: resp.data,
        });
      },
      error: (resp) => {
        this.dispatchAlert("Could not unfriend. Please try again.");
      }
    });
  }

  accept_friend(data) {
    $.ajax("/api/v1/friends/" + data.id, {
      method: "patch",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({ friend: data }),
      success: (resp) => {
        store.dispatch({
          type: 'FRIENDS_LIST',
          friends: resp.data,
        });
      },
      error: (resp) => {
        this.dispatchAlert("Could not accept the request. Please try again.");
      }
    });
  }

  delete_travel_date(data) {
    $.ajax("/api/v1/traveldates/" + data, {
      method: "delete",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(data),
      success: (resp) => {
        store.dispatch({
          type: 'TRAVEL_DATES_LIST',
          travelDates: resp.data,
        });
      },
      error: (resp) => {
        this.dispatchAlert("Could not delete the travel date. Please try again.");
      }
    });
  }

  delete_booked_trip(data) {
    $.ajax("/api/v1/bookedtrips/" + data, {
      method: "delete",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(data),
      success: (resp) => {
        store.dispatch({
          type: 'BOOKED_TRIPS_LIST',
          bookedTrips: resp.data,
        });
      },
      error: (resp) => {
        this.dispatchAlert("Could not delete the trip. Please try again.");
      }
    });
  }

  edit_booked_trip(data) {
    $.ajax("/api/v1/bookedtrips/" + data.id, {
      method: "patch",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({ booked_trip: data }),
      success: (resp) => {
        store.dispatch({
          type: 'BOOKED_TRIPS_LIST',
          bookedTrips: resp.data,
        });
      },
      error: (resp) => {
        this.dispatchAlert("Could not save the edit. Please try again.");
      }
    });
  }

  edit_travel_date(data) {
    $.ajax("/api/v1/traveldates/" + data.id, {
      method: "patch",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({ travel_date: data }),
      success: (resp) => {
        store.dispatch({
          type: 'TRAVEL_DATES_LIST',
          travelDates: resp.data,
        });
      },
      error: (resp) => {
        this.dispatchAlert("Could not save the edit. Please try again.");
      }
    });
  }

  create_travel_date(data) {
    $.ajax("/api/v1/traveldates", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({ travel_date: data }),
      success: (resp) => {
        store.dispatch({
          type: 'ADD_TRAVEL_DATE',
          travelDate: resp.data,
        });
      },
      error: (resp) => {
        this.dispatchAlert("Failed to create the travel date. Please try again.");
      },
    });
  }
  search_flight_by_params({ dest, origin, date_from, date_to }) {
    $.ajax(`/api/v1/travel/flights?origin=${origin}&dest=${dest}&date_from=${date_from}&date_to=${date_to}`, {
      method: "get",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      success: (resp) => {
        store.dispatch({
          type: "SEARCH_RETURNS",
          data: resp.data
        });
      },
    });
  }

  create_booked_trip(data) {
    console.log("yo");
    console.log(data);
    $.ajax("/api/v1/bookedtrips", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({ booked_trip: data }),
      success: (resp) => {
        console.log(resp.data)
        store.dispatch({
          type: 'ADD_BOOKED_TRIP',
          bookedTrip: resp.data,
        });
        if (data.travelDateId) {
          this.delete_travel_date(data.travelDateId);
        }
      },
      error: (resp) => {
        this.dispatchAlert("Failed to create the booked trip. Please try again.");
      },
    });
  }

  update_booked_trip(data) {
    $.ajax("/api/v1/bookedtrips/" + data.id, {
      method: "patch",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({ booked_trip: data }),
      success: (resp) => {
        store.dispatch({
          type: 'EDIT_BOOKED_TRIP',
          bookedTrip: resp.data,
        });
      },
      error: (resp) => {
        this.dispatchAlert("Could not save the edit. Please try again.");
      }
    });
  }

}

export default new TheServer();

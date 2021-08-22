import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
const utils = require('../Utils')

export class CabinBookings extends Component {
  static displayName = CabinBookings.name;
  static intervalId;

  constructor(props) {
    super(props);
    this.state = { bookings: this.props.bookings, loading: true };
  }

  componentDidMount() {
    this.populateData();
    // Refresh data every 60 minutes
    this.intervalId = setInterval(this.populateData.bind(this), 60*60*1000);
  }
  componentWillUnmount() {
    // Stop refreshing
    clearInterval(this.intervalId);
  }

  async populateData() {
    const response = await fetch('/cabinbookings');
    const data = await response.json();
    const grouped = _.groupBy(data, element => utils.getWeekNumber(new Date(element.date)));
    this.setState({ bookingsdata: grouped, loading: false });
  }

  static renderContents(bookingsdata) {
    console.log(bookingsdata);
    return (
      <div className="bookingsTable">
        {Object.keys(bookingsdata).map(week =>
        <div className="bookingWeekRow"> 
          {bookingsdata[week].map(bookingitem => (
          <div className={CabinBookings.renderBookingClasses(bookingitem)} key={bookingitem} alt={bookingitem.date}>{new Date(bookingitem.date).getDate()}
          </div>
          ))}
          </div>
          )}
      </div>
    );
  }
static renderBookingClasses(bookingItem) {
  let cssClass = "bookingBox day" + new Date(bookingItem.date).getDay();
  if(bookingItem.booked) { cssClass += " booked"} 
  return cssClass;
}
  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : CabinBookings.renderContents(this.state.bookingsdata);

    return (
      <div id="cabinBookings">
        <h2>Himos</h2>
         {contents}
      </div>
    );
  }

}

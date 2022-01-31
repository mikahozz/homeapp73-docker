import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import '../assets/custom.css'
const utils = require('../Utils');

export class CabinBookings extends Component {
  static displayName = CabinBookings.name;
  static intervalId;

  constructor(props) {
    super(props);
    this.state = { modal: false, bookings: this.props.bookings, lastUpdated: this.props.lastUpdated, loading: true };
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
    const response = await fetch('/cabinbookings/days/365');
    const data = await response.json();
    const grouped = _.groupBy(data.bookings, element => utils.getYearWeekNumber(new Date(element.date)));
    const groupedByMonthWeek = utils.groupByMonthWeek(data.bookings);
    this.setState({ bookingsdata: grouped, bookingsyeardata: groupedByMonthWeek, lastUpdated: data.lastupdated, loading: false });
  }

  static renderContents(bookingsdata, lastUpdated) {
    console.log(bookingsdata);
    return (
      <div className="bookingsContainer">
        <div className="bookingsTable">
          {Object.keys(bookingsdata).slice(0,5).map(week =>
          <div className="bookingWeekRow noWeek" key={week}> 
            {bookingsdata[week].map(bookingitem => (
            <div className={CabinBookings.renderBookingClasses(bookingitem)} key={bookingitem} alt={bookingitem.date}>{new Date(bookingitem.date).getDate()}
            </div>
            ))}
            </div>
            )}
        </div>
        <div className={CabinBookings.renderUpdatedClasses(Date.parse(lastUpdated))}>{ moment(lastUpdated).format('ddd HH:mm') }</div>
      </div>
    );
  }
  static renderYearContents(bookingsdata, lastUpdated) {
    let monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];
     console.log(bookingsdata);
    return (
      <div className="bookingsContainer">
        {Object.keys(bookingsdata).map(year =>
        <div key={year}>
            <h2>{year}</h2>
            {Object.keys(bookingsdata[year]).map(month =>
            <div className="bookingsMonth" key={month}>
              <div className="bookingsTable">
                <div className="bookingsMonthTitle">{monthNames[month]}</div> 
                {Object.keys(bookingsdata[year][month]).map(week =>
                <div className="bookingWeekRow" key={week}>
                    <div className="bookingBox weekNumber">{week.split(",")[1]}</div>
                    {bookingsdata[year][month][week].map(bookingitem => 
                    {
                    return(
                    <div className={CabinBookings.renderBookingClasses(bookingitem)} key={bookingitem} alt={bookingitem.date}>
                      {new Date(bookingitem.date).getDate()}
                    </div>
                    )}
                )}
                </div>
                  )}
                </div>
              </div>
              )}
          </div>
        )}
      </div>
    );
  }

static renderBookingClasses(bookingItem) {
  let cssClass = "bookingBox day" + new Date(bookingItem.date).getDay();
  if(bookingItem.booked) { cssClass += " booked"} 
  let updatedDate = new Date(Date.parse(bookingItem.updated));
  if(updatedDate) {
    let daysAgo = Math.abs(new Date() - updatedDate) / (1000 * 60 * 60 * 24);
    if(daysAgo < 7) {
      cssClass += " updatedWithinWeek";
    }
    else if(daysAgo < 14) {
      cssClass += " updatedWithin2Weeks";
    }  
  }  
  return cssClass;
}
static renderUpdatedClasses(date) {
  let diff = Math.abs(new Date() - date);
  let cssClass = "bookingsUpdated";
  if((diff / (1000 * 60 * 60 * 24) > 1)) {
    cssClass += " updatedOver24h";
  }
  return cssClass;
}
toggle = () => {
  this.setState({ modal: !this.state.modal });
}
render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : CabinBookings.renderContents(this.state.bookingsdata, this.state.lastUpdated)
    let yearContents = this.state.loading
      ? <p><em>Loading...</em></p>
      : CabinBookings.renderYearContents(this.state.bookingsyeardata, this.state.lastUpdated)

    return (
      <div id="cabinBookings" onClick={this.toggle}>
        <h2>Cabin bookings</h2>
         {contents}
        <Modal className="cabinbookings-modal" funk={true} isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Cabin bookings, upcoming year</ModalHeader>
          <ModalBody>
          {yearContents}
          </ModalBody>
        </Modal>
      </div>
    );
  }

}

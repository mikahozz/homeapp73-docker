import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';

export class FamilyCalendar extends Component {
  static displayName = FamilyCalendar.name;
  static intervalId;

  constructor(props) {
    super(props);
    this.state = { calendardata: [], loading: true };
  }

  componentDidMount() {
    this.populateCalendarData();
    // Refresh once in 24h
    this.intervalId = setInterval(this.populateCalendarData.bind(this), 24*60*60*1000);
  } 
  componentWillUnmount() {
    // Stop refreshing
    clearInterval(this.intervalId);
  }

  async populateCalendarData() {
    const response = await fetch('http://localhost:5010/api/events');
    const data = await response.json();
    const sorted = _.sortBy(data, element => new Date(element.start));
    const grouped = _.groupBy(sorted, element => new Date(element.start).setHours(0,0,0,0));
    console.log(grouped);
    this.setState({ calendardata: grouped, loading: false });
  }

  static renderCalendarContents(calendardata) {
    return Object.keys(calendardata).map(calitem => (
      <div key={calitem}>
          <h3 key={calitem}>{FamilyCalendar.renderDate(calitem)}</h3>
          {calendardata[calitem].map(eventItem => (
            <div key={eventItem.uid} className={FamilyCalendar.renderEventClasses(eventItem.summary)}>
            <div className="eventTime">
              {moment(eventItem.start).format('HH:mm')} - {moment(eventItem.end).format('HH:mm')}
              {FamilyCalendar.renderDots(eventItem.summary)}
            </div>
            <div className="eventTitle">{eventItem.summary}</div>
            </div>  
            ))}
      </div>
    ));
  }

  static renderDots(value) {
    var classes = [];
    if(value.includes('Elise')) { classes.push(<span class="elise dot"></span>)}
    if(value.includes('Elias') || value.includes('Eliaksen')) { classes.push(<span class="elias dot"></span>)}
    if(value.includes('Ella')) { classes.push(<span class="ella dot"></span>)}
    if(value.includes('Äiti')) { classes.push(<span class="aiti dot"></span>)}
    if(value.includes('Iskä')) { classes.push(<span class="iska dot"></span>)}
    return classes;
  }

  static renderEventClasses(value) {
    return value[0] === "#"? "calendarBox lowPrio" : "calendarBox";
  }

  static renderDate(dateNumber) {
    var weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var eventDate = new Date(Number(dateNumber)).setHours(0,0,0,0);
    var today = new Date().setHours(0,0,0,0);
    var tomorrow = new Date().setHours(0,0,0,0) + 1 * 24 * 60 * 60 * 1000;

    switch(eventDate){
      case today:
          return "Today";
      case tomorrow:
        return "Tomorrow";
    }
    return weekDays[new Date(eventDate).getDay()];
  }


  render() {
    let contents = this.state.loading
    ? <p><em>Loading...</em></p>
    : FamilyCalendar.renderCalendarContents(this.state.calendardata);

    return (
      <div id="calendardata" className="box">
        <h2>Events</h2>
         {contents}
      </div>
    );
  }
}

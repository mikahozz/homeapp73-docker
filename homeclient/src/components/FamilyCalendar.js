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
    const response = await fetch('http://raspberrypi.local:5010/api/events');
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

  static renderDots(valueObject) {
    var value = (String(valueObject)).toLowerCase();
    var classes = [];
    if(value.includes('elise')) { classes.push(<span className="elise dot"></span>)}
    if(value.includes('elias') || value.toLowerCase().includes('eliaksen')) { classes.push(<span className="elias dot"></span>)}
    if(value.includes('ella')) { classes.push(<span className="ella dot"></span>)}
    if(String(value).toLowerCase().includes('äiti')) { classes.push(<span className="aiti dot"></span>)}
    if(value.includes('iskä')) { classes.push(<span className="iska dot"></span>)}
    return classes;
  }

  static renderEventClasses(value) {
    return value[0] === "#"? "calendarBox lowPrio" : "calendarBox";
  }

  static renderDate(dateNumber) {
    var weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var eventDate = new Date(Number(dateNumber)).setHours(0,0,0,0);
    var todayDate = new Date();
    var tomorrowDate = new Date();
    tomorrowDate.setDate(todayDate.getDate()+1);
    var today = todayDate.setHours(0,0,0,0);
    var tomorrow = tomorrowDate.setHours(0,0,0,0);

    switch(eventDate){
      case today:
        return "Today";
      case tomorrow:
        return "Tomorrow";
      default:
        return weekDays[new Date(eventDate).getDay()];
      }
  }


  render() {
    let contents = this.state.loading
    ? <p><em>Loading...</em></p>
    : FamilyCalendar.renderCalendarContents(this.state.calendardata);

    return (
      <div id="calendardata" className="box">
        <h2>Upcoming family events</h2>
         {contents}
      </div>
    );
  }
}

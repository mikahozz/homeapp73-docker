import React, { Component } from 'react';
import moment from 'moment';

export class Time extends Component {
  static displayName = Time.name;
  static intervalId;

  constructor(props) {
    super(props);
    this.state = { now: new Date()};
  }

  componentDidMount() {
    // Refresh data every 30s
    this.intervalId = setInterval(this.trigger.bind(this), 30*1000);
  }
  trigger() {
    this.setState({now: new Date()})
  }
  componentWillUnmount() {
    // Stop refreshing
    clearInterval(this.intervalId);
  }


  render() {
    var weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var dateNow = this.state.now;
    return (
      <div id="time">
        <div className="time">
          {moment(dateNow).format('HH:mm')}
        </div>
        <div className="date">
          {weekDays[dateNow.getDay()]}, {dateNow.toLocaleString('fi-fi', {month: 'short', day: '2-digit'})}
        </div>
      </div>
    );
  }


}

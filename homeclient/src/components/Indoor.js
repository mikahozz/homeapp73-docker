import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';

export class Indoor extends Component {
  static displayName = Indoor.name;
  static intervalId;

  constructor(props) {
    super(props);
    this.state = { indoor: this.props.indoor, loading: true };
  }

  componentDidMount() {
    this.populateIndoorData();
    // Refresh data every 1 minutes
    this.intervalId = setInterval(this.populateIndoorData.bind(this), 60*1000);
  }
  componentWillUnmount() {
    // Stop refreshing
    clearInterval(this.intervalId);
  }

  async populateIndoorData() {
    const response = await fetch('/indoor/dev_upstairs');
    const data = await response.json();
    this.setState({ indoordata: data, loading: false });
  }

  static renderUpdatedClasses(date) {
    let diff = Math.abs(new Date() - date);
    let cssClass = "indoorUpdated";
    if((diff / (1000 * 60 * 60 * 12) > 1)) {
      cssClass += " updatedOver12h";
    }
    return cssClass;
  }
  

  render() {
    let contents = this.state.loading
      ? <div className="indoorTemp"><em>...</em></div>
      : <div>
          <p className="indoorTemp">{_.round(this.state.indoordata.temperature, 1) }°</p>
          <p className={Indoor.renderUpdatedClasses(Date.parse(this.state.indoordata.time))}>{moment(this.state.indoordata.time).format('ddd HH:mm')}</p>
        </div>

    return (
      <div id="indoor">
         {contents}
      </div>
    );
  }

}

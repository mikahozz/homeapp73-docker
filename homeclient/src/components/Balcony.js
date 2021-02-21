import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';

export class Balcony extends Component {
  static displayName = Balcony.name;
  static intervalId;

  constructor(props) {
    super(props);
    this.state = { indoor: this.props.indoor, loading: true };
  }

  componentDidMount() {
    this.populateIndoorData();
    // Refresh data every 10 minutes
    this.intervalId = setInterval(this.populateIndoorData.bind(this), 10*60*1000);
  }
  componentWillUnmount() {
    // Stop refreshing
    clearInterval(this.intervalId);
  }

  async populateIndoorData() {
    const response = await fetch('/indoor/Shelly');
    const data = await response.json();
    this.setState({ indoordata: data, loading: false });
  }


  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : <div>
          <p className="balconyTemp">{_.round(this.state.indoordata.temperature, 1) }°</p>
          <p className="balconyUpdated">{moment(this.state.indoordata.time).format('ddd HH:mm')}</p>
        </div>

    return (
      <div id="balcony">
         {contents}
      </div>
    );
  }

}

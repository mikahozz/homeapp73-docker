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
    // Refresh data every 1 hour
    this.intervalId = setInterval(this.populateIndoorData.bind(this), 60*60*1000);
  }
  componentWillUnmount() {
    // Stop refreshing
    clearInterval(this.intervalId);
  }

  async populateIndoorData() {
    const response = await fetch('http://localhost:5011/indoor');
    const data = await response.json();
    this.setState({ indoordata: data, loading: false });
  }


  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : <div>
          <p className="indoorTemp">{_.round(this.state.indoordata.temperature, 1) }°</p>
          <p className="indoorUpdated">{moment(this.state.indoordata.time).format('ddd HH:mm')}</p>
        </div>

    return (
      <div id="indoor">
         {contents}
      </div>
    );
  }

}

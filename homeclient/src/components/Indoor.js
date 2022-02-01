import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

export class Indoor extends Component {
  static displayName = Indoor.name;
  static intervalId;

  constructor(props) {
    super(props);
    this.state = { modal: false, indoor: this.props.indoor, loading: true };
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
    let cssClass = "dateUpdated";
    if((diff / (1000 * 60 * 60 * 12) > 1)) {
      cssClass += " updatedOver12h";
    }
    return cssClass;
  }
  
  toggle = () => {
    this.setState({ modal: !this.state.modal });
  }
  
  render() {
    let contents = this.state.loading
      ? <div><em>Loading...</em></div>
      : <div>
          <p className="indoorTemp">{_.round(this.state.indoordata.temperature, 1) }°</p>
          <Modal funk={true} isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Indoor temperature</ModalHeader>
          <ModalBody>
          <p>
            <span className="indoorTemp">{_.round(this.state.indoordata.temperature, 1) }°</span><br/>
            Humidity: {_.round(this.state.indoordata.humidity, 1) }%<br/>
            Battery: { this.state.indoordata.battery }%<br/>
            Updated: <span className={Indoor.renderUpdatedClasses(Date.parse(this.state.indoordata.time))}>{moment(this.state.indoordata.time).format('ddd HH:mm')}</span>
          </p>
          </ModalBody>
        </Modal>
          <p id="alert" className={Indoor.renderUpdatedClasses(Date.parse(this.state.indoordata.time))}>!</p>
        </div>

    return (
      <div id="indoor" onClick={this.toggle}>
         {contents}
      </div>
    );
  }

}

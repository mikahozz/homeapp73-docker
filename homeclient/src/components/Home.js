import React, { Component } from 'react';
import { Forecast } from './Forecast';
import { WeatherData } from './WeatherData';
import { WeatherNow} from './WeatherNow'
import { FamilyCalendar} from './FamilyCalendar'

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
      <div id="home" className="container-fluid">
        <div className="row header">
          <div className="col-sm-12"><WeatherNow /></div>
        </div>
        <div className="row">
          <div className="col-sm-4"><Forecast /></div>
          <div className="col-sm-4"><FamilyCalendar /></div>
          <div className="col-sm-4"><WeatherData /></div>
        </div>
      </div>
    );
  }
}

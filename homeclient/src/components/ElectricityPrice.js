import React, { Component } from 'react';
import _ from 'lodash';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLine } from 'victory';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

export class ElectricityPrice extends Component {
  static displayName = ElectricityPrice.name;
  static intervalId;

  constructor(props) {
    super(props);
    this.state = { modal: false, avg: 0, prices: this.props.prices, loading: true };
  }

  componentDidMount() {
    this.populateData();
    // Refresh data every 1 minutes
    this.intervalId = setInterval(this.populateData.bind(this), 60*1000);
  }
  componentWillUnmount() {
    // Stop refreshing
    clearInterval(this.intervalId);
  }

  async populateData() {
    const response = await fetch('/electricity/price');
    const data = await response.json();
    const todayData = data.filter(item => {
      let priceDateTime = new Date(Date.parse(item.DateTime));
      return (priceDateTime.getHours() >= 8 && priceDateTime.getHours() <= 24);
      });
    console.log(todayData);
    this.setState({ data: data, dayAvg: _.meanBy(todayData, o => o.Price), loading: false });
    console.log("Daily avg: " + this.state.dayAvg);
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

  chartTheme = {
    axis: {
      style: {
        bar: {
          fill: "#ffffff",
        },
        axis: {
          stroke: "none",
        },
        ticks: {
          stroke: "none",
          size: 5}, 
        tickLabels: {
          // this changed the color of my numbers to white
          fill: 'white',
          fontSize: 35,
        },
        grid: {
          fill: "none",
          stroke: "none",
        },
      },
    },
    bar: {
        style: {
          data: {
            fill: "#00ff99",
          },
        }
      },
    line: {
      style: {
        data: {
          stroke: "#00ff00",
          strokeDasharray: "4, 8" , strokeWidth: 2 
        }
      }
    }
  };
  
    render() {
    let contents = this.state.loading
      ? <div><em>Loading...</em></div>
      : <div>
          <h2 className='small'>Electricity price</h2>
          <VictoryChart
//            domain={{ x: [0, 2] }}
theme={this.chartTheme}
domainPadding={22}
          >
           <VictoryBar
            data={this.state.data
              .filter(item => {
                let priceDate = new Date(Date.parse(item.DateTime));
                let currentHour = new Date().setMinutes(0, 0, 0);
                return (priceDate >= currentHour);
              })
              .slice(0,6)
              .map(item => {
              return {x: item.DateTime, y: item.Price}
            })}
            barRatio={0.7}
            style={{
              data: {
                fill: ({ datum }) => datum.y >= this.state.dayAvg ? "#FF0046" : "rgb(0,255,121)",
                fillOpacity: 0.9,
                strokeWidth: ({ datum }) => {
                  return Date.parse(datum.x) === new Date().setMinutes(0,0,0) ? 3 : 1;
                },
                stroke: ({ datum }) => {
                  return Date.parse(datum.x) === new Date().setMinutes(0,0,0) ? "rgb(255,255,255,0.8)" :  "none";
                },
              },
            }}
            />
          <VictoryAxis
            style={{ 
              ticks: {
                fill: "transparent",
                size: 5}, 
              tickLabels: { fontSize: 35 }
            }}
            tickFormat={(t) => new Date(Date.parse(t)).getHours()}
          >
          </VictoryAxis>
          <VictoryLine y={() => this.state.dayAvg} />
          </VictoryChart>
          <Modal style={{maxWidth: '1000px', width: '100%'}} funk={true} isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Electricity Price</ModalHeader>
          <ModalBody>
          <VictoryChart
            theme={this.chartTheme}
            domainPadding={22}
            height={200}
            >
           <VictoryBar
            data={this.state.data
              .map(item => {
                return {x: item.DateTime, y: item.Price}
            })}
            barRatio={0.5}
            style={{
              data: {
                fill: ({ datum }) => datum.y >= this.state.dayAvg ? "#FF0046" : "rgb(0,255,121)",
                fillOpacity: 0.9,
                strokeWidth: ({ datum }) => {
                  return Date.parse(datum.x) === new Date().setMinutes(0,0,0) ? 1 : 1;
                },
                stroke: ({ datum }) => {
                  return Date.parse(datum.x) === new Date().setMinutes(0,0,0) ? "rgb(255,255,255,0.9)" :  "none";
                },
              },
            }}
            />
          <VictoryAxis dependentAxis 
            style={{ 
              ticks: {
                fill: "transparent",
                size: 5}, 
              tickLabels: { fontSize: 5 } }}
          />
          <VictoryAxis
            style={{ 
              ticks: {
                fill: "transparent",
                size: 5}, 
              tickLabels: { fontSize: 5 }
            }}
            tickFormat={(t) => new Date(Date.parse(t)).getHours()}
          >
          </VictoryAxis>
          <VictoryLine 
            y={() => this.state.dayAvg} 
            style={{
              data: {
                strokeWidth: 0.5,
                stroke: "rgb(0,255,121)",
                strokeDasharray: "2, 2" ,
              },
            }}
            />
          </VictoryChart>
          </ModalBody>
        </Modal>
          <p id="alert" className={ElectricityPrice.renderUpdatedClasses(Date.parse(this.state.data.time))}>!</p>
        </div>

    return (
      <div id="elPrice" onClick={this.toggle}>
         {contents}
      </div>
    );
  }

}

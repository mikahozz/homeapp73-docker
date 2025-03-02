import { useState, useEffect } from "react";
import _ from "lodash";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLine } from "victory";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

interface PriceData {
  DateTime: string;
  Price: number;
  time?: string;
}

export function ElectricityPrice() {
  const [modal, setModal] = useState(false);
  const [data, setData] = useState<PriceData[]>([]);
  const [dayAvg, setDayAvg] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    populateData();
    // Refresh data every 1 minute
    const intervalId = setInterval(populateData, 60 * 1000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  const populateData = async () => {
    try {
      const response = await fetch("/api/electricity/price");
      const data = await response.json();
      const todayData = data.filter((item: PriceData) => {
        const priceDateTime = new Date(Date.parse(item.DateTime));
        return priceDateTime.getHours() >= 8 && priceDateTime.getHours() <= 24;
      });

      setData(data);
      setDayAvg(_.meanBy(todayData, (o: PriceData) => o.Price));
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch electricity price data:", error);
    }
  };

  const renderUpdatedClasses = (date: number) => {
    const diff = Math.abs(new Date().getTime() - date);
    let cssClass = "dateUpdated";
    if (diff / (1000 * 60 * 60 * 12) > 1) {
      cssClass += " updatedOver12h";
    }
    return cssClass;
  };

  const toggle = () => {
    setModal(!modal);
  };

  const chartTheme = {
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
          size: 5,
        },
        tickLabels: {
          fill: "white",
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
      },
    },
    line: {
      style: {
        data: {
          stroke: "#00ff00",
          strokeDasharray: "4, 8",
          strokeWidth: 2,
        },
      },
    },
  };

  const contents = loading ? (
    <div>
      <p className="elPrice">
        <em>Loading...</em>
      </p>
    </div>
  ) : (
    <div>
      <h2 className="small">Electricity price</h2>
      <VictoryChart theme={chartTheme} domainPadding={22} height={200}>
        <VictoryBar
          data={data
            .filter((item) => {
              const priceDateTime = new Date(Date.parse(item.DateTime));
              const currentHour = new Date(new Date().setMinutes(0, 0, 0));
              return priceDateTime >= currentHour;
            })
            .slice(0, 6)
            .map((item) => {
              return { x: item.DateTime, y: item.Price };
            })}
          barRatio={0.7}
          style={{
            data: {
              fill: ({ datum }) =>
                datum.y >= dayAvg ? "#FF0046" : "rgb(0,255,121)",
              fillOpacity: 0.9,
              strokeWidth: ({ datum }) => {
                return Date.parse(datum.x) === new Date().setMinutes(0, 0, 0)
                  ? 3
                  : 1;
              },
              stroke: ({ datum }) => {
                return Date.parse(datum.x) === new Date().setMinutes(0, 0, 0)
                  ? "rgb(255,255,255,0.8)"
                  : "none";
              },
            },
          }}
        />
        <VictoryAxis
          style={{
            ticks: {
              fill: "transparent",
              size: 5,
            },
            tickLabels: { fontSize: 35 },
          }}
          tickFormat={(t) => new Date(Date.parse(t)).getHours()}
        />
        <VictoryLine y={() => dayAvg} />
      </VictoryChart>
      <Modal
        style={{ maxWidth: "1000px", width: "100%" }}
        funk={true}
        isOpen={modal}
        toggle={toggle}
      >
        <ModalHeader toggle={toggle}>Electricity Price</ModalHeader>
        <ModalBody>
          <VictoryChart theme={chartTheme} domainPadding={22} height={200}>
            <VictoryBar
              data={data.map((item) => {
                return { x: item.DateTime, y: item.Price };
              })}
              barRatio={0.5}
              style={{
                data: {
                  fill: ({ datum }) =>
                    datum.y >= dayAvg ? "#FF0046" : "rgb(0,255,121)",
                  fillOpacity: 0.9,
                  strokeWidth: ({ datum }) => {
                    return Date.parse(datum.x) ===
                      new Date().setMinutes(0, 0, 0)
                      ? 1
                      : 1;
                  },
                  stroke: ({ datum }) => {
                    return Date.parse(datum.x) ===
                      new Date().setMinutes(0, 0, 0)
                      ? "rgb(255,255,255,0.9)"
                      : "none";
                  },
                },
              }}
            />
            <VictoryAxis
              dependentAxis
              style={{
                ticks: {
                  fill: "transparent",
                  size: 5,
                },
                tickLabels: { fontSize: 5 },
              }}
            />
            <VictoryAxis
              style={{
                ticks: {
                  fill: "transparent",
                  size: 5,
                },
                tickLabels: { fontSize: 5 },
              }}
              tickFormat={(t) => new Date(Date.parse(t)).getHours()}
            />
            <VictoryLine
              y={() => dayAvg}
              style={{
                data: {
                  strokeWidth: 0.5,
                  stroke: "rgb(0,255,121)",
                  strokeDasharray: "2, 2",
                },
              }}
            />
          </VictoryChart>
        </ModalBody>
      </Modal>
      <p
        id="alert"
        className={renderUpdatedClasses(Date.parse(data[0]?.time || ""))}
      >
        !
      </p>
    </div>
  );

  return (
    <div id="elPrice" onClick={toggle}>
      {contents}
    </div>
  );
}

ElectricityPrice.displayName = "ElectricityPrice";

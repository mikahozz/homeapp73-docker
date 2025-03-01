import { useState, useEffect } from "react";
import moment from "moment";

interface ForecastItem {
  datetime: string;
  weather: string;
  temperature: number;
  wind_dir: number;
  wind_speed: number;
  rain: number;
}

export function Forecast() {
  const [forecastdata, setForecastdata] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    populateForecastData();
    // Refresh data every 1 hour
    const intervalId = setInterval(populateForecastData, 10 * 1000);

    if (document.getElementById("root")) {
      document.getElementById("root")!.scrollTop = 0;
    }

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  const renderRotate = (degree: number) => {
    return { transform: `rotate(${degree}deg)` };
  };

  const renderWeatherContents = (forecastdata: ForecastItem[]) => {
    return (
      <div>
        <table className="forecastTable">
          <tbody>
            {forecastdata.map((forecastitem) => (
              <tr key={forecastitem.datetime}>
                <td className="time-col">
                  {moment(forecastitem.datetime).format("HH:mm")}
                </td>
                <td>
                  <img
                    alt=""
                    width="55"
                    height="55"
                    src={`/img/${forecastitem.weather}.svg`}
                  />
                </td>
                <td className="temperature-col">
                  {Math.round(forecastitem.temperature)}°
                </td>
                <td>
                  <div className="wind-container">
                    <img
                      alt=""
                      style={renderRotate(forecastitem.wind_dir - 180)}
                      src="/img/arrow.svg"
                      width="40px"
                      height="40px"
                    />
                    <span className="wind-text">
                      {Math.round(forecastitem.wind_speed)}
                    </span>
                  </div>
                </td>
                <td>
                  <div
                    className="rainBox"
                    style={{ width: `${forecastitem.rain * 10}px` }}
                  ></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const populateForecastData = async () => {
    try {
      const response = await fetch("/api/weatherfore");
      const data = await response.json();
      setForecastdata(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch forecast data:", error);
    }
  };

  const contents = loading ? (
    <p>
      <em>Loading...</em>
    </p>
  ) : (
    renderWeatherContents(forecastdata)
  );

  return (
    <div id="forecast" className="box">
      <h2>Forecast 24h</h2>
      <h3>Tapanila, Helsinki</h3>
      {contents}
    </div>
  );
}

Forecast.displayName = "Forecast";

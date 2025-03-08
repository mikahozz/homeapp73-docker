import React, { useState, useEffect } from "react";
import moment from "moment";
import { DateTime } from "luxon";

interface ForecastItem {
  datetime: string;
  weather: string;
  temperature: number;
  wind_dir: number;
  wind_speed: number;
  rain: number;
}

interface SunItem {
  date: string;
  sunrise: string;
  sunset: string;
  first_light: string;
  last_light: string;
}

export function Forecast() {
  const [forecastdata, setForecastdata] = useState<ForecastItem[]>([]);
  const [sunData, setSunData] = useState<SunItem[]>([]);
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
  const isDayTime = (dateTime: Date) => {
    const daySunData = sunData.find((item) => {
      const itemDate = new Date(item.date);
      return itemDate.toDateString() === dateTime.toDateString();
    });
    if (!daySunData) {
      return false;
    }

    // Use Luxon to parse sunrise and sunset times
    const parseSunTime = (timeStr: string, dateStr: string) => {
      // Parse time like "6:20:17 AM" with date like "2025-03-09"
      const fullDateTimeStr = `${dateStr} ${timeStr}`;
      const dateTime = DateTime.fromFormat(
        fullDateTimeStr,
        "yyyy-MM-dd h:mm:ss a"
      );

      // Convert to JavaScript Date object for comparison
      return dateTime.toJSDate();
    };

    const sunrise = parseSunTime(daySunData.sunrise, daySunData.date);
    const sunset = parseSunTime(daySunData.sunset, daySunData.date);

    return dateTime >= sunrise && dateTime <= sunset;
  };

  const renderWeatherContents = (forecastdata: ForecastItem[]) => {
    let previousDay: string | undefined;

    return (
      <div>
        <table className="forecastTable">
          <tbody>
            {forecastdata.map((forecastitem) => {
              const itemDate = new Date(forecastitem.datetime);
              const itemDay = itemDate.toDateString();
              const dayChanged = previousDay ? itemDay !== previousDay : false;
              const isDay = isDayTime(itemDate);
              previousDay = itemDay;

              return (
                <React.Fragment key={forecastitem.datetime}>
                  {dayChanged && (
                    <tr className="dayDivider">
                      <td colSpan={5}>
                        <h3>TOMORROW</h3>
                      </td>
                    </tr>
                  )}
                  <tr className={isDay ? "day-row" : "night-row"}>
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
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const populateForecastData = async () => {
    try {
      const sunResponse = await fetch(
        `/api/sun?start=${DateTime.now().toISODate()}&end=${DateTime.now()
          .plus({ days: 1 })
          .toISODate()}`
      );
      const sunData = await sunResponse.json();
      setSunData(sunData);

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

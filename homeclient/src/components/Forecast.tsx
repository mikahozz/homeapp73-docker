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

    const sunrise = new Date(daySunData.date + " " + daySunData.sunrise);
    const sunset = new Date(daySunData.date + " " + daySunData.sunset);
    console.log("Sunrise and sunset: ", dateTime, sunrise, sunset);
    return dateTime >= sunrise && dateTime <= sunset;
  };

  const renderWeatherContents = (forecastdata: ForecastItem[]) => {
    // Group forecast items by day/night status
    const groupedForecasts: { isDayTime: boolean; items: ForecastItem[] }[] =
      [];

    forecastdata.forEach((item) => {
      const itemDateTime = new Date(item.datetime);
      const isDay = isDayTime(itemDateTime);

      // If this is the first item or the day/night status changed, create a new group
      if (
        groupedForecasts.length === 0 ||
        groupedForecasts[groupedForecasts.length - 1].isDayTime !== isDay
      ) {
        groupedForecasts.push({ isDayTime: isDay, items: [item] });
      } else {
        // Add to the current group
        groupedForecasts[groupedForecasts.length - 1].items.push(item);
      }
    });
    let previousDay: string | undefined;

    return (
      <div>
        <table className="forecastTable">
          {groupedForecasts.map((group, groupIndex) => (
            <tbody
              key={`group-${groupIndex}`}
              className={group.isDayTime ? "day" : "night"}
            >
              {group.items.map((forecastitem) => {
                const itemDate = new Date(forecastitem.datetime);
                const itemDay = itemDate.toDateString();
                const dayChanged = previousDay
                  ? itemDay !== previousDay
                  : false;
                previousDay = itemDay;
                return (
                  <React.Fragment key={forecastitem.datetime}>
                    {dayChanged && <tr className="dayDivider"></tr>}
                    <tr>
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
          ))}
        </table>
      </div>
    );
  };

  const populateForecastData = async () => {
    try {
      const sunResponse = await fetch(
        `/api/sun?start=${DateTime.now()
          .set({ hour: 0, minute: 0, second: 0 })
          .toISO()}&end=${DateTime.now()
          .plus({ days: 1 })
          .set({ hour: 23, minute: 59, second: 59 })
          .toISO()}`
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

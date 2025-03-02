import { useState, useEffect } from "react";

interface WeatherData {
  temperature: number;
  time: string;
}

export function WeatherNow() {
  const [weatherdata, setWeatherdata] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    populateWeatherData();
    // Refresh data every 1 hour
    const intervalId = setInterval(populateWeatherData, 60 * 60 * 1000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  const populateWeatherData = async () => {
    try {
      const response = await fetch("/api/outdoor/now");
      const data = await response.json();
      setWeatherdata(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
    }
  };

  const contents = loading ? (
    <div>
      <p className="temperatureNow">
        <em>...</em>
      </p>
    </div>
  ) : (
    <div>
      <p className="temperatureNow">
        {weatherdata[weatherdata.length - 1].temperature}°
      </p>
    </div>
  );

  return <div id="weatherNow">{contents}</div>;
}

WeatherNow.displayName = "WeatherNow";

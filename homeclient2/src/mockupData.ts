export function getMockData(path: string): object | undefined {
  // Route handlers
  switch (path) {
    case "/api/electricity/current":
      return {
        datetime: "2022-04-02T11:55:58.103Z",
        powerw: 2500,
      };

    case "/api/indoor/dev_upstairs":
      return {
        battery: 100.0,
        humidity: 27.4,
        temperature: 22.5,
        time: "2022-01-31T19:06:06.604000Z",
      };

    case "/api/weathernow":
      return [
        {
          datetime: "2022-01-31T18:40:05Z",
          temperature: -5.5,
          humidity: 7.0,
        },
        {
          datetime: "2022-01-31T18:50:05Z",
          temperature: -5.5,
          humidity: 7.0,
        },
        {
          datetime: "2022-01-31T19:00:05Z",
          temperature: -5.6,
          humidity: 7.0,
        },
        {
          datetime: "2022-01-31T19:10:05Z",
          temperature: -5.6,
          humidity: 7.0,
        },
        {
          datetime: "2022-01-31T19:20:05Z",
          temperature: -5.7,
          humidity: 7.0,
        },
      ];

    case "/api/indoor/Shelly":
      return {
        battery: 92.0,
        humidity: 80.5,
        temperature: -3.5,
        time: "2022-01-31T19:36:07.313000Z",
      };

    case "/api/electricity/price": {
      const prices = [];
      for (let i = -5; i < 43; i++) {
        const now = new Date();
        prices.push({
          DateTime: new Date(now.setHours(now.getHours() + i, 0, 0, 0)),
          Price: Math.random() * (20 - 1) + 1,
        });
      }
      return prices;
    }

    case "/api/outdoor/now":
      return [{ temperature: -5.7, time: "2022-01-31T19:20:05Z" }];

    case "/api/outdoor/history/Kumpula/30": {
      // Generate mock weather history data
      const data = [];
      const now = new Date();
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        data.push({
          dt: date.toISOString().split("T")[0],
          t2m: Math.round((Math.random() * 10 - 5) * 10) / 10,
          r_1h: Math.round(Math.random() * 5 * 10) / 10,
        });
      }
      return data;
    }

    case "/api/weatherfore": {
      // Generate mock forecast data
      const data = [];
      const now = new Date();
      for (let i = 0; i < 24; i++) {
        const date = new Date();
        date.setHours(now.getHours() + i);
        data.push({
          datetime: date.toISOString(),
          weather: i % 5 === 0 ? "1" : "2",
          temperature: Math.round((Math.random() * 10 - 5) * 10) / 10,
          wind_dir: Math.round(Math.random() * 360),
          wind_speed: Math.round(Math.random() * 10),
          rain: Math.round(Math.random() * 5 * 10) / 10,
        });
      }
      return data;
    }

    case "/api/cabinbookings/days/365": {
      // Generate mock cabin booking data
      const bookings = [];
      const now = new Date();
      for (let i = 0; i < 365; i++) {
        const date = new Date();
        date.setDate(now.getDate() + i);
        bookings.push({
          date: date.toISOString().split("T")[0],
          booked: Math.random() > 0.7,
          updated: new Date().toISOString(),
        });
      }
      return {
        bookings,
        lastupdated: new Date().toISOString(),
      };
    }

    case "/api/events": {
      // Generate mock calendar events
      const events = [];
      const now = new Date();
      const eventTypes = [
        "Family dinner",
        "Elise's soccer",
        "Elias's hockey",
        "Ella's dance",
        "äiti's meeting",
        "iskä's work trip",
      ];

      for (let i = 0; i < 10; i++) {
        const date = new Date();
        date.setDate(now.getDate() + Math.floor(i / 2));
        const startHour = 8 + Math.floor(Math.random() * 12);
        const endHour = startHour + 1 + Math.floor(Math.random() * 3);

        const start = new Date(date);
        start.setHours(startHour, 0, 0);

        const end = new Date(date);
        end.setHours(endHour, 0, 0);

        events.push({
          uid: `event-${i}`,
          summary: eventTypes[i % eventTypes.length],
          start: start.toISOString(),
          end: end.toISOString(),
        });
      }
      return events;
    }

    default:
      return undefined;
  }
}

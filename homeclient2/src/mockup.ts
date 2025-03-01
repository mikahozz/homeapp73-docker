import { Hono } from "hono";
import process from "process";

const app = new Hono();
const port = 4001;

// Error handler middleware
app.onError((err, c) => {
  return c.json({ error: err.message }, 500);
});

// API routes
app.get("/api/electricity/current", (c) => {
  return c.json({
    datetime: "2022-04-02T11:55:58.103Z",
    powerw: 2500,
  });
});

app.get("/api/indoor/dev_upstairs", (c) => {
  return c.json({
    battery: 100.0,
    humidity: 27.4,
    temperature: 22.5,
    time: "2022-01-31T19:06:06.604000Z",
  });
});

app.get("/api/weathernow", (c) => {
  return c.json([
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
  ]);
});

app.get("/api/indoor/Shelly", (c) => {
  return c.json({
    battery: 92.0,
    humidity: 80.5,
    temperature: -3.5,
    time: "2022-01-31T19:36:07.313000Z",
  });
});

app.get("/api/electricity/price", (c) => {
  const prices = [];
  for (let i = -5; i < 43; i++) {
    const now = new Date();
    prices.push({
      DateTime: new Date(now.setHours(now.getHours() + i, 0, 0, 0)),
      Price: Math.random() * (20 - 1) + 1,
    });
  }
  return c.json(prices);
});

app.get("/api/outdoor/now", (c) => {
  return c.json([{ temperature: -5.7, time: "2022-01-31T19:20:05Z" }]);
});

app.get("/api/outdoor/history/Kumpula/30", (c) => {
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
  return c.json(data);
});

app.get("/api/weatherfore", (c) => {
  // Generate mock forecast data
  const data = [];
  const now = new Date();
  for (let i = 0; i < 24; i++) {
    const date = new Date();
    date.setHours(now.getHours() + i);
    data.push({
      datetime: date.toISOString(),
      weather: i % 5 === 0 ? "rain" : "cloudy",
      temperature: Math.round((Math.random() * 10 - 5) * 10) / 10,
      wind_dir: Math.round(Math.random() * 360),
      wind_speed: Math.round(Math.random() * 10),
      rain: Math.round(Math.random() * 5 * 10) / 10,
    });
  }
  return c.json(data);
});

app.get("/api/cabinbookings/days/365", (c) => {
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
  return c.json({
    bookings,
    lastupdated: new Date().toISOString(),
  });
});

app.get("/api/events", (c) => {
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
  return c.json(events);
});

// Start the server with Bun's native HTTP server
console.log(`Mockup API server listening at http://localhost:${port}`);

// Use Bun's native HTTP server
export default {
  port,
  fetch: app.fetch,
};

// Add logic to handle interruption from the terminal
process.on("SIGINT", () => {
  console.info("Interrupted");
  process.exit(0);
});

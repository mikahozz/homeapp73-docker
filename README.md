# homeapp73-docker

A home web application, which shows 
- outdoor and indoor climate info
- family calendar from icloud
- booking calendar with booked/unbooked status
- Electricity spot price from Nordpool

The app can be shown on an always-on tablet as web page. The backend can be hosted on various machines, for example on a Raspberry PI.

Example home screen:
![](Screenshot.png)

# Background

I created the app to try out interesting technologies and make something useful from it. The app has been in daily use for many years as has proven it's value.

Because the target has been to learn and experiment, the app uses a large variety of programming languages and approaches to the problems at hand. It's not the simplest nor the most lightweight. But it still runs without issues on Raspberry PI 4. 

# Tech stack

Docker compose based containerized solution which can be run on a Raspberry PI. Contains a React app, NGINX gateway, multiple independent API services, various data fetching containers, InfluxDB time series database, solar inverter integration, sensor integration with MQTT client that integrates to Mosquitto MQTT bridge. More detailed description below:

## Client (Container: homeclient)

Oldish Create React App based React application still using class components and not hooks. To be renewed to Next.js and React Server Components to create a more ligthweight client with better error handling and real-timeness.

## Gateway (Container NGINX)

NGINX provides a common protected endpoint for the client and hides the details of the API services.

## Cabin bookings (Containers: cabinbookings, cabinbookings-refresh)

Node.js/Express.js server that reads bookings from a MariaDB and returns them to the client. Cabinbookings-refersh is a periodically run container that scrapes a web site and writes the bookings into the MariaDB and local file system.

## Calendar service (Container: calendarapi)

A Python API that uses Flask as a the web framework. Fetches family calendar events from a CalDAV compliant calendar service and returns the events to the client.

## Climate service (Container: climateapi)

A Python API using Flask framework. Reads indoor climate data and outdoor history data from an InfluxDB database and gets real-time weather forecast from Finnish Meteorological Institute.

# Getting started 
## Running locally with mockup data
- Install node on your machine (e.g. `brew install node` if you are on Mac and using Brew)
- In the homeclient folder, execute `npm run withmockup` to open the client in development mode using mockup data

Mariadb
- Create docker.env file and set the following environment variables:
    MYSQL_ROOT_PASSWORD={your root password}
    CABIN_USER_PASSWORD={password for cabin user}
Cabinbookings-refresh
- Create .env file and set the following environment variables:
    URL={url to bookign system}
    USERNAME={username to the booking system}
    PASSWORD={password to the bookings system}
    DBUSER={username to the mariadb}
    DBPASSWORD={password to the DBUSER}

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
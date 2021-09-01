Mariadb
- Create docker.env file and set the following environment variables:
    MYSQL_ROOT_PASSWORD="{your root password}"
    CABIN_USER_PASSWORD="{password for cabin user}"
Cabinbookings-refresh
- Create .env file and set the following environment variables:
    URL={url to bookign system}
    USERNAME={username to the booking system}
    PASSWORD={password to the bookings system}
    DBUSER={username to the mariadb}
    DBPASSWORD={password to the DBUSER}
SET PASSWORD FOR 'root' = PASSWORD('changethis');
FLUSH PRIVILEGES;
CREATE USER 'CabinUser'@'localhost' IDENTIFIED BY 'changethis';
FLUSH PRIVILEGES;
GRANT ALL PRIVILEGES ON `Cabin_%` . * TO 'CabinUser'@'localhost';

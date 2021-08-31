mysql -pchangethis --execute="SET PASSWORD FOR 'root' = PASSWORD('$MYSQL_ROOT_PASSWORD');"
mysql -p$MYSQL_ROOT_PASSWORD --execute="CREATE USER 'CabinUser'@'%' IDENTIFIED BY '$CABIN_USER_PASSWORD';"
mysql -p$MYSQL_ROOT_PASSWORD --execute="GRANT ALL PRIVILEGES ON \`Cabin_%\` . * TO 'CabinUser'@'%';"

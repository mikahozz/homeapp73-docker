sudo cp node_exporter-1.3.0.linux-armv7/node_exporter /usr/local/bin
sudo chmod +x /usr/local/bin/node_exporter
sudo useradd -m -s /bin/bash node_exporter
sudo mkdir /var/lib/node_exporter
sudo mkdir /var/lib/node_exporter/textfile_collector
sudo chown -R node_exporter:node_exporter /var/lib/node_exporter
sudo cp node_exporter.service /etc/systemd/system/
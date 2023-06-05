# Checking if h264viewer folder exists
if [ -f /var/www/html/h264viewer ]
then
    sudo rm -rf /var/www/html/h264viewer/*
else
    sudo mkdir -p /var/www/html/h264viewer
fi

sudo cp -R * /var/www/html/h264viewer

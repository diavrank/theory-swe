#!/bin/bash


docker run -it --rm -p 443:443 -p 80:80 --name certbot \
  -v "/etc/letsencrypt:/etc/letsencrypt" \
  -v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
  -v "/var/log/letsencrypt":"/var/log/letsencrypt" \
  certbot/certbot:latest \
  certonly



# cd ~/
# if [ ! -f ~/certbot-auto ]; then
#   wget https://dl.eff.org/certbot-auto
#   chmod a+x ~/certbot-auto
# fi

# sudo docker run -it --rm -p 443:443 -p 80:80 --name certbot \
#   -v "/etc/letsencrypt:/etc/letsencrypt" \
#   -v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
#   quay.io/letsencrypt/letsencrypt:latest \
#   certonly --email postmaster@elasticsuite.com --agree-tos --domain $1

# --domain secure.$1

# ~/certbot-auto certonly --email postmaster@elasticsuite.com --agree-tos --domain $1

#~/certbot-auto renew

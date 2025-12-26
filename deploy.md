## Create a VM

Choose any cloud provider to create the VM with these specs:

 - 4GB of RAM
 - 2vCPUs
 - 50 HDD (consider using SSD for faster builds)
 - Ubuntu 24

 Open Ports for VM:

 HTTP/HTPS: 80, 443, 
 Mongo replica set: 27017, 28018, 29017

## Set workspace

````sh
sudo su
cd /opt
git clone https://github.com/diavrank/theory-swe
cd theory-swe
````

## Run installers

````sh
sh installDockerInUbuntu.sh
sh installDockerCompose.sh
sh installDopplerInUbuntu.sh
````

To configure Doppler, see `doppler.md`

## Build

- Build image:

````sh
docker compose build app
````

- Run the following command to allow write mongo data in the volume:

```sh
sudo chown -R 1001 data
```

## Run containers

Run mongo service with backup:

````sh
sh mongoUpServices.sh
sh restore-db.sh
````
Note: if apply, run the recurring backfills remotely.

On Mac OS, you have to add the following line to your hosts file. It should be similar to Windows systems (`C:\Windows\System32\drivers\etc\hosts`)

 - To connect from Mongo Booster you need to add these virtual hosts to your hosts file:

_/etc/hosts_
````txt
##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1       localhost
255.255.255.255 broadcasthost
::1             localhost

<VM_IP_ADDRESS>  mongo-primary mongo-secondary mongo-arbiter
````
Make sure to make a tab between the public IP address and the virtual hosts
More info [here](https://github.com/bitnami/bitnami-docker-mongodb/issues/282#issuecomment-905831658)


Run backfills:
````shell
doppler setup # configure prod env
doppler run -- yarn backfill RefreshPermissionsBackfill
doppler run -- yarn backfill RefreshStaticProfilesBackfill
````


Run app service:

````sh
sh startAllContainers.sh
````

## Monitoring

See active containers:

````sh
docker ps
````

See logs of app service:

````sh
docker compose logs --tail 50 app
````

## Create a VM

Choose any cloud provider to create the VM with these specs:

 - 4GB of RAM
 - 2vCPUs
 - 50 SSD
 - Ubuntu 24

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

_/etc/hosts_
````txt
<VM_IP_ADDRESS>  mongo-primary mongo-secondary mongo-arbiter
````

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

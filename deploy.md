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

## GitHub Actions staging deploy (manual button + Ansible)

This repo now includes `.github/workflows/deploy-staging.yml`, which adds a **Run workflow** button in GitHub Actions.

### 1. Configure repository secrets

Add these secrets in **GitHub > Settings > Environments > `staging` > Environment secrets**:

- `GCP_VM_HOST`: Public IP or DNS of your staging VM
- `GCP_VM_SSH_USER`: SSH user (for example `ubuntu`)
- `GCP_VM_SSH_PORT`: SSH port (usually `22`)
- `GCP_VM_SSH_PRIVATE_KEY`: Private key content used by GitHub Actions to SSH into the VM
- `DOCKERHUB_USERNAME`: Docker Hub username (required to push image from GitHub Actions)
- `DOCKERHUB_PASSWORD`: Docker Hub password/token (required to push image from GitHub Actions)

### 2. Run deployment

Go to **Actions > Deploy Staging VM > Run workflow** and provide:

- `docker_image` (default: `diavrank/scaffold-meteor-vue`)
- `image_tag` (optional; if empty a tag like `staging-<commit_sha_12>` is generated)
- `app_dir` (default: `/opt/theory-swe`)

### 3. What the workflow does

It does both image publishing and deployment:

1. Builds Docker image from this repository.
2. Pushes the image to Docker Hub using `docker_image:image_tag`.
3. Runs `deploy/ansible/deploy-staging.yml` to deploy that exact tag into the VM.

The Ansible playbook:

1. Connects to the VM over SSH.
2. Optionally logs in to Docker Hub.
3. Pulls `docker_image:image_tag`.
4. Runs `doppler run -- docker compose up -d --no-deps app` in `app_dir` with `APP_IMAGE=docker_image:image_tag`.

Mongo containers are not recreated, only the `app` service is restarted.

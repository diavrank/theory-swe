[Configure service token in VM](https://docs.doppler.com/docs/service-tokens#option-1-persisted-service-token)

This is the best option for Virtual Machines as it restricts which directory secrets can be fetched from and no
additional configuration is required once registered (e.g. will persist across machine restarts).

````
# Prevent configure command being leaked in bash history
export HISTIGNORE='doppler*'

# Scope to location of application directory
echo 'dp.st.prd.xxxx' | doppler configure set token --scope /usr/src/app

# Supply secrets to your application
cd /usr/src/app
doppler run -- your-command-here
````

[Environment variables in docker compose](https://docs.doppler.com/docs/enclave-docker-compose#option-2-container-env-vars)

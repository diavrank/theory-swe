docker rm $(docker ps -f status=exited -q)
docker rmi $(docker images -f dangling=true -q)

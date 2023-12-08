# Instalar Docker

Config file /lib/systemd/system/docker.service

CentOS
---------

**Utilidades**
```shell
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
```

**Agregar el repo de docker**
```shell
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

**Instalar docker**
```shell
sudo yum install docker-ce -y
```

**Iniciar el servicio**
```shell
sudo systemctl start docker
```

**Iniciarlo con el sistema**

```shell
sudo systemctl enable docker
```

**Agregar usuario al grupo docker** 

```shell
whoami # Saber el nombre de tu usuario
sudo usermod -aG docker nombre_de_salida_en_whoami
```

**Salir de la sesión**
```shell
exit
```
**Iniciar de nuevo con el usuario y probar** 

```shell
docker run hello-world
```

---------
#Fedora 

##### La instalación es igual que en CentOS, solo deben modificar la url del repo, porque los pasos son idénticos

**Utilidades**
```shell
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
```

**Agregar el repo de docker**
```shell
sudo yum-config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
```

**Instalar docker**
```shell
sudo yum install docker-ce -y
```

**Iniciarlo con el sistema**
```shell
sudo systemctl enable docker
```

**Agregar usuario al grupo docker** 
```shell
whoami # Saber el nombre de tu usuario
sudo usermod -aG docker nombre_de_salida_en_whoami
```

**Salir de la sesión**
```shell
exit
```

**Iniciar de nuevo con el usuario y probar** 
```shell
docker run hello-world
```

---------
#Ubuntu

**Actualiza los repos**
```shell
sudo apt-get update
```

**Instala utilidades**
```shell
sudo apt-get install apt-transport-https ca-certificates curl software-properties-common -y
```

**Agregar el gpg** 
```shell
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

**Agregar el repo**
```shell
 sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```

**Actualizar de nuevo**
```shell
 sudo apt-get update
```

**Instalar docker**
```shell
 sudo apt-get install docker-ce
```

**Iniciarlo con el sistema**
```shell
sudo systemctl enable docker
```

**Agregar usuario al grupo docker** 
```shell
whoami # Saber el nombre de tu usuario
sudo usermod -aG docker nombre_de_salida_en_whoami
```

**Salir de la sesión**
```shell
exit
```

**Iniciar de nuevo con el usuario y probar** 
```shell
docker run hello-world
```


---------
#Debian

**Actualiza los repos**
```shell
sudo apt-get update
```

**Instala utilidades**
```shell
sudo apt-get install apt-transport-https ca-certificates curl gnupg2 software-properties-common -y
```

**Agregar el gpg**
```shell
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
``` 

**Agregar el repo**
```shell
 sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"
```

**Actualizar de nuevo**
```shell
 sudo apt-get update
```

**Instalar docker**
```shell
 sudo apt-get install docker-ce
```

**Iniciarlo con el sistema**
```shell
sudo systemctl enable docker
```

**Agregar usuario al grupo docker** 
```shell
whoami # Saber el nombre de tu usuario
sudo usermod -aG docker nombre_de_salida_en_whoami
```

**Salir de la sesión**
```shell
exit
```

**Iniciar de nuevo con el usuario y probar** 
```shell
docker run hello-world
```

------
#Install Docker Compose
```shell
sudo curl -L "https://github.com/docker/compose/releases/download/1.23.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```
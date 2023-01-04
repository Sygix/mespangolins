
# Mes Pangolins Démo

Ce projet est une démo de l'utilisation de Angular 15, ExpressJS et
une base de donnée sur MongoDB


## Installation

Pour installer ce projet il vous faut Docker

Placer vous dans le dossier du projet \
Installation et démarrage du backend (Serveur ExpressJS pour l'api et Mongo)
```bash
  docker compose up -d
```

Installation et émarrage du frontend en development mode avec AngularCLI \
Ce projet utilise Yarn
```bash
  cd MesPangolins
  yarn install
  ng serve
```
## Variables d'environment

Pour lancer ce projet vous pouvez personaliser les Variables dans ces fichiers

./MesPangolins/src/environments/environment.ts : `ApiURL: 'http://localhost:4000/api',`

./docker-compose.yml : 
```bash
    environment:
      - MONGO_INITDB_ROOT_USERNAME=root
      - MONGO_INITDB_ROOT_PASSWORD=password
      - MONGO_INITDB_DATABASE=mespangolins
```

./.env : 
```bash
    MONGODB_LOCAL_PORT="27017"
    MONGODB_PORT="27017"
    NODE_LOCAL_PORT="4000"
    PORT="4000"
```

./init-mongo.js :
```bash
    user: 'mongodb',
    pwd: 'password',
```

./server/.env : 
```bash
    JWT_SECRET="thisIsAJWTSecretKey"
    MONGODB_USER="mongodb"
    MONGODB_PASSWORD="password"
    MONGODB_ADDRESS="mongodb"
    MONGODB_PORT="27017"
    MONGODB_DATABASE="mespangolins"
    PORT="4000"
```

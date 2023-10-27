## NJATH Backend
### How to install

#### requirements
- node installed
- running mongoDB

#### Steps
1) clone the git repo
2) create a .env in root directory

    ```shell
    PORT=
    MONGODB_URL=mongodb://localhost:27017/njath
    JWT_SECRET=
    APP_PASSWORD=
    SMTP_EMAIL=
    FRONTEND_URL= #dont use / in the end , 1) 'https://example.com' <= correct , 2) 'https://example.com/' <= incorrect
    ```
3) install node_modules
4) run the server with app.js file

#### Hosting instructions
- nginx image is used as web server, It will directly configure your http traffic to localhost:8080
- SSL certifaicate is not included but can be done by using certbot
- before hosting make necessary changes in nginx-conf and docker-compose file
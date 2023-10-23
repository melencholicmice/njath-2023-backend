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
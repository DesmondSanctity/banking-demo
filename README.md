## banking-demo
Product Backend Engineering Assessment For Mono

This is a simple banking application that allows users to create accounts, deposit and withdraw money, and view their account balance.

Service #1: 
- [https://banking-demo.onrender.com](https://banking-demo.onrender.com)

Swagger Docs Service #1: 
- [https://banking-demo.onrender.com/docs/#/](https://banking-demo.onrender.com/docs/#/)

Service #2: 
- [https://websocket-p1rk.onrender.com](https://websocket-p1rk.onrender.com)

Websocket Logs Service #2: 
- [https://websocket-p1rk.onrender.com/api/websocket/errors](https://websocket-p1rk.onrender.com/api/websocket/errors)
- [https://websocket-p1rk.onrender.com/api/websocket/interactions](https://websocket-p1rk.onrender.com/api/websocket/interactions)

## project architecture
The project is built using the following technologies:
- Node.js
- Typescript
- MongoDB and Mongoose for the database/ORM
- Express for the backend framework
- HTML/CSS for the frontend
- Jest for unit testing
- Zod for validation
- Winston for logging
- Docker for containerization
- Swagger for API documentation
- Websocket for real-time updates.

```
|---bank-core(service 1)
    |--docs
    |--src
       |--config
       |--controllers
       |--middlewares
       |--models
       |--routes
       |--schemas
       |--services
       |--tests
       |--utils
       |--validations
       |--app.ts
    |--Dockerfile
    |--error.log
    |--info.log
|---websocket(service 2)
    |--public
       |--index.html
       |--script.js
       |--style.css
    |--src
       |--config
       |--utils
       |--app.ts
    |--Dockerfile
    |--errors.txt
    |--interactions.txt
|------.env
|------.gitignore
|------docker-compose.yml
|------jest.config.ts
|------package.json
|------package-lock.json
|------README.md
|------tsconfig.json
```
## project details
The application follows the microservices approach of building software. The whole project is structured for easy readability and maintainability. There aare two services in the project, the `bank-core` service and the `websocket` service. The `bank-core` service is responsible for handling the business logic of the application, while the `websocket` service is responsible for handling the real-time updates of the application.

### common
- The `bank-core/src` and `websocket/src` directory contains the source code for the application services. It is structured into several subdirectories, each containing the code for a specific part of the application.
- The `*/src/config` directory contains the configuration files for the application. You will see the database config and application config files there.
- The `*/src/utils` directory contains the code for the utility functions, which are used to perform common tasks in the application.
- The `*/app.ts` file is the entry point of the application. It sets up the server and starts listening for incoming requests.
- The `*/Dockerfile` file is used to define the Docker image for the project.
- The `.env` file contains the environment variables for the application.
- The `docker-compose.yml` file is used to configure the services/images that docker will run for the project to start in a containerized environment.

### bank-core
- The `bank-core/docs` directory contains the OpenAPI specs in `.yml` files and configurations that the project will use for test and documentation of it's endpoints.
- The `src/controllers` directory contains the code for the controllers, which handle the HTTP requests and responses.
- The `src/middlewares` directory contains the code for the middlewares, which are functions that are executed before the controller functions. You will see the logger, JWT authentication, and ratelimiter middlewares there.
- The `src/schema` directory contains the code for the models, which define the structure of the data in the database. This uses mongoose.
- The `src/routes` directory contains the code for the routes, which define the endpoints of the API.
- The `src/models` directory contains the code for the schemas, which define the request and response types/interfaces on how data are read and write to the database using Typescript features.
- The `src/services` directory contains the code for the services, which handle the business logic of the application.
- The `src/tests` directory contains the code for the unit tests, which are used to test the functionality of the application. This implements Jest.
- The `src/validations` directory contains the code for the validations, which are used to validate the data in the application. This implements Zod.
- The `error.log` file is used to log errors that occur in the application.

### websocket
- The `public` directory contains the static files and the UI code. HTML, CSS, and JavaScript files are stored here.
- The `interaction.txt` and `error.txt` files are used to log the successful and error websocket interactions between the client and the server respectively.


## considerations
To achieve a very scalable, simple and easy to maintain codebase, the following considerations were made:
- Database transaction concept is used to handle database events like account creation for a user, send money functionality, create/delete account and user functionality. This is to avoid race conditions, mantain data integrity and to ensure that the database is always in a consistent state.
- The application is built using the monolithic approach of building software. This is to ensure that the application is easy to maintain and scale.
- The application is built using Typescript. This is to ensure that we have control of the data flow of the application, readable ans easy to maintain.
- The necessary middlewares are implemented to handle the authentication, logging, and validation of the application.
- The application is built using the microservices approach of building software. This is to ensure that services are independent of each other and can be scaled independently.

## improvements to be made
- Ensuring service resilience in production:
  - Implement load balancing.
  - Use containerization with Docker.
  - Set up auto-scaling.
  - Implement circuit breakers for external dependencies.
  - Use database replication and backups.

- Monitoring for errors in the REST API service:
  - Implement comprehensive logging (already done with Winston).
  - Use error tracking tools like Sentry.
  - Set up real-time monitoring with tools like Prometheus and Grafana.
  - Implement health check endpoints.
  - Use APM (Application Performance Monitoring) tools.

- Caching strategy to make the API respond faster:
  - Implement Redis for in-memory caching.
  - Use CDN for static assets.
  - Implement database query result caching.
  - Use client-side caching with appropriate cache headers.

Approach to tie customer interaction in Service #2 to data in Service #1:
Use a shared database between services.
Implement event-driven architecture with message queues.
Use the user's JWT token to identify and link interactions.
Implement a correlation ID system across services.

## how to run locally
To run the project locally, follow these steps:
1. Clone the repository to your local machine.
2. Install the dependencies by running `npm install` in the project directory.
3. Create a `.env` file in the root directory of the project and add the following environment variables:
```bash
DATABASE_URL="<mongodbURL>/banking-demo"
MONGO_URL="<mongodbURL>/testdb"
BASE_URL=http://localhost:3000
JWT_SECRET="<your-jwt-secret>"
APP_PORT_1=3000
APP_PORT_2=3001
```
4. Start the application by running `npm run dev` in the project directory.
5. Open your browser and navigate to `http://localhost:3000` to access the application.
6. To access the API documentation, navigate to `http://localhost:3000/docs` in your browser.


## how to run using docker
To run the project using docker, follow these steps:
1. Clone the repository to your local machine.
2. Install Docker and Docker Compose on your machine.
3. Create a `.env` file in the root directory of the project and add the following environment variables:
```bash
DATABASE_URL="<mongodbURL>/banking-demo"
MONGO_URL="<mongodbURL>/testdb"
BASE_URL=http://localhost:3000
JWT_SECRET="<your-jwt-secret>"
APP_PORT_1=3000
APP_PORT_2=3001
```
4. Start the application by running docker in detached mode using this command `docker-compose up -d` in the project directory.
5. Open your browser and navigate to `http://localhost:3000` to access the application.
6. To access the API documentation, navigate to `http://localhost:3000/docs` in your browser.

## running tests
To run the tests, run `npm run test` in the project directory. The tests are located in the `src/tests` directory and use Jest for testing.
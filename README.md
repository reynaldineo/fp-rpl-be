# Table of Contents
1. [Installation and Running](#installation-and-running)
2. [Creating a Prisma Query Function](#creating-a-prisma-query-function)
3. [Creating a New Endpoint](#creating-a-new-endpoint)

## Installation and Running
### 1. Install Required Packages
Make sure to install the necessary dependencies by running:
```bash
npm install
```

### 2. Configure Environment Variables (API PORT + DATABASE_URL)
Copy the contents of the .envs directory to the root directory. Rename each file by removing the 's' from the filename and replacing it with .env. For example, .envs.dev should be .env.dev
```bash
cp .\envs\* .
#rename all .envs to .env
```
Then, configure the API PORT and DATABASE_URL on each env file .

### 3. Configure Prisma and Database
```bash
npx prisma migrate
npx prisma generate
```

### 4. Start the Application
To run the application in development mode, execute the following command:
```bash
npm run dev 
```
For running and building the application in a production environment, use:
```bash
npm start
#The compiled js will be in dist directory
```

Your can access the API documentation provided by swagger at :
``http://localhost:<PORT>/api-docs/``

## Creating a Prisma Query Function
1. Go to ``./src/services/``
2. Make a public async function inside the class . Then create your prisma query there. Your function will be available for that services via ``container.get(<service_name>)``.
3. See some example in ``users.service.ts``

## Creating a New Endpoint
1. Create your controller function in ``./src/controllers``
2. If you need to call a prisma query services function, make sure to get it via ``container.get(<service_name>)``
3. Make a new routes in ``./src/routes`` according to the controller type. Ex: auth.controller will register the routes in auth.route
4. Create the validation parameter for the routes . Place the dtos in `./src/dtos` and use the validation middlewares on the newly created routes. see example in `user.routes.ts`
5. Add the api documentation on swagger.yaml

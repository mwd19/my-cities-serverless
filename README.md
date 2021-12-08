# My places Serverless

## Functionality of the application

My places is a simple application that allow users track and register the places they had visited.
The application allows creating/removing/updating/fetching places (CRUD operations) and for each place item we can optionally have an attachment image. Each user only has access to places items that he/she had created.

## Stack

- Backend
  - Serverless Frameworks for local development
  - Typescript
  - Nodejs
  - AWS Lambda
  - AWS DynamoDB
  - AWS S3
- Frontend
  - Typescript
  - Angular
  - PrimeNg

## Run the application

### Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

### Frontend

To run the frontend application first edit the `client/src/auth_config.json` file to set correct parameters. And then run the following commands:

```
cd client
npm install -g @angular/cli
npm install
npm run start
```

Postman collection
You can find a Postman collection of the backend API [here](https://github.com/mwd19/my-places-serverless/blob/master/Capstone%20Project.postman_collection.json).

## Perspective
Integrate Google Maps API
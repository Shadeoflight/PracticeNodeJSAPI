# PracticeNodeJSAPI
This is a practice API project written with Node.js and Express.js. This API will be used to assist in testing client-side applications.

## Dependencies
npm (v5.3.0)
express.js
mongoose.js
jsonwebtoken.js (Auth0)

## Important Notes
- This version is currently a prototype that is configured for usage on the Codeanywhere Cloud IDE.
- The listening port is '3000'.
- The ip address is '0.0.0.0'.
- Uses MongoDB. For this project, the cloud MongoDB service mLab was used: https://mlab.com/

## Setup Instructions
1. npm install express body-parser morgan mongoose jsonwebtoken --save
2. Edit the config.js file to add desired secret and database link
3. node server.js
4. Optional: Perform a GET request (Ex. Postman) or navigate to the Codeanywhere link + '/setup'. This will initialize the database with a 'dummy' user.

## Primary functionalities
- [x] Can accept GET requests.
- [x] Can accept POST requests.
- [x] Can generate unique JSON Web Tokens.
- [x] Can authenticate unique JSON Web Tokens.

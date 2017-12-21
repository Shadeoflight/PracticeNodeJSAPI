/**
  Program configured for Codeanywhere Cloud IDE
**/

/**
  Retrieve packages
**/
var express = require('express');
var app = express(); // Generate express application

var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

// Genetate, sign, and verify tokens
var jwt = require('jsonwebtoken'); 

/**
  Retrieve custom files
**/
var config = require('./config'); // config object
var User = require('./app/models/user');

/**
  Configure the server
**/
var port = process.env.PORT || 3000; // codeanywhere port
// Connect to the database
mongoose.connect(config.database);
// Secret variable
// NOTE: app.set(...) to avoid global variables
app.set('secretPhrase', config.secret);

// Utilize body parser to get HTTP request info
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Utilize morgan for logging requests to the console
app.use(morgan('dev'));

/**
  Base Routes
**/
// Response for unprotected, base route
var baseGetResponse = function(req,res){
  res.send('Hello! The API is working!'); // Print on page
};
// Unprotected, base route
app.get('/', baseGetResponse);

// Add and save a user
var setupGetResponse = function(req,res){
  
  // Sample user object
  var userToRegister = new User({
    user_name: 'practice_user',
    password: 'practice_password',
    admin: true
  });
  
  // Save the user
  userToRegister.save(function(err){
    if(err) throw err;
    console.log('User registered successfully');
    res.json({
      success: true
    }); // Show json on page
  });
}
// Make a route for adding and saving a user
app.get('/setup', setupGetResponse);

// Debug/testing purposes:
// Add /userdelete to delete specific entry
/**
app.get('/userdelete', function(req, res){
	User.findByIdAndRemove({_id: '5a3b112da6f22f04e9c21cf7'}, 
	   function(err, docs){
		if(err) 
      res.json(err);
		else    
      res.redirect('/view');
	});
});
**/

/**
  API Routes
**/

// Initialize instanct of the router for API routes
var apiRoutes = express.Router();

// Routes - Authenticated

// Route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res){
  
  // Specify user
  
  // Find the user
  User.findOne({
    // Retrieve user_name value from POST request
    user_name: req.body.user_name
  }, function(err, user){
    if(err) {
      throw err;
    }
    
    console.log(user);
    // Check user_name
    if(!user){
      res.json({
        success: false, 
        message: 'Authentication failed. User not found.'
      });
    } else if (user) {
      // Check password
      if(user.password != req.body.password) {
        res.json({
          success: false,
          message: 'Authentication failed. Password not correct.'
        })
      } else {
        // If the user is found and the password matches
        // Generate a token with only the give n payload
        // Don't pass an entire user object, since that contains password
        const payload = {
          admin: user.admin
        };
        
        var token = jwt.sign(payload, app.get('secretPhrase'),{
          expiresIn: 60*60*24 // Token expires in 24 hours
        });
        
        // Return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy the token!',
          token: token
        });
        
      }
      
    }
    
  });
});

//
// Route middleware to verify a token
// Order is important - Place middleware after last non-private route
//
apiRoutes.use(function(req, res, next) {
  
  // Check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  
  // Decode the token
  if (token){
    // Verify secret and check expiration
    jwt.verify(token, app.get('secretPhrase'), function(err, decoded){
      if(err) {
        // Token authentication failed
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        // Token authentication succeeded
        // Save to request object to use in other routes
        req.decoded = decoded;
        next();
      }
    });
    
  } else {
    // If token == null
    return res.status(403).send({
      success: false,
      message: 'Null token.'
    });
  }
  
});

// Routes - No authentication

// Route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res){
  res.json({
    message:'API /api reached!'
  }); // Show json on page
});

// Route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function(req,res){
  User.find({}, function(err,users){
    res.json(users);
  });
});

// Apply the routes to the application with prefix /api
app.use('/api', apiRoutes);

/**
  Start the server
**/
app.listen(port,'0.0.0.0');
console.log('The port:' + port + " is working");







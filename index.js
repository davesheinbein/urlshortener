// Load environment variables from .env file
require('dotenv').config(); 

// Import Express framework
const express = require('express');

// Import CORS middleware to allow cross-origin requests
const cors = require('cors');

// Import Mongoose for MongoDB interaction
const mongoose = require('mongoose');

// Import valid-url to validate URLs
const validUrl = require('valid-url');

// Initialize Express app
const app = express(); 

// Enable CORS to allow requests from different origins
app.use(cors());

// Middleware to parse URL-encoded data from form submissions
app.use(express.urlencoded({ extended: false }));

// Middleware to parse JSON data in request body
app.use(express.json());

// Basic Configuration
// Use the port from environment variables or default to 3000
const port = process.env.PORT || 3000;

// Connect to MongoDB using the MONGO_URI environment variable
mongoose.connect(process.env.MONGO_URI, {
  // Use new MongoDB URL parser
  useNewUrlParser: true,
  
  // Use the new MongoDB topology engine
  useUnifiedTopology: true, 
}).then(() => {
  // Log success message on connection
  console.log("Successfully connected to MongoDB"); 
}).catch((err) => {
  // Log error message if connection fails
  console.error("Error connecting to MongoDB:", err);
});

// Define a schema for storing original and short URLs in the database
const urlSchema = new mongoose.Schema({
  // The original URL to be shortened
  original_url: String,

  // The corresponding shortened URL
  short_url: Number, 
});

// Create a model based on the URL schema
const URL = mongoose.model('URL', urlSchema);

// Serve static files from the "public" directory
app.use('/public', express.static(`${process.cwd()}/public`));

// Serve the main HTML file when the root endpoint is accessed
app.get('/', function (req, res) {
  // Serve index.html
  res.sendFile(process.cwd() + '/views/index.html');
});

// Endpoint to POST and shorten URL
// Counter to assign unique short URLs
let urlCounter = 1;

app.post('/api/shorturl', async (req, res) => {
  // Get the original URL from the request body
  const originalUrl = req.body.url;

  // Check if the provided URL is valid
  if (!validUrl.isWebUri(originalUrl)) {
    // Return error if URL is invalid
    return res.json({ error: 'invalid url' });
  }

  try {
    // Check if the URL already exists in the database
    let existingUrl = await URL.findOne({ original_url: originalUrl });

    if (existingUrl) {
      // Return existing URL if already in the database
      return res.json({
        original_url: existingUrl.original_url,
        short_url: existingUrl.short_url,
      });
    }

    // If URL is new, create a new short URL entry
    const newUrl = new URL({
      original_url: originalUrl,

      // Assign the next available short URL number
      short_url: urlCounter++, 
    });

    // Save the new URL to the database
    await newUrl.save(); 

    // Return the newly created short URL
    return res.json({
      original_url: newUrl.original_url,
      short_url: newUrl.short_url,
    });

  } catch (err) {
    // Log any errors
    console.error(err);

    // Return server error response
    return res.status(500).json('Server error');
  }
});

// Endpoint to redirect to the original URL
app.get('/api/shorturl/:short_url', async (req, res) => {
  // Get the short URL from request parameters
  const shortUrl = req.params.short_url;

  try {
    // Find the URL by its short URL
    const url = await URL.findOne({ short_url: shortUrl });

    if (url) {
      // Redirect to the original URL if found
      return res.redirect(url.original_url);
    } else {
      // Return error if no URL is found
      return res.json({ error: 'No short URL found for the given input' });
    }

  } catch (err) {
    // Log any errors
    console.error(err);

    // Return server error response
    return res.status(500).json('Server error');
  }
});

// Start the server and listen on the specified port
app.listen(port, function () {
  // Log the port on which the server is running
  console.log(`Listening on port ${port}`);
});

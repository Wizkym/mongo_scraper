// Dependencies
const express = require("express");
const exphbr = require('express-handlebars');
const bodyParser = require("body-parser");
const path = require('path');
const logger = require("morgan");

// Initialize express
const app = express();

// Configure middleware
// Use morgan logger for logging requests
app.use(logger ("dev"));
// Handlebars
app.engine('handlebars', exphbr({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
// Use body-parser for handling submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use defined routes
app.use('/', require('./routes/news'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));



const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash'); 


const app = express();
let port = process.env.PORT;
if(port == null || port == ""){
    port = 3000;
}

require('dotenv').config();

app.use(express.urlencoded( {extended: true}));
app.use(express.static('public'));
app.use(expressLayouts);


app.use(cookieParser('CarBlogSecure'));
app.use(session({
    secret: 'CarBlogSecretSession',
    saveUninitialized: true,
    resave: true
}));
app.use(flash());
app.use(fileUpload());

app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

const routes = require('./server/routes/carRoutes.js')
app.use('/', routes);

app.listen(port, () => console.log(`Running on port ${port}`));
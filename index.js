// Use .env file in development, and in production environment variables
// are saved manually
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const {body, validationResult} = require('express-validator');

const Filter = require('bad-words');
const rateLimit = require("express-rate-limit");
const path = require('path');

const app = express();

// Connect to db
const dbUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wbxmo.mongodb.net/${process.env.DB_COLL}?retryWrites=true&w=majority`;
const db = require('monk')(dbUri);
db.catch(error => console.log(error));

const mews = db.get('mews');
const filter = new Filter();
const limiter = rateLimit({
    windowMs: 10 * 1000, // window of 10 seconds
    max: 10 // limit each IP to 10 requests per windowMs
  });
const PORT = process.env.PORT || 80;

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}
app.use(cors());
app.use(express.json());
app.use(limiter);

app.get('/mews', (req, res) => {
    mews
        .find()
        .then(mews => {
            res.json(mews);
        });
});

app.post('/mews', [
    body('name')
        .not().isEmpty(),
    body('content')
        .not().isEmpty()
], 
    (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Name and Content are required!'
            })
        }

        const mew = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date()
        };

        // insert into DB
        mews
            .insert(mew)
            .then(createdMew => {
                res.json(createdMew);
            });
})

// Serve any static files
app.use(express.static(path.join(__dirname, 'client')));

// Handle html routing, return all requests to html app
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Listening on http://${window.Location.hostname}:${PORT}`);
});
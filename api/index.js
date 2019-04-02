const keys = require('./keys')


// Express setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors);
app.use(bodyParser.json());

// Setup Redis client
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();


// Express Routes handlers

app.get('/', (req, res) => {
    res.send('Hi');
});

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (errors, values) => {
        res.send(values);
    });
} );

app.post('/values', async (req, res) => {
    redisClient.hset('values', 'Not set yes!');
    redisPublisher.publish('insert', 1);

    res.send({working: true});
});


app.listen(5000, err => {
    console.log('Listening');
});
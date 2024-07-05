const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const { parseStringPromise } = require('xml2js');

dotenv.config();

const app = express();
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('dist'));

console.log(__dirname);

console.log(`Your API key is ${process.env.API_KEY}`);

app.get('/', function (req, res) {
    res.sendFile('dist/index.html');
});

app.post('/analyze', async function (req, res) {
    const { url } = req.body;

    const apiKey = process.env.API_KEY;
    const apiUrl = `https://api.meaningcloud.com/sentiment-2.1?key=${apiKey}&url=${encodeURIComponent(url)}&lang=en`;

    try {
        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/xml'
            }
        });

        const contentType = apiResponse.headers.get('content-type');
        const text = await apiResponse.text();

        console.log('Response Status:', apiResponse.status);
        console.log('Response Headers:', apiResponse.headers);
        console.log('Response Body:', text);

        if (contentType && contentType.includes('application/json')) {
            const data = JSON.parse(text);
            const result = {
                polarity: data.score_tag,
                subjectivity: data.subjectivity,
                text: (data.sentence_list && data.sentence_list.length > 0)
                    ? data.sentence_list.map(sentence => sentence.text).join(' ')
                    : 'No text available'
            };
            res.json(result);
        } else if (contentType && contentType.includes('text/xml')) {
            const data = await parseStringPromise(text);
            res.status(500).json({ error: 'API returned an error', details: data });
        } else {
            res.status(500).json({ error: 'Unexpected content type', details: text });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while analyzing the URL.', details: error.message });
    }
});

app.listen(3000, function () {
    console.log('App listening on port 3000!');
});

const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const data =
    [{
        words: ['AMAZON', 'APPLE', 'GOOGLE', 'MICROSOFT'],
        group: 'group-1',
        description: 'Large tech companies.'
    },
    {
        words: ['CPU', 'GPU', 'HDD', 'RAM'],
        group: 'group-2',
        description: 'Acronyms of computer components.'
    },
    {
        words: ['HORSE', 'OX', 'PIG', 'SHEEP'],
        group: 'group-3',
        description: 'Chinese Zodiac signs.'
    },
    {
        words: ['LIME', 'ORANGE', 'PEACH', 'PLUM'],
        group: 'group-4',
        description: 'Colours named after fruit.'
    }];

app.get('/', (req, res) => {
    res.send('Hello, Node server is running!')
});

app.get('/api', (req, res) => {
    res.send(data)
});

app.post('/submit', (req, res) => {
    const receivedData = req.body.sort();
    console.log('Received Data (post): ', receivedData);
    let answer = {};

    for (let i = 0; i <= 3; i++) {
        console.log('index value', data[i].words)
        if (receivedData.toString() == data[i].words.toString()) {
            answer = { result: true, group: data[i].group, description: data[i].description };
        }
    }

    if (answer) {
        res.send(answer)
    } else res.send(false)
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
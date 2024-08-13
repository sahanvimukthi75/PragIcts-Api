// backend/server.js

const express = require('express');
const cors = require('cors');
const httpntlm = require('httpntlm');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('frontend'));

app.get('/data', (req, res) => {
    const url = 'http://4.194.110.74:8148/AGC_UG_Test/ODataV4/Company(\'Asian%20Group%20Of%20Companies\')/getItem';
    const searchQuery = req.query.search || '';

    httpntlm.get({
        url: url,
        username: 'apiuser',
        password: 'Svc@1234$'
    }, function (err, response) {
        if (err) {
            console.error('Error during NTLM request:', err);
            res.status(500).send('Error retrieving data');
        } else {
            console.log('Response status code:', response.statusCode);
            console.log('Response body:', response.body);

            try {
                const jsonData = JSON.parse(response.body);
                const data = jsonData.value || [];

                const filteredData = data.filter(item => {
                    const text = `
                        ${item.no || ''} ${item.description || ''} ${item.type || ''} ${item.baseUnitMeasure || ''} 
                        ${item.inventory || ''} ${item.salesUnitMeasure || ''} ${item.purchUnitMeasure || ''} 
                        ${item.availableInventory || ''}
                    `.toLowerCase();

                    return text.includes(searchQuery.toLowerCase());
                });

                res.json(filteredData);
            } catch (parseError) {
                console.error('Error parsing response:', parseError);
                res.status(500).send('Error parsing data');
            }
        }
    });
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});

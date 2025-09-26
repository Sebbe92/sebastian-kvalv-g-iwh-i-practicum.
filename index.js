import 'dotenv/config';
import express from 'express';
import axios from 'axios';

const app = express();
const currentDir = process.cwd();
app.set('view engine', 'pug');
app.use(express.static(currentDir + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const CUSTOM_DOGS_HS_TOKEN = process.env.CUSTOM_DOGS_HS_TOKEN;
const dogApiUrl = 'https://api.hubapi.com/crm/v3/objects/2-192641628';
// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    const properties = 'name,breed,age';
    try {
        const dogObjectsUrl = dogApiUrl + '?properties=' + properties;
        const headers = {
            Authorization: `Bearer ${CUSTOM_DOGS_HS_TOKEN}`,
            'Content-Type': 'application/json'
        };
        const response = await axios.get(dogObjectsUrl, { headers });
        const result = response.data.results;
        res.render('index', { title: 'Custom Dogs | HubSpot APIs', result });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error rendering page');
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', async (req, res) => {
    const message = req.query.message;
    try {
        res.render('update', { title: 'Custom Dogs | Update Dog', message });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error rendering page');
    }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const {dogData} = req.body;
    const newDog = {
        properties: {
            "name": dogData.name,
            "breed": dogData.breed,
            "age": dogData.age
        }
    };
    
    const createDogUrl = dogApiUrl;
    const headers = {
        Authorization: `Bearer ${CUSTOM_DOGS_HS_TOKEN}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(createDogUrl, newDog, { headers });
        res.redirect('/update-cobj?message=Dog created/updated successfully');
    } catch (error) {
        res.redirect('/update-cobj?message=Error creating/updating dog');
    }
});
/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
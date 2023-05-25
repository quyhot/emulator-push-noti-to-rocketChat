const express = require('express')
const bodyParser = require('body-parser')
const apn = require('apn');
const gcm = require('node-gcm');
const fs = require("fs");
const app = express()
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())
const serverKey = ''
const port = 3001
const config = {
    production: false,
    key: "./PushKey.pem",
    cert: "./PushCert.pem",
    passphrase: 'Vetc@123'
}
const apnProvider = new apn.Provider(config);
const sender = new gcm.Sender(serverKey)

app.post('/:a/:b/:c', async (req, res) => {
    const {a, b, c} = req.params
    console.log(`a: ${a}, b: ${b}, c: ${c}`)
    if (b === 'apn') {
        const note = new apn.Notification()
        const {token, options} = req.body
        const {topic, text} = options
        note.topic = topic
        note.alert = text
        // note.body = text
        // note.title = 'test'
        // note.badge = 3
        const a = await apnProvider.send(note, token)
        console.log(a)
    } else if (b === 'gcm') {
        const {token, options} = req.body
        const {text} = options
        const message = new gcm.Message({
            data: {
                test: 'test'
            },
            notification: {
                title: "test",
                body: text
            }
        })
        const regTokens = [token]
        const a = await sender.send(message, {registrationTokens: regTokens}, function (err, response) {
            if (err) console.error(err);
            else console.log(response);
        })
        console.log(a)
    }
    res.status(200).end()
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

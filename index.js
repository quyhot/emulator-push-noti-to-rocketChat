const express = require('express')
const bodyParser = require('body-parser')
const apn = require('apn');
const app = express()
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())
const port = 3001

app.post('/:a/:b/:c', async (req, res) => {
    const {a, b, c} = req.params
    console.log(`a: ${a}, b: ${b}, c: ${c}`)
    if (b === 'apn') {
        const config = {
            production: false,
            key: "./PushKey.pem",
            cert: "./PushCert.pem",
            passphrase: 'Vetc@123'
        }
        const {token, options} = req.body
        const {topic, text} = options
        const apnProvider = new apn.Provider(config);
        const note = new apn.Notification()
        note.topic = topic
        note.alert = text
        // note.body = text
        // note.title = 'test'
        // note.badge = 3
        const a = await apnProvider.send(note, token)
        console.log(a)
    }
    res.status(200).end()
})

// app.post('/api/v1/:a/:b', (req, res) => {
//     const {a, b, c} = req.params
//     console.log(`a: ${a}, b: ${b}, c: ${c}`)
//     res.status(200).end()
// })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

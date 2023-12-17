const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

app.get('/api/test', (req, res) => {
	res.json({ message: 'This is the message from server!' })
})

const port = 4000
app.listen(port, () => {
	console.log(`App is listening on port ${port}`)
})

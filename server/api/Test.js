const API = require('../lib/API')

class TestAPI extends API {
	constructor() {
		super('/api/test')
	}

	onGet(req, res) {
		res.json({ message: 'This is the message from server!' })
	}
    
}

module.exports = TestAPI

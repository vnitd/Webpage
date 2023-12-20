const API = require('./API')

function checkFunction(instance, functionName) {
	var parent = new API()
	var parentFunction = parent[functionName]
	var childFunction = instance[functionName]

	return parentFunction !== childFunction
}

module.exports = checkFunction

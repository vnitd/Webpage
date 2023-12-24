const DAO = require('../lib/interface/DAO');
const Test = require('../model/Test');
const sql = require('mssql');

class TestDAO extends DAO {
	constructor() {
		super(Test, {
			id: sql.Int,
			name: sql.NVarChar(50),
			clazz: sql.NVarChar(10),
		});
	}

	getById() {}
	getIdAndNameAndClazzByNameAndClazz() {}
	setClazzByName() {}
	setClazzByIdAndName() {}
	// deleteById; // default = delete
	deleteByNameAndClass() {}
}

module.exports = TestDAO;

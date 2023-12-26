const DAO = require('../lib/interface/DAO');
const sql = require('mssql');

class TestDAO extends DAO {
	constructor() {
		super({
			id: sql.Int,
			name: sql.NVarChar(50),
			clazz: sql.NVarChar(10),
		});
	}

	getById() {}
	getIdAndNameAndClazzByNameAndClazz() {}
	setNameAndClazzByName() {}
	setClazzByIdAndName() {}
	// deleteById; // default = delete
	deleteByNameAndClass() {}
}

module.exports = TestDAO;

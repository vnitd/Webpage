class DAO {
	#sqlParams;
	constructor(sqlParams) {
		this.#sqlParams = sqlParams;
	}

	getParams() {
		return this.#sqlParams;
	}

	getPool() {}
	all() {}
	save() {}
	delete() {}
}

module.exports = DAO;

class DAO {
	#object;
	#sqlParams;
	constructor(object, sqlParams) {
		this.#object = object;
		this.#sqlParams = sqlParams;
	}

	getObject() {
		return this.#object;
	}

	getParams() {
		return this.#sqlParams;
	}

	all() {}
	save() {}
	delete() {}
}

module.exports = DAO;

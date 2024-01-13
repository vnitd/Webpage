class API {
	#path;
	app;
	constructor(path) {
		this.#path = path;
	}

	getPath = () => this.#path;

	onGet(req, res) {
		throw new Error(
			'Function `onGet` must be implemented before it was used.',
		);
	}

	onPut(req, res) {
		throw new Error(
			'Function `onPut` must be implemented before it was used.',
		);
	}

	onPost(req, res) {
		throw new Error(
			'Function `onPost` must be implemented before it was used.',
		);
	}

	onDelete(req, res) {
		throw new Error(
			'Function `onDelete` must be implemented before it was used.',
		);
	}
}

module.exports = API;

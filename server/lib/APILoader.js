const express = require('express');
const cors = require('cors');
const API = require('./interface/API');
const getAllJsFiles = require('./getAllJsFiles');
const checkFunction = require('./checkFunction');
const DBLoader = require('./DBLoader');

class APILoader {
	constructor(app) {
		API.app = app;
	}

	static #importAPIClasses(filePaths) {
		for (const filePath of filePaths) {
			try {
				const APIClass = require(filePath);

				if (typeof APIClass === 'function') {
					if (APIClass.prototype instanceof API) {
						const instance = new APIClass();
						const path = instance.getPath();
						const app = API.app;
						if (checkFunction(instance, 'onGet'))
							app.get(path, instance['onGet']);
						if (checkFunction(instance, 'onPost'))
							app.post(path, instance['onPost']);
						if (checkFunction(instance, 'onPut'))
							app.put(path, instance['onPut']);
						if (checkFunction(instance, 'onDelete'))
							app.delete(path, instance['onDelete']);
					} else {
						console.error(
							'API classes must be inherrited API class',
						);
					}
				} else {
					console.error(
						`Cannot detect the default class in \`${filePath}\` file!`,
					);
				}
			} catch (error) {
				console.error(
					`Error importing module from: ${filePath} - `,
					error,
				);
				throw error;
			}
		}
	}

	useJson() {
		API.app.use(express.json());
	}

	useCors() {
		API.app.use(cors());
	}

	useDatabase(path, dbconfig, showCommand = false, debugMode = false) {
		const dbLoader = new DBLoader(path, dbconfig);
		dbLoader.setShowCommand(showCommand);
		dbLoader.setDebugMode(debugMode);
		return dbLoader;
	}

	loadAPIs(path) {
		const filePaths = getAllJsFiles(path);
		APILoader.#importAPIClasses(filePaths);
	}

	listen(
		port,
		callback = () => console.log(`App is listening on port ${port}`),
	) {
		API.app.listen(port, callback);
	}
}

module.exports = APILoader;

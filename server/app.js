const express = require('express');
const path = require('path');
const APILoader = require('./lib/APILoader');
const TestDAO = require('./db/TestDAO');
const Test = require('./model/Test');
const app = express();

const apiLoader = new APILoader(app);

const dbConfig = {
	server: 'localhost',
	database: 'VNITD',
	user: 'sa',
	password: '1',
	pool: {
		max: 10,
		min: 0,
		idleTimeoutMillis: 10000,
	},
	options: {
		encrypt: false,
		trustServerCertificate: false,
	},
};
const apiDir = path.join(__dirname, 'api');
const dbDir = path.join(__dirname, 'db');

async function main() {
	apiLoader.useJson();
	apiLoader.useCors();
	const db = apiLoader.useDatabase(dbDir, dbConfig);

	await db.connect();
	await db.load();

	apiLoader.loadAPIs(apiDir);

	const test = new TestDAO();
	await test.all();

	await test.getById({ id: 26 });
	await test.getIdAndNameByNameAndClazz({
		name: 'Trần Việt Đăng Quang',
		clazz: 'SE17B04',
	});

	await db.disconnect();
	// console.log(await test.all());

	// const port = 4000;
	// // apiLoader.listen(port);
}

main();

const express = require('express');
const path = require('path');
const APILoader = require('./lib/APILoader');
const TestDAO = require('./db/TestDAO');
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
	const db = apiLoader.useDatabase(dbDir, dbConfig, true, true);

	await db.connect();
	await db.load();

	apiLoader.loadAPIs(apiDir);

	const test = new TestDAO();
	// console.log(await test.all());

	// await test.getById({ id: 30 });
	// await test.getIdAndNameAndClazzByNameAndClazz({
	// 	name: 'Trần Việt Đăng Quang',
	// 	clazz: 'SE17B04',
	// });

	// await test.save({ name: 'Mỹ Duyên', clazz: 'SE123456' });

	// await test.setNameAndClazzByName(
	// 	{ name: 'Mỹ Duyên', clazz: 'SE17B04' },
	// 	{ name: 'Trần Việt Đăng Quang' },
	// );

	await test.deleteByNameAndClazz({
		name: 'Mỹ Duyên',
		clazz: 'SE17B04',
	});

	// await test.deleteByNameAndClazz({
	// 	name: 'Thân Trọng An',
	// 	clazz: 'SE17B05',
	// });

	await db.disconnect();
	// console.log(await test.all());

	// const port = 4000;
	// apiLoader.listen(port);
}

main();

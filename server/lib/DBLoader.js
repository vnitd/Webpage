const sql = require('mssql');
const fs = require('fs');
const path = require('path');
const DAO = require('./interface/DAO');

class DBLoader {
	#path;
	#pool;
	constructor(path, database) {
		this.#path = path;
		this.#pool = new sql.ConnectionPool(database);
	}

	async connect() {
		try {
			await this.#pool.connect();
			console.log('Connected to SQL Server.');
		} catch (error) {
			console.log('Error connecting to SQL Server: ', error.message);
			throw error;
		}
	}

	async disconnect() {
		try {
			await this.#pool.close();
			console.log('Disconnected from SQL Server.');
		} catch (error) {
			console.log('Error disconnecting from SQL Server: ', error.message);
			throw error;
		}
	}

	#getAllDBFunction(instance) {
		let methods = Object.getOwnPropertyNames(instance);

		let prototype = Object.getPrototypeOf(instance);
		for (var i = 0; i < 2; i++) {
			methods = methods.concat(Object.getOwnPropertyNames(prototype));
			prototype = Object.getPrototypeOf(prototype);
		}

		return Array.from(new Set(methods)).filter(
			(value) =>
				value != 'constructor' &&
				value != 'getObject' &&
				value != 'getParams',
		);
	}

	async #execute(cmd, parameters = [], isQuery = true) {
		try {
			const request = new sql.Request(this.#pool);

			parameters.forEach((param) => {
				request.input(param.name, param.type, param.value);
			});

			const result = await request.query(cmd);
			// request.cancel();
			if (isQuery) return result.recordset;
			else return result.rowsAffected;
		} catch (error) {
			console.error('Error executing SQL query: ', error.message);
			throw error;
		}
	}

	#convertToObject(json, object) {
		const instance = new object();
		for (const property of Object.getOwnPropertyNames(instance)) {
			instance[property] = json[property];
		}
		return instance;
	}

	#paramize(data, params) {
		const res = [];
		for (const prop of Object.keys(data)) {
			res.push({
				name: prop,
				type: params[prop],
				value: data[prop],
			});
		}
		return res;
	}

	#processGet(tableName, functionName, object, parameters) {
		const splittedString = functionName.split('By');
		if (splittedString.length === 2) {
			const [tar, src] = splittedString;
			const tarColumns = tar
				? tar.split('And').map((val) => val.toLowerCase())
				: false;
			const srcColumns = src
				? src.split('And').map((val) => val.toLowerCase())
				: false;

			const sqlTar = tarColumns ? tarColumns.join(', ') : '*';

			let sqlQuery = `SELECT ${sqlTar} FROM ${tableName} `;
			if (srcColumns)
				sqlQuery += `WHERE ${srcColumns
					.map((val) => val + '=@' + val)
					.join(' AND ')}`;
			return async (data) => {
				const result = await this.#execute(
					sqlQuery,
					this.#paramize(data, parameters),
				);

				console.log(
					`Get ${sqlTar} by ${srcColumns.join(
						', ',
					)} on ${tableName}, result: `,
					result,
				);

				return result;
			};
		} else {
			throw new Error(
				'The format of the function name must be: `get...By...`. You can use `And` to split columns.',
			);
		}
	}

	#createFunction(tableName, functionName, object, parameters) {
		if (typeof object !== 'function')
			throw new Error('The given object is not a class!');
		const instance = new object();

		if (functionName === 'all') {
			return async () => {
				const params = Object.getOwnPropertyNames(instance).join(', ');
				const sql = `SELECT ${params} FROM ${tableName}`;
				const result = await this.#execute(sql);
				// const aRes = [];

				console.log(`Get all data on ${tableName}, result: `, result);

				// result.forEach((value) => {
				// 	aRes.push(this.#convertToObject(value, object));
				// });

				return result;
			};
		} else if (functionName === 'save') {
			const paramWithoutID = Object.getOwnPropertyNames(instance).filter(
				(prop) => prop !== 'id',
			);
			const variables = paramWithoutID.map((val) => '@' + val);
			return async (data) => {
				const sqlQuery = `
		MERGE INTO ${tableName} AS target
		USING (VALUES (${variables.join(', ')})) AS source (${paramWithoutID.join(
					', ',
				)})
		ON target.id = @id
		WHEN MATCHED THEN
			UPDATE SET ${paramWithoutID
				.map((val) => `target.${val} = source.${val}`)
				.join(', ')}
		WHEN NOT MATCHED THEN
			INSERT (${paramWithoutID.join(', ')}) VALUES (${variables.join(', ')});
`;

				const result = await this.#execute(
					sqlQuery,
					this.#paramize(data, parameters),
					false,
				);
				console.log(`Saved ${result} rows to ${tableName}`);
			};
		} else if (functionName === 'delete') {
			return async (id) => {
				const sql = `
		DELETE FROM ${tableName} WHERE id=@id
`;
				const result = await this.#execute(
					sql,
					this.#paramize({ id }, parameters),
					false,
				);
				console.log(`Deleted ${result} rows from ${tableName}`);
			};
		} else if (functionName === 'getPool') {
			return () => {
				new sql.Request(this.#pool);
			};
		} else if (functionName.startsWith('get')) {
			// console.log(functionName);
			return this.#processGet(
				tableName,
				functionName.substr(3),
				object,
				parameters,
			);
		}
	}

	#analyzeDBClass(instance, prototype, fileName, functions) {
		const tableName = fileName.substr(0, fileName.length - 3).toLowerCase();
		functions.forEach((functionName) => {
			const function_ = this.#createFunction(
				tableName,
				functionName,
				instance.getObject(),
				instance.getParams(),
			);
			prototype[functionName] = function_;
		});
	}

	load() {
		try {
			const files = fs.readdirSync(this.#path);
			for (const file of files) {
				if (file.endsWith('.js')) {
					const filePath = path.join(this.#path, file);
					const fileName = path.basename(filePath, '.js');
					const DBClass = require(filePath);
					if (fileName.endsWith('DAO'))
						if (typeof DBClass === 'function') {
							if (DBClass.prototype instanceof DAO) {
								const instance = new DBClass();
								this.#analyzeDBClass(
									instance,
									DBClass.prototype,
									fileName,
									this.#getAllDBFunction(instance),
								);
							}
						}
				}
			}
		} catch (error) {
			console.error('Error loading and executing: ', error.message);
			throw error;
		}
	}
}

module.exports = DBLoader;

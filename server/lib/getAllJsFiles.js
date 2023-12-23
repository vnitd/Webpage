const fs = require('fs');
const path = require('path');

function getAllJsFiles(dir, fileList = []) {
	const files = fs.readdirSync(dir);

	files.forEach((file) => {
		const filePath = path.join(dir, file);
		if (fs.statSync(filePath).isDirectory()) {
			this.getAllJsFiles(filePath, fileList);
		} else {
			fileList.push(filePath);
		}
	});
	return fileList;
}

module.exports = getAllJsFiles;

import fs from "fs";
import path from "path";
import zlib from "zlib";

export function renameAlsGz(file: string) {
	var parsePath = path.parse(file);
	if (parsePath.ext != ".als") {
		throw new Error(
			'Invalid AbletonLive(.als) File'
		);
	}
	parsePath.ext = ".gz";
	parsePath.base = parsePath.base.substring(0, parsePath.base.lastIndexOf(".")) + ".gz";
	var newFile = path.format(parsePath);
	fs.copyFile(file, newFile, (err) => {
		if (err) throw err;
	});
	return newFile;
}

export function extractGz(src: string, dst: string, callback: Function) {
	// check if src file exists
	if (!fileExists(src)) {
		return false;
	}

	try {
		// prepare streams
		var source = fs.createReadStream(src);
		var destination = fs.createWriteStream(dst);

		// extract the archive
		source.pipe(zlib.createGunzip()).pipe(destination);

		// callback on extract completion
		destination.on('close', function() {
			callback();
		});
	} catch (err) {
		throw err;
	}
}

// checks whether a file exists
function fileExists(file: string): boolean {
	try {
		return fs.statSync(file).isFile();
	} catch (err) {
		return false;
	}
}



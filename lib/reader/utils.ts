import fs from "fs";
import path from "path";
import zlib from "zlib";
import fileType from "file-type";

export function copyFileAsync(src: string, dst: string): Promise<any> {
	return new Promise((resolve, reject) => {
		fs.copyFile(src, dst, (err) => {
			if (err) reject(err);
			resolve();
		});
	});
}

export function extractGz(src: string, dst: string): Promise<any> {
	// check if src file exists
	if (!fileExists(src)) {
		throw new Error(
			'Invalid File Doesnt Exist'
		);
	}

	return new Promise((resolve, reject) => {
		try {
			// prepare streams
			var source = fs.createReadStream(src);
			var destination = fs.createWriteStream(dst);
			// extract the archive
			source.pipe(zlib.createGunzip()).pipe(destination);
			// callback on extract completion
			destination.on('close', resolve);
		} catch (err) {
			reject(err);
		}
	});
}

// checks whether a file exists
function fileExists(file: string): boolean {
	try {
		return fs.statSync(file).isFile();
	} catch (err) {
		return false;
	}
}

export function readFileAsync(file: string): Promise<any> {
	return new Promise((resolve, reject) => {
		fs.readFile(file, function(err, data) {
			if (err) reject(err);
			resolve(data);
		});
	});
}

export async function getType(file: string) {
	var stream = await fileType.stream(fs.createReadStream(file));
	return stream.fileType;
}

export function changeExt(file: string, newExt: string) {
	var parsePath = path.parse(file);
	parsePath.ext = newExt;
	parsePath.base = parsePath.base.substring(0, parsePath.base.lastIndexOf(".")) + newExt;
	return path.format(parsePath);
}

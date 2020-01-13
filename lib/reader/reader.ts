import { changeExt, getType, copyFileAsync, extractGz } from "./utils";
import { loadXml, saveXml } from "./xml";
import path from "path";


export const INVALID_FILE = new Error("File type cannot be recognized");

export class Reader {
	file: string;
	gzfile: string;
	xmlJs: any;
	constructor(file: string) {
		this.file = file;
		this.gzfile = changeExt(this.file, ".gz");
	}

	async load() {
		// TODO: Make Parser Smart, when the project folder is given find the project file.
		var fileType = await getType(this.file);
		if (fileType === undefined) throw INVALID_FILE;
		if (fileType.mime != "application/xml" && fileType.mime != "application/gzip") throw INVALID_FILE;
		// If file is not already extracted
		if (fileType.mime != "application/xml") {
			await copyFileAsync(this.file, this.gzfile);
			await extractGz(this.gzfile, this.file);
		}
		this.xmlJs = await loadXml(this.file);
		return this.xmlJs;
	}

	async save(file: string) {
		await saveXml(file, this.xmlJs);
	}
} 
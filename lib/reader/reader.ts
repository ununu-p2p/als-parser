import { changeExt, getType, copyFileAsync, extractGz } from "./utils";
import { loadXml } from "./xml";
import path from "path";

export class Reader {
	file: string;
	gzfile: string;
	xmlJs: any;
	constructor(file: string) {
		this.file = file;
		this.gzfile = changeExt(this.file, ".gz");
	}

	async load() {
		var fileType = await getType(this.file);
		if (fileType != undefined) {
			// If file is not already extracted 
			if (fileType.mime != "application/xml") {
				await copyFileAsync(this.file, this.gzfile);
				await extractGz(this.gzfile, this.file);
			}
			this.xmlJs = await loadXml(this.file);
			return this.xmlJs;
		}
		else {
			throw new Error("File type cannot be determined");
		}
	}
} 
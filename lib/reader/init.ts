import { renameAlsGz, extractGz } from "./utils";
import { loadXml } from "./xml"

export class Reader {
	file: string;	
	xmlJs: any;
	constructor(file:string) {
		var gzfile = renameAlsGz(file);
		extractGz(gzfile, file, () => console.log("Project Loaded"))
		this.file = file;
	}

	async load() {
		this.xmlJs = await loadXml(this.file);
		return this.xmlJs;
	}
} 
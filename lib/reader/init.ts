import { renameAlsGz, extractGz } from "./utils";

export class Reader {
	constructor(file:string) {
		var gzfile = renameAlsGz(file);
		extractGz(gzfile, file, () => console.log("Project Loaded"))
	}
} 
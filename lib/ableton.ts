import { Reader } from "./reader/reader";

export class AbletonParser {
	file: string;
	xmlJs: any;
	constructor(file: string) {
		this.file = file;
	}
	async load() {
		var reader = new Reader(this.file);
		this.xmlJs = await reader.load();
	}
	getTracks() {
		return this.xmlJs.Ableton.LiveSet[0].Tracks;
	}
}
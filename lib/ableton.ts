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
	getTracksCount() {
		var rawTracks = this.xmlJs.Ableton.LiveSet[0].Tracks[0];
		var trackCount: {[index: string]: any} = new Object();
		for (var trackGroup in rawTracks) {
			trackCount[trackGroup] = rawTracks[trackGroup].length;
		} 
		return trackCount;
	}
}
import { Reader } from "./reader/reader";
import { Fileref } from "./fileref/fileref";
import { deepRecurrsion } from "./utils"

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
	getResourceLocations() {
		let resList = new Set();
	    deepRecurrsion(this.xmlJs, 'FileRef', this.appendResourceList, resList);
	    return Array.from(resList);
	}
	private appendResourceList(obj: any, resList: Set<String>) {
	    let fileref = new Fileref(obj[0]);
	    resList.add(fileref.getLocation()); 
	}
	changeResourceLocation(location: String) {
		// Modify the XmlJs
		// Save the Modified XmlJs
	}
}


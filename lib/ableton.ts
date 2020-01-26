import { Reader } from "./reader/reader";
import { Fileref } from "./fileref/fileref";
import { deepRecurrsion } from "./utils";

export class AbletonParser {
	file: string;
	reader: any;
	constructor(file: string) {
		this.file = file;
	}
	async load() {
		this.reader = new Reader(this.file);
		await this.reader.load();
	}
	getTracks() {
		return this.reader.xmlJs.Ableton.LiveSet[0].Tracks;
	}
	getTracksCount() {
		var rawTracks = this.reader.xmlJs.Ableton.LiveSet[0].Tracks[0];
		var trackCount: {[index: string]: any} = new Object();
		for (var trackGroup in rawTracks) {
			trackCount[trackGroup] = rawTracks[trackGroup].length;
		} 
		return trackCount;
	}
	getResourceLocations() {
		let resList = new Set();
	    deepRecurrsion(this.reader.xmlJs, 'FileRef', this.appendResourceList, resList);
	    return Array.from(resList);
	}
	getFilerefs() {
		let resList = new Set();
	    deepRecurrsion(this.reader.xmlJs, 'FileRef', this.appendReferenceList, resList);
	    return Array.from(resList);
	}
	private appendReferenceList(obj: any, resList: Set<any>) {
	    resList.add(obj[0]);
	}
	private appendResourceList(obj: any, resList: Set<String>) {
	    let fileref = new Fileref(obj[0]);
	    resList.add(fileref.getLocation()); 
	}
	changeResourceLocations(location: String) {
		// Modify the XmlJ
		deepRecurrsion(this.reader.xmlJs, 'FileRef', this.changeLocation, location, this.file);
		// Save the Modified reader.xmlJs
		this.reader.save(this.file);
	}
	private changeLocation(obj: any, resourceFolder: string, project: string) {
		let fileref = new Fileref(obj[0]);
		fileref.changeLocation(resourceFolder, project);
	}
}


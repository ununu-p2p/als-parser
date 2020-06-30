import path from "path";
import { Reader } from "./reader/reader";
import { Fileref } from "./fileref/fileref";
import { deepRecurrsion } from "./utils";

const defaultTracks = ['Reverb Default.adv']

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
	getResourceLocations(internal=false): string[]{
		let resList = new Set<string>();
	    deepRecurrsion(this.reader.xmlJs, 'FileRef', this.appendResourceList, resList, internal);
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
	private appendResourceList(obj: any, resList: Set<string>, internal=false) {
	    let fileref = new Fileref(obj[0]);
	    let fileName = fileref.getFileName();
	    if (fileName != ''  && !defaultTracks.includes(fileName)) {
	    	if (!fileref.isInternal || internal) {
	    		resList.add(fileref.getRelativeLocation());  
	    	}
	    }
	}
	changeResourceLocations(location: string, internal=false, useData=false, overideFileCheck=false) {
	    // Modify the XmlJ
		deepRecurrsion(this.reader.xmlJs, 'FileRef', this.changeLocation, location, 
			           this.file, internal, useData, overideFileCheck);
		// Save the Modified reader.xmlJs
		this.reader.save(this.file);
	}
	private changeLocation(obj: any, resourceFolder: string, project: string, 
		                   internal=false, useData=false, overideFileCheck=false) {
		let fileref = new Fileref(obj[0], useData);
		let fileName = fileref.getFileName();
		if (fileref.getFileName() != '' && !defaultTracks.includes(fileName)) {
			if (!fileref.isInternal || internal) {
				fileref.changeLocation(resourceFolder, project, overideFileCheck);
			}
		}
	}
}


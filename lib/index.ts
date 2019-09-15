import { Reader } from "./reader/init";

export async function parseFile(file: string) {
	var reader = new Reader(file);
	var xmlJs = await reader.load();
	// console.log(xmlJs.Ableton.LiveSet[0].Tracks);
	return xmlJs;
}

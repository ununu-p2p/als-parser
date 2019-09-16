import { AbletonParser } from "./ableton";

export async function parseFile(file: string) {
	var abletonParser = new AbletonParser(file);
	await abletonParser.load();
	return abletonParser;
}
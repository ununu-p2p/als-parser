import { AbletonParser } from "./ableton";

export async function parseFile(file: string) {
    console.log("Ableton Parser Initialise", file);
	var abletonParser = new AbletonParser(file);
	await abletonParser.load();
	return abletonParser;
}
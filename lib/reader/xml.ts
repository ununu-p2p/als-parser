import { Parser } from "xml2js";
import { readFileAsync } from "./utils";

export async function loadXml(file: string) {
	var parser = new Parser();
	var raw_xml = await readFileAsync(file);
	return parser.parseStringPromise(raw_xml);
}

import { Parser, Builder } from "xml2js";
import { readFileAsync, writeFileAsync } from "./utils";

export async function loadXml(file: string) {
	let parser = new Parser();
	let raw_xml = await readFileAsync(file);
	return parser.parseStringPromise(raw_xml);
}

export async function saveXml(file: string, obj: any) {
    let builder = new Builder();
    let xml = builder.buildObject(obj);
    writeFileAsync(file, xml);
}
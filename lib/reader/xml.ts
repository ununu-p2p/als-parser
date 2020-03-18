import { Parser, Builder } from "xml2js";
import fs from "fs";
import { readFileAsync, writeFileAsync } from "./utils";

export async function loadXml(file: string) {
	let parser = new Parser();
	let rawXml = await readFileAsync(file);
	return parser.parseStringPromise(rawXml);
}

export async function saveXml(file: string, obj: any) {
    let builder = new Builder();
    let xml = builder.buildObject(obj);
    // Only perform write if needed
    if(fs.existsSync(file)) {
        let eXml = await readFileAsync(file);
        if (eXml == xml) return;
    }
    writeFileAsync(file, xml);
}
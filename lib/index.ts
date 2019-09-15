import { Reader } from "./reader/init";

export function parseFile(file: string) {
	var reader = new Reader(file);
	return reader;
}

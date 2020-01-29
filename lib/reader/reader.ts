import { getType, gunzipInMemory } from "./utils";
import { loadXml, saveXml } from "./xml";

export const INVALID_FILE = new Error("File type cannot be recognized");

export class Reader {
  fileName: string;
  xmlJs: any;

  constructor(fileName: string) {
    this.fileName = fileName;
  }

  async load() {
    // TODO: Make Parser Smart, when the project folder is given find the project fileName.
    const fileType = await getType(this.fileName);

    if (
      fileType === undefined ||
      (fileType.mime !== "application/xml" &&
        fileType.mime !== "application/gzip")
    ) {
      throw INVALID_FILE;
    }

    if (fileType.mime !== "application/xml") {
      await gunzipInMemory(this.fileName);
    }

    this.xmlJs = await loadXml(this.fileName);
    return this.xmlJs;
  }

  async save(file: string) {
    await saveXml(file, this.xmlJs);
  }
}

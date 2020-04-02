import { FilerefData } from "./fileref-data";
export declare class Fileref {
    fileref: any;
    data: FilerefData;
    constructor(fileref: any);
    getLocation(): string;
    changeLocation(resourceFolder: string, project: string, overrideFileCheck?: boolean): void;
}

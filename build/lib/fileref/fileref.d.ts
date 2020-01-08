import { FilerefData } from "./fileref-data";
export declare class Fileref {
    fileref: any;
    data: FilerefData;
    constructor(fileref: any);
    getLocation(): string;
}
export declare function changeLocation(fileref: any): void;

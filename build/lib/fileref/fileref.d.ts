import { FilerefData } from "./fileref-data";
export declare class Fileref {
    fileref: any;
    data?: FilerefData;
    isInternal: boolean;
    useData: boolean;
    hasRelativePath: boolean;
    pathType: number;
    constructor(fileref: any, useData?: boolean);
    getRelativeLocation(): string;
    getFileName(): string;
    changeLocation(resourceFolder: string, project: string, overrideFileCheck?: boolean): void;
}

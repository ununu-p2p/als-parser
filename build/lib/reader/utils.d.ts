import fileType from "file-type";
export declare function copyFileAsync(src: string, dst: string): Promise<any>;
export declare function extractGz(src: string, dst: string): Promise<any>;
export declare function readFileAsync(file: string): Promise<any>;
export declare function getType(file: string): Promise<fileType.FileTypeResult | undefined>;
export declare function changeExt(file: string, newExt: string): string;

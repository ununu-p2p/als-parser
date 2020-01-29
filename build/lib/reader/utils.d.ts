export declare function copyFileAsync(src: string, dst: string): Promise<any>;
export declare function gunzipInMemory(fileName: string): Promise<void>;
export declare function fileExists(file: string): boolean;
export declare function readFileAsync(file: string): Promise<any>;
export declare function writeFileAsync(file: string, data: string): Promise<any>;
export declare function getType(file: string): Promise<import("file-type/core").FileTypeResult | undefined>;
export declare function changeExt(file: string, newExt: string): string;

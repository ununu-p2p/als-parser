export declare const INVALID_FILE: Error;
export declare class Reader {
    fileName: string;
    xmlJs: any;
    constructor(fileName: string);
    load(): Promise<any>;
    save(file: string): Promise<void>;
}

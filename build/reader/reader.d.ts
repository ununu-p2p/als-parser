export declare class Reader {
    file: string;
    gzfile: string;
    xmlJs: any;
    constructor(file: string);
    load(): Promise<any>;
}

export declare class Reader {
    file: string;
    xmlJs: any;
    constructor(file: string);
    load(): Promise<any>;
}

export declare class AbletonParser {
    file: string;
    reader: any;
    constructor(file: string);
    load(): Promise<void>;
    getTracks(): any;
    getTracksCount(): {
        [index: string]: any;
    };
    getResourceLocations(internal?: boolean): string[];
    getFilerefs(): unknown[];
    private appendReferenceList;
    private appendResourceList;
    changeResourceLocations(location: string, internal?: boolean, useData?: boolean, overideFileCheck?: boolean): void;
    private changeLocation;
}

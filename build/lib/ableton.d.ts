export declare class AbletonParser {
    file: string;
    reader: any;
    constructor(file: string);
    load(): Promise<void>;
    getTracks(): any;
    getTracksCount(): {
        [index: string]: any;
    };
    getResourceLocations(): unknown[];
    getFilerefs(): unknown[];
    private appendReferenceList;
    private appendResourceList;
    changeResourceLocations(location: String): void;
    private changeLocation;
}

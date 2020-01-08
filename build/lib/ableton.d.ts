export declare class AbletonParser {
    file: string;
    xmlJs: any;
    constructor(file: string);
    load(): Promise<void>;
    getTracks(): any;
    getTracksCount(): {
        [index: string]: any;
    };
    getResourceLocations(): unknown[];
    private appendResourceList;
    changeResourceLocation(location: String): void;
}

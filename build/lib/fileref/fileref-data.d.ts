export declare class FilerefData {
    header: string;
    diskName: string;
    relativeLocation: string;
    footer: string;
    external: boolean;
    diskLocation: string;
    constructor(header: string, diskName: string, relativeLocation: string, footer: string, external: boolean, diskLocation: string);
    getFileName(): string;
    getDir(): string;
    getLocation(delminator: string): string;
    getRelativeLocation(delminator: string): string;
    getDiskLocation(delminator: string): string;
    getDiskName(): string;
    getHeader(): string;
    getFooter(): string;
    isExternal(): boolean;
    setLocation(location: string): void;
}
export declare function unmarshall(stream: string): FilerefData;
export declare function marshall(data: FilerefData): string;

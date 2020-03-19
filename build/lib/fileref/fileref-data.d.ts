export declare class FilerefData {
    header: string;
    diskName: string;
    location: string;
    footer: string;
    external: boolean;
    constructor(header: string, diskName: string, location: string, footer: string, external: boolean);
    getFileName(): string;
    getDir(): string;
    getLocation(delminator: string): string;
    getDiskName(): string;
    getHeader(): string;
    getFooter(): string;
    isExternal(): boolean;
    setLocation(location: string): void;
}
export declare function unmarshall(stream: string): FilerefData;
export declare function marshall(data: FilerefData): string;

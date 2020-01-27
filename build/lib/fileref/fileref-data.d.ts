export declare class FilerefData {
    header: string;
    systemName: string;
    location: string;
    footer: string;
    constructor(header: string, systemName: string, location: string, footer: string);
    getFileName(): string;
    getDir(): string;
    getLocation(delminator: string): string;
    getSystemName(): string;
    getHeader(): string;
    getFooter(): string;
    setLocation(location: string): void;
}
export declare function unmarshall(stream: string): FilerefData;
export declare function marshall(data: FilerefData): string;

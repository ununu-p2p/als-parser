export declare class FilerefData {
    systemName: string;
    location: string;
    format: string;
    constructor(systemName: string, location: string, format: string);
    getFileName(): string;
    getDir(): string;
    getLocation(delminator: string): string;
    getSystemName(): string;
    getFormat(): string;
    setLocation(location: string): void;
}
export declare function unmarshall(stream: string): FilerefData;
export declare function marshall(data: FilerefData): string;

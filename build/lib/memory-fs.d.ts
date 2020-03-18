declare type MountOpts = {
    dest?: string;
    recursively?: boolean;
};
export declare function mountDirectory(volume: any, src: string, opts?: MountOpts): void;
export declare function mountFile(volume: any, src: string, dest?: string): void;
export {};

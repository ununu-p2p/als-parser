import { unmarshall, FilerefData } from "./fileref-data";

export class Fileref {
    fileref: any;
    data: FilerefData;
    constructor(fileref: any) {
        this.fileref = fileref;
        let hex = fileref.Data[0].replace(/\n/g, '').replace(/\t/g, '');
        this.data = unmarshall(hex);
    }
    getLocation() {
        return this.data.getLocation('/');
    }
}

export function changeLocation(fileref: any) {

} 




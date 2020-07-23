import { unmarshall, marshall, FilerefData } from "./fileref-data";
import path from "path";
import { fileExists } from "./../reader/utils";

export class Fileref {
    fileref: any;
    data?: FilerefData;
    isInternal: boolean;
    useData: boolean;
    hasRelativePath: boolean;
    pathType: number;
    constructor(fileref: any, useData = false) {
        this.fileref = fileref;
        this.pathType = fileref.RelativePathType[0]['$'].Value
        this.hasRelativePath = this.fileref.HasRelativePath[0]['$'].Value === 'true'
        /*
            Hack: All th tracks which have a live pack name or 
            do not have relative path define are considered or 
            has pathType equals 6
            as internal resources.
        */
        this.isInternal = this.fileref.LivePackName[0]['$'].Value != '' || !this.hasRelativePath || this.pathType == 6
        this.useData = useData
        if(useData){
            let hex = fileref.Data[0].replace(/\n/g, '').replace(/\t/g, '').replace(/ /g, '');
            this.data = unmarshall(hex);
        }
    }
    getRelativeLocation() {
        let relativePathArray: string[] = [];
        let relativePathElement = this.fileref.RelativePath[0].RelativePathElement;
        for (let pathEntry of relativePathElement) {
            if (pathEntry['$']['Dir'] == '') relativePathArray.push('..');
            else relativePathArray.push(pathEntry['$']['Dir']);
        }
        relativePathArray.push(this.getFileName())
        return relativePathArray.join(path.sep)
    }
    getFileName():string {
       return this.fileref.Name[0]['$'].Value;
    }
    changeLocation(resourceFolder: string, project: string, overrideFileCheck = false) {
        // Get the absolute path of the objects
        resourceFolder = path.resolve(resourceFolder);
        project = path.resolve(project);
        // Change the Binary Data
        let resource = path.join(resourceFolder, this.getFileName());
        // Verify if the location Exists
        // TODO: Throw Error on resource doesn't exist
        if (!fileExists(resource) && !overrideFileCheck) return;
        // Only modify the data if needed
        if (this.useData && this.data) {
            this.data.setLocation(resource);
            this.fileref.Data[0] = marshall(this.data);
        }
        // Remove the Path hint
        this.fileref.SearchHint[0].PathHint = [];
        // Update the Relative path
        let projectFolder = path.parse(project).dir;
        let relativePathArray = path.relative(projectFolder, resourceFolder).split(path.sep);
        if (this.fileref.HasRelativePath[0]['$'].Value === "true") {
            this.fileref.RelativePath[0].RelativePathElement = [];
            for (let index in relativePathArray) {
                if (relativePathArray[index] == "..") relativePathArray[index] = '';
                let obj = {
                    '$': {
                        Id: index.toString(),
                        Dir: relativePathArray[index]
                    }
                };
                this.fileref.RelativePath[0].RelativePathElement.push(obj);
            }
        }
        this.fileref.LivePackName[0]['$'].Value = '';
        this.fileref.LivePackId[0]['$'].Value = '';
        this.fileref.RelativePathType[0]['$'].Value = '3';
    }
}




import { unmarshall, marshall, FilerefData } from "./fileref-data";
import path from "path";
import { fileExists } from "./../reader/utils";

export class Fileref {
    fileref: any;
    data: FilerefData;
    constructor(fileref: any) {
        this.fileref = fileref;
        let hex = fileref.Data[0].replace(/\n/g, '').replace(/\t/g, '').replace(/ /g, '');
        this.data = unmarshall(hex);
    }
    getLocation() {
        return this.data.getLocation('/');
    }
    changeLocation(resourceFolder: string, project: string, overrideFileCheck = false) {
        // Get the absolute path of the objects
        resourceFolder = path.resolve(resourceFolder);
        project = path.resolve(project);
        // Change the Binary Data
        let resource = path.join(resourceFolder, this.data.getFileName());
        // Verify if the location Exists
        // TODO: Throw Error on resource doesn't exist
        if (!fileExists(resource) && !overrideFileCheck) return;
        this.data.setLocation(resource);
        this.fileref.Data[0] = marshall(this.data);
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




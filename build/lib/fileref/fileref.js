"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fileref_data_1 = require("./fileref-data");
var path_1 = __importDefault(require("path"));
var utils_1 = require("./../reader/utils");
var Fileref = /** @class */ (function () {
    function Fileref(fileref, useData) {
        if (useData === void 0) { useData = false; }
        this.fileref = fileref;
        this.pathType = fileref.RelativePathType[0]['$'].Value;
        this.hasRelativePath = this.fileref.HasRelativePath[0]['$'].Value === 'true';
        /*
            Hack: All th tracks which have a live pack name or
            do not have relative path define are considered or
            has pathType equals 6
            as internal resources.
        */
        this.isInternal = this.fileref.LivePackName[0]['$'].Value != '' || !this.hasRelativePath || this.pathType == 6;
        this.useData = useData;
        if (useData) {
            var hex = fileref.Data[0].replace(/\n/g, '').replace(/\t/g, '').replace(/ /g, '');
            this.data = fileref_data_1.unmarshall(hex);
        }
    }
    Fileref.prototype.getRelativeLocation = function () {
        var relativePathArray = [];
        var relativePathElement = this.fileref.RelativePath[0].RelativePathElement;
        for (var _i = 0, relativePathElement_1 = relativePathElement; _i < relativePathElement_1.length; _i++) {
            var pathEntry = relativePathElement_1[_i];
            if (pathEntry['$']['Dir'] == '')
                relativePathArray.push('..');
            else
                relativePathArray.push(pathEntry['$']['Dir']);
        }
        relativePathArray.push(this.getFileName());
        return relativePathArray.join(path_1.default.sep);
    };
    Fileref.prototype.getFileName = function () {
        return this.fileref.Name[0]['$'].Value;
    };
    Fileref.prototype.changeLocation = function (resourceFolder, project, overrideFileCheck) {
        if (overrideFileCheck === void 0) { overrideFileCheck = false; }
        // Get the absolute path of the objects
        resourceFolder = path_1.default.resolve(resourceFolder);
        project = path_1.default.resolve(project);
        // Change the Binary Data
        var resource = path_1.default.join(resourceFolder, this.getFileName());
        // Verify if the location Exists
        // TODO: Throw Error on resource doesn't exist
        if (!utils_1.fileExists(resource) && !overrideFileCheck)
            return;
        // Only modify the data if needed
        if (this.useData && this.data) {
            this.data.setLocation(resource);
            this.fileref.Data[0] = fileref_data_1.marshall(this.data);
        }
        // Remove the Path hint
        this.fileref.SearchHint[0].PathHint = [];
        // Update the Relative path
        var projectFolder = path_1.default.parse(project).dir;
        var relativePathArray = path_1.default.relative(projectFolder, resourceFolder).split(path_1.default.sep);
        this.fileref.RelativePath[0].RelativePathElement = [];
        for (var index in relativePathArray) {
            if (relativePathArray[index] == "..")
                relativePathArray[index] = '';
            var obj = {
                '$': {
                    Id: index.toString(),
                    Dir: relativePathArray[index]
                }
            };
            this.fileref.RelativePath[0].RelativePathElement.push(obj);
        }
        this.fileref.LivePackName[0]['$'].Value = '';
        this.fileref.LivePackId[0]['$'].Value = '';
        this.fileref.RelativePathType[0]['$'].Value = '3';
    };
    return Fileref;
}());
exports.Fileref = Fileref;

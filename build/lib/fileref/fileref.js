"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fileref_data_1 = require("./fileref-data");
var path_1 = __importDefault(require("path"));
var utils_1 = require("./../reader/utils");
var Fileref = /** @class */ (function () {
    function Fileref(fileref) {
        this.fileref = fileref;
        var hex = fileref.Data[0].replace(/\n/g, '').replace(/\t/g, '');
        this.data = fileref_data_1.unmarshall(hex);
    }
    Fileref.prototype.getLocation = function () {
        return this.data.getLocation('/');
    };
    Fileref.prototype.changeLocation = function (resourceFolder, project) {
        // Get the absolute path of the objects
        resourceFolder = path_1.default.resolve(resourceFolder);
        project = path_1.default.resolve(project);
        // Change the Binary Data
        var resource = path_1.default.join(resourceFolder, this.data.getFileName());
        // Verify if the location Exists
        // TODO: Throw Error on resource doesn't exist
        if (!utils_1.fileExists(resource))
            return;
        this.data.setLocation(resource);
        this.fileref.Data[0] = fileref_data_1.marshall(this.data);
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
    };
    return Fileref;
}());
exports.Fileref = Fileref;

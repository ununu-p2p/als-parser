"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fileref_data_1 = require("./fileref-data");
var Fileref = /** @class */ (function () {
    function Fileref(fileref) {
        this.fileref = fileref;
        var hex = fileref.Data[0].replace(/\n/g, '').replace(/\t/g, '');
        this.data = fileref_data_1.unmarshall(hex);
    }
    Fileref.prototype.getLocation = function () {
        return this.data.getLocation('/');
    };
    return Fileref;
}());
exports.Fileref = Fileref;
function changeLocation(fileref) {
}
exports.changeLocation = changeLocation;

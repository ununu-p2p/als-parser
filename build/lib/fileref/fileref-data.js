"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var utils_1 = require("./utils");
var FilerefData = /** @class */ (function () {
    function FilerefData(header, systemName, location, footer) {
        this.header = header;
        this.systemName = systemName;
        this.location = location;
        this.footer = footer;
    }
    FilerefData.prototype.getFileName = function () {
        return path_1.default.parse(this.location).base;
    };
    FilerefData.prototype.getDir = function () {
        return path_1.default.basename(path_1.default.dirname(this.location));
    };
    FilerefData.prototype.getLocation = function (delminator) {
        return this.location.split(path_1.default.sep).join(delminator);
    };
    FilerefData.prototype.getSystemName = function () {
        return this.systemName;
    };
    FilerefData.prototype.getHeader = function () {
        return this.header;
    };
    FilerefData.prototype.getFooter = function () {
        return this.footer;
    };
    FilerefData.prototype.setLocation = function (location) {
        // Store the absolute location but donot have the deliminator in the start
        location = path_1.default.resolve(location);
        if (location[0] == path_1.default.sep)
            location = location.substr(1);
        this.location = location;
    };
    return FilerefData;
}());
exports.FilerefData = FilerefData;
function headEnd(stream) {
    for (var index = 0; index < stream.length; index++) {
        // Find the control code 0200
        var i = stream.indexOf('0200', index);
        if (i == -1)
            throw Error("Data of the ref cannot be recognised: 0200");
        // Check if the control code is exactly the one we need
        var locationLength = utils_1.hex2dec(stream.substr(i + 4, 2));
        var controlPos = i + 6 + utils_1.lenPad(locationLength).length + (locationLength * 2);
        if (stream.substr(controlPos, 4) == '0E00') {
            return i;
        }
        index = i > index ? i : index;
    }
    throw Error("Data of the ref cannot be recognised: 0200");
    return -1;
}
function unmarshall(stream) {
    var cntr = headEnd(stream);
    var header = stream.substr(0, cntr);
    // Next 4 control code
    cntr += 4;
    // Next 2 location length
    var locationLength = utils_1.hex2dec(stream.substr(cntr, 2));
    cntr += 2;
    // Next locationLength as Location
    cntr += locationLength * 2;
    // Padding
    cntr += utils_1.lenPad(locationLength).length;
    // Next 4 control code
    if (stream.substr(cntr, 4) != '0E00')
        throw Error("Data of the ref cannot be recognised: 0E00");
    // Length of total name length blob, 2 padding
    cntr += 4;
    // length of name string, 2 padding
    var nameLength = utils_1.hex2dec(stream.substr(cntr, 2));
    cntr += 4;
    // Name length with each char with 2 padding
    cntr += nameLength * 2;
    // Next 4 control code
    if (stream.substr(cntr, 4) != '0F00')
        throw Error("Data of the ref cannot be recognised: 0F00");
    cntr += 4;
    // Length of total sytem name length blob, 2 padding
    cntr += 4;
    // length of system name string, 2 padding
    var systemNameLength = utils_1.hex2dec(stream.substr(cntr, 2));
    cntr += 4;
    // Name length with each char with 2 padding
    var systemName = utils_1.hex2ascii(stream.substr(cntr, systemNameLength * 4));
    cntr += systemNameLength * 4;
    // Next 4 control code
    if (stream.substr(cntr, 4) != '1200')
        throw Error("Data of the ref cannot be recognised: 1200");
    cntr += 4;
    // length of system name string
    locationLength = utils_1.hex2dec(stream.substr(cntr, 2));
    cntr += 2;
    // Name length with each char with 2 padding
    var location = utils_1.hex2ascii(stream.substr(cntr, locationLength * 2));
    cntr += locationLength * 2;
    cntr += locationLength % 2 == 0 ? 2 : 4;
    // Next 4 control code
    if (stream.substr(cntr, 4) != '1300')
        throw Error("Data of the ref cannot be recognised: 1300");
    var footer = stream.substr(cntr);
    return new FilerefData(header, systemName, location, footer);
}
exports.unmarshall = unmarshall;
function marshall(data) {
    // Starting 8 Padding, 4 total length, 6 unknown  
    var stream = data.getHeader();
    // Control Code
    stream += '0200';
    // length + 2, location with delminator :
    stream += utils_1.dec2hex(data.getLocation(':').length + 2);
    stream += utils_1.ascii2hex('/:' + data.getLocation(':'));
    stream += utils_1.lenPad(data.getLocation(':').length);
    // Control Code
    stream += '0E00';
    // length of the file name with padding and length header (12*2 + 2 = 26), 2 padding
    stream += utils_1.dec2hex((data.getFileName().length * 2) + 2) + '00';
    stream += utils_1.dec2hex(data.getFileName().length) + '00';
    stream += utils_1.ascii2hex(data.getFileName().split('').join('\0')) + '00';
    // Control Code
    stream += '0F00';
    // length of the system name with padding and length header (12*2 + 2 = 26), 2 padding
    stream += utils_1.dec2hex((data.getSystemName().length * 2) + 2) + '00';
    stream += utils_1.dec2hex(data.getSystemName().length) + '00';
    stream += utils_1.ascii2hex(data.getSystemName().split('').join('\0')) + '00';
    // Control Code
    stream += '1200';
    stream += utils_1.dec2hex(data.getLocation('/').length);
    stream += utils_1.ascii2hex(data.getLocation('/'));
    stream += utils_1.lenPad(data.getLocation('/').length);
    // Unknwon end
    stream += data.getFooter();
    // Total size update
    var lenStr = utils_1.dec2hex(stream.length / 2);
    stream = utils_1.replaceAt(stream, lenStr, 8);
    return stream;
}
exports.marshall = marshall;

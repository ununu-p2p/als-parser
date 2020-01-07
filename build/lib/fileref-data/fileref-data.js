"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var utils_1 = require("./utils");
var FilerefData = /** @class */ (function () {
    function FilerefData(systemName, location, format) {
        this.systemName = systemName;
        this.location = location;
        this.format = format;
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
    FilerefData.prototype.getFormat = function () {
        return this.format;
    };
    FilerefData.prototype.setLocation = function (location) {
        this.location = location;
    };
    return FilerefData;
}());
exports.FilerefData = FilerefData;
function unmarshall(stream) {
    // Leave the first 8 as padding
    var cntr = 8;
    // 8 to 12 as the total length, 2 padding  
    var totalLength = utils_1.hex2dec(stream.substr(cntr, 4));
    cntr += 6;
    // 14 to 20 Unknown
    cntr += 6;
    // 20 to 22 length of System Name
    var systemNameLength = utils_1.hex2dec(stream.substr(cntr, 2));
    cntr += 2;
    // Next 62 as System Name
    var systemName = utils_1.hex2ascii(stream.substr(cntr, systemNameLength * 2));
    cntr += 62;
    // Next 8 unknown
    cntr += 8;
    // Next 16 padding with FFFFFFFF
    cntr += 8;
    // 20 to 22 length of File Name
    var fileNameLength = utils_1.hex2dec(stream.substr(cntr, 2));
    cntr += 2;
    // Next 126 as System Name
    var fileName = utils_1.hex2ascii(stream.substr(cntr, fileNameLength * 2));
    cntr += 126;
    // Next 16 as padding FFFFFFFF00000000
    cntr += 16;
    // Next 8 file format
    var format = utils_1.hex2ascii(stream.substr(cntr, 8));
    cntr += 8;
    // Next 16 as padding FFFFFFFF00000000
    cntr += 16;
    // Next 38 unknown
    cntr += 38;
    // Next 2 dir name length
    var dirNameLength = utils_1.hex2dec(stream.substr(cntr, 2));
    cntr += 2;
    // Next dirNameLength as Directory Name
    var dirName = utils_1.hex2ascii(stream.substr(cntr, dirNameLength * 2));
    cntr += dirNameLength * 2;
    // Weird padding based on odd or even
    cntr += dirNameLength % 2 == 0 ? 2 : 4;
    // Next 4 unknown
    cntr += 4;
    // Next 2 location length
    var locationLength = utils_1.hex2dec(stream.substr(cntr, 2));
    cntr += 2;
    // Next locationLength as Location
    var locationRaw = utils_1.hex2ascii(stream.substr(cntr, locationLength * 2));
    cntr += locationLength * 2;
    var location = locationRaw.substr(2).split(':').join('/');
    return new FilerefData(systemName, location, format);
}
exports.unmarshall = unmarshall;
function marshall(data) {
    // Starting 8 Padding, 4 total length, 6 unknown  
    var stream = '00000000000000020000';
    // 1 size, 63 system name
    stream += utils_1.dec2hex(data.getSystemName().length);
    stream += utils_1.ascii2hex(data.getSystemName()).padEnd(62, '0');
    // Unknown 8, buffer 8
    stream += '42440001FFFFFFFF';
    // 1 size, 126 file name
    stream += utils_1.dec2hex(data.getFileName().length);
    stream += utils_1.ascii2hex(data.getFileName()).padEnd(126, '0');
    // 16 padding
    stream += 'FFFFFFFF00000000';
    // 8 fileformat
    stream += utils_1.ascii2hex(data.getFormat());
    // 16 padding
    stream += '00000000FFFFFFFF';
    // 38 Unknown
    stream += '00000A20637500000000000000000000000000';
    // 1 size, 63 dir name, weird padding based on length
    stream += utils_1.dec2hex(data.getDir().length);
    stream += utils_1.ascii2hex(data.getDir());
    stream += utils_1.lenPad(data.getDir().length);
    // Unknown 4
    stream += '0200';
    // length + 2, location with delminator :
    stream += utils_1.dec2hex(data.getLocation(':').length + 2);
    stream += utils_1.ascii2hex('/:' + data.getLocation(':'));
    stream += utils_1.lenPad(data.getLocation(':').length);
    // Unknown 4
    stream += '0E00';
    // length of the file name with padding and length header (12*2 + 2 = 26), 2 padding
    stream += utils_1.dec2hex((data.getFileName().length * 2) + 2) + '00';
    stream += utils_1.dec2hex(data.getFileName().length) + '00';
    stream += utils_1.ascii2hex(data.getFileName().split('').join('\0')) + '00';
    // Unknown 4
    stream += '0F00';
    // length of the system name with padding and length header (12*2 + 2 = 26), 2 padding
    stream += utils_1.dec2hex((data.getSystemName().length * 2) + 2) + '00';
    stream += utils_1.dec2hex(data.getSystemName().length) + '00';
    stream += utils_1.ascii2hex(data.getSystemName().split('').join('\0')) + '00';
    // Unknown 4
    stream += '1200';
    stream += utils_1.dec2hex(data.getLocation('/').length);
    stream += utils_1.ascii2hex(data.getLocation('/'));
    stream += utils_1.lenPad(data.getLocation('/').length);
    // Unknwon end
    stream += '1300012F00001500020015FFFF0000';
    var lenStr = utils_1.dec2hex(stream.length / 2);
    stream = utils_1.replaceAt(stream, lenStr, 8);
    return stream;
}
exports.marshall = marshall;

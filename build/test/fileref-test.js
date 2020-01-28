"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = __importDefault(require("chai"));
var chai_as_promised_1 = __importDefault(require("chai-as-promised"));
var utils_1 = require("../lib/fileref/utils");
var fileref_data_1 = require("../lib/fileref/fileref-data");
var path_1 = __importDefault(require("path"));
chai_1.default.use(chai_as_promised_1.default);
chai_1.default.should();
var expect = chai_1.default.expect;
var stream = "000000000140000200000C4D6163696E746F73682048440000000000000000000000000000000000\
000042440001FFFFFFFF086472756D2E616966000000000000000000000000000000000000000000\
00000000000000000000000000000000000000000000000000000000000000000000FFFFFFFF0000\
00000000000000000000FFFFFFFF00000A206375000000000000000000000000000164000002002F\
2F3A707269766174653A746D703A636F6D2E756E756E752E616C732D7061727365723A613A643A64\
72756D2E61696600000E00120008006400720075006D002E006100690066000F001A000C004D0061\
00630069006E0074006F007300680020004800440012002D707269766174652F746D702F636F6D2E\
756E756E752E616C732D7061727365722F612F642F6472756D2E61696600001300012F00FFFF0000";
var newStream = "000000000140000200000C4D6163696E746F73682048440000000000000000000000000000000000\
000042440001FFFFFFFF086472756D2E616966000000000000000000000000000000000000000000\
00000000000000000000000000000000000000000000000000000000000000000000FFFFFFFF0000\
00000000000000000000FFFFFFFF00000A206375000000000000000000000000000164000002002F\
2F3A707269766174653A746D703A636F6D2E756E756E752E616C732D7061727365723A623A643A64\
72756D2E61696600000E00120008006400720075006D002E006100690066000F001A000C004D0061\
00630069006E0074006F007300680020004800440012002D707269766174652F746D702F636F6D2E\
756E756E752E616C732D7061727365722F622F642F6472756D2E61696600001300012F00FFFF0000";
var header = "000000000140000200000C4D6163696E746F73682048440000000000000000000000000000000000\
000042440001FFFFFFFF086472756D2E616966000000000000000000000000000000000000000000\
00000000000000000000000000000000000000000000000000000000000000000000FFFFFFFF0000\
00000000000000000000FFFFFFFF00000A2063750000000000000000000000000001640000";
var footer = "1300012F00FFFF0000";
// TODO: Use a relative location as this location would not exist in every system.
var location = "a/d/drum.aif";
var newLocation = "b/d/drum.aif";
var systemName = "Macintosh HD";
var hex = "48656C6C6F20576F726C6421313233344023";
var ascii = "Hello World!1234@#";
// Test resource directory
var tmpDir = "private/tmp/com.ununu.als-parser/";
describe('Fileref', function () {
    describe('Utils', function () {
        it('Hex to Ascii', function () {
            utils_1.hex2ascii(hex).should.equal(ascii);
        });
        it('Ascii to Hex', function () {
            utils_1.ascii2hex(ascii).should.equal(hex);
        });
    });
    describe('Parsing', function () {
        it('Unmarshall when data stream is given', function () {
            var data = fileref_data_1.unmarshall(stream);
            data.getLocation('/').should.equal(path_1.default.join(tmpDir, location));
            data.getSystemName().should.equal(systemName);
            data.getHeader().should.equal(header);
            data.getFooter().should.equal(footer);
        });
        it('Marshall when location, systemName, and format is given', function () {
            var data = new fileref_data_1.FilerefData(header, systemName, path_1.default.join(tmpDir, location), footer);
            fileref_data_1.marshall(data).should.equal(stream);
        });
        it('Change Location when stream is given', function () {
            var data = fileref_data_1.unmarshall(stream);
            data.setLocation(path_1.default.join('/', tmpDir, newLocation));
            fileref_data_1.marshall(data).should.equal(newStream);
        });
    });
});

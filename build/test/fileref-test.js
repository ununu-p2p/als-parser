"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = __importDefault(require("chai"));
var chai_as_promised_1 = __importDefault(require("chai-as-promised"));
var utils_1 = require("../lib/fileref/utils");
var fileref_data_1 = require("../lib/fileref/fileref-data");
var fileref_1 = require("../lib/fileref/fileref");
var xml_1 = require("../lib/reader/xml");
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
describe('FilerefData', function () {
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
describe('Fileref', function () {
    beforeEach(function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, xml_1.loadXml('./test/res/fileref-original.xml')];
                    case 1:
                        _a.originalRef = (_c.sent()).FileRef;
                        _b = this;
                        return [4 /*yield*/, xml_1.loadXml('./test/res/fileref-expected.xml')];
                    case 2:
                        _b.expectedRef = (_c.sent()).FileRef;
                        return [2 /*return*/];
                }
            });
        });
    });
    describe('Change Location', function () {
        it('Change Location when internal resource is given', function () {
            var originalRef = new fileref_1.Fileref(this.originalRef);
            var expectedRef = new fileref_1.Fileref(this.expectedRef);
            originalRef.changeLocation('resource', '/Users/shresthagrawal/Desktop/work/ununu/sample-project/tom3 Project/tom3.als', true);
            originalRef.fileref.LivePackName.should.deep.equal(expectedRef.fileref.LivePackName);
            originalRef.fileref.LivePackId.should.deep.equal(expectedRef.fileref.LivePackId);
            originalRef.fileref.RelativePathType.should.deep.equal(expectedRef.fileref.RelativePathType);
        });
    });
});

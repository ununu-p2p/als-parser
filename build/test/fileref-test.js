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
chai_1.default.use(chai_as_promised_1.default);
chai_1.default.should();
var expect = chai_1.default.expect;
var stream = "00000000015E000200000C4D6163696E746F73682048440000000000\
000000000000000000000000000042440001FFFFFFFF113030303120\
32302D417564696F2E61696600000000000000000000000000000000\
00000000000000000000000000000000000000000000000000000000\
0000FFFFFFFF000000004149464600000000FFFFFFFF00000A206375\
00000000000000000000000000074465736B746F7000000200302F3A\
55736572733A736872657374686167726177616C3A4465736B746F70\
3A303030312032302D417564696F2E616966000E0024001100300030\
00300031002000320030002D0041007500640069006F002E00610069\
0066000F001A000C004D006100630069006E0074006F007300680020\
004800440012002E55736572732F736872657374686167726177616C\
2F4465736B746F702F303030312032302D417564696F2E6169660013\
00012F00001500020015FFFF0000";
var newStream = "000000000172000200000C4D6163696E746F73682048440000000000000000000000000000000000\
000042440001FFFFFFFF11303030312032302D417564696F2E616966000000000000000000000000\
00000000000000000000000000000000000000000000000000000000000000000000FFFFFFFF0000\
00004149464600000000FFFFFFFF00000A20637500000000000000000000000000074465736B746F\
70000002003A2F3A55736572733A736872657374686167726177616C3A4465736B746F703A613A44\
65736B746F703A303030312032302D417564696F2E616966000E0024001100300030003000310020\
00320030002D0041007500640069006F002E006100690066000F001A000C004D006100630069006E\
0074006F007300680020004800440012003855736572732F736872657374686167726177616C2F44\
65736B746F702F612F4465736B746F702F303030312032302D417564696F2E616966001300012F00\
001500020015FFFF0000";
var header = "00000000015E000200000C4D6163696E746F73682048440000000000\
000000000000000000000000000042440001FFFFFFFF113030303120\
32302D417564696F2E61696600000000000000000000000000000000\
00000000000000000000000000000000000000000000000000000000\
0000FFFFFFFF000000004149464600000000FFFFFFFF00000A206375\
00000000000000000000000000074465736B746F700000";
var footer = "1300012F00001500020015FFFF0000";
var location = "Users/shresthagrawal/Desktop/0001 20-Audio.aif";
var newLocation = "Users/shresthagrawal/Desktop/a/Desktop/0001 20-Audio.aif";
var systemName = "Macintosh HD";
var hex = "48656C6C6F20576F726C6421313233344023";
var ascii = "Hello World!1234@#";
// Test resource directory
var resDir = "./test/res";
// Sample file relative path to res dir
var sampleXml = "sample-project/extracted.xml";
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
            data.getLocation('/').should.equal(location);
            data.getSystemName().should.equal(systemName);
            data.getHeader().should.equal(header);
            data.getFooter().should.equal(footer);
        });
        it('Marshall when location, systemName, and format is given', function () {
            var data = new fileref_data_1.FilerefData(header, systemName, location, footer);
            fileref_data_1.marshall(data).should.equal(stream);
        });
        it('Change Location when stream is given', function () {
            var data = fileref_data_1.unmarshall(stream);
            data.setLocation(newLocation);
            fileref_data_1.marshall(data).should.equal(newStream);
        });
    });
    describe('FilerefXml', function () {
        it('Change location when fileref Object is given', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/];
                });
            });
        });
    });
});

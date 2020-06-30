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
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var chai_1 = __importDefault(require("chai"));
var chai_as_promised_1 = __importDefault(require("chai-as-promised"));
var memfs_1 = require("memfs");
var fs_monkey_1 = require("fs-monkey");
var memory_fs_1 = require("../lib/memory-fs");
var lib_1 = require("../lib");
var xml_1 = require("../lib/reader/xml");
chai_1.default.use(chai_as_promised_1.default);
chai_1.default.should();
var expect = chai_1.default.expect;
// Test resource directory
var resDir = "./test/res";
// Tmp directory created as an exact copy of the res directory before test
var tmp = "/private/tmp/com.ununu.als-parser";
var tmpDir = "/private/tmp/com.ununu.als-parser/dir0";
var tmpDir2 = "/private/tmp/com.ununu.als-parser/dir1";
// Sample file relative path to res dir
var projectDir = "project/a Project/";
var sampleAls = "a.als";
var sampleXml = "a.xml";
// Resource List
var resources = [
    "../../a/d/drum.aif",
    "../../a/d/audio.aif",
];
var resourcesInternal = [
    "../../a/d/drum.aif",
    "../../a/d/audio.aif",
    "Devices/Audio Effects/Simple Delay/Dotted Eighth Note.adv"
];
var recordedResources = [
    "Samples/Recorded/1-Audio 0001 [2020-06-26 114704].aif",
];
var modifiedResource = [
    "../b/d/drum.aif",
    "../b/d/audio.aif",
];
describe("Parser", function () {
    describe("Parse File", function () {
        // TODO: Put proper analytics to check how slow?
        this.slow(100);
        beforeEach(function () {
            return __awaiter(this, void 0, void 0, function () {
                var mockVolume, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            mockVolume = new memfs_1.Volume();
                            memory_fs_1.mountDirectory(mockVolume, path_1.default.join(__dirname, "res"), {
                                dest: tmp,
                                recursively: true
                            });
                            mockVolume.mkdirpSync("/foo");
                            mockVolume.writeFileSync("/foo/project.als", fs_1.default.readFileSync(path_1.default.join(__dirname, "res/project/a Project/a.als")));
                            /* FIXME: this is a very bad practice – pseudo-mounting some of our
                             * dependencies. however, as xml2js and xmlbuilder are fundamentally
                             * flawed node modules, they load modules during runtime and require
                             * a real-mounted fs
                             */
                            memory_fs_1.mountDirectory(mockVolume, path_1.default.join(__dirname, "../node_modules/xmlbuilder/lib"));
                            this.unpatch = fs_monkey_1.patchFs(mockVolume);
                            _a = this;
                            return [4 /*yield*/, xml_1.loadXml(path_1.default.join(tmp, projectDir, sampleXml))];
                        case 1:
                            _a.expectedXml = _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
        afterEach(function () {
            if (this.unpatch) {
                this.unpatch();
            }
        });
        it("Load when als project file is given", function () {
            return __awaiter(this, void 0, void 0, function () {
                var parser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, lib_1.parseFile("/foo/project.als")];
                        case 1:
                            parser = _a.sent();
                            parser.reader.xmlJs.should.eql(this.expectedXml);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("Get tracks count when als project file is given", function () {
            return __awaiter(this, void 0, void 0, function () {
                var parser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, lib_1.parseFile("/foo/project.als")];
                        case 1:
                            parser = _a.sent();
                            parser.getTracksCount().should.eql({
                                AudioTrack: 2,
                                ReturnTrack: 2
                            });
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe("Resource", function () {
        beforeEach(function () {
            return __awaiter(this, void 0, void 0, function () {
                var mockVolume;
                return __generator(this, function (_a) {
                    mockVolume = new memfs_1.Volume();
                    memory_fs_1.mountDirectory(mockVolume, path_1.default.join(__dirname, "res/a/d"), {
                        dest: path_1.default.join(tmp, "/a/d")
                    });
                    memory_fs_1.mountDirectory(mockVolume, path_1.default.join(__dirname, "res/a/d"), {
                        dest: path_1.default.join(tmp, "/b/d")
                    });
                    memory_fs_1.mountFile(mockVolume, path_1.default.join(__dirname, "res/project/a Project/a.als"), "/foo/project.als");
                    // FIXME: same as above
                    memory_fs_1.mountDirectory(mockVolume, path_1.default.join(__dirname, "../node_modules/xmlbuilder/lib"));
                    this.unpatch = fs_monkey_1.patchFs(mockVolume);
                    return [2 /*return*/];
                });
            });
        });
        afterEach(function () {
            if (this.unpatch) {
                this.unpatch();
            }
        });
        it("Get the list of resourcefiles when als project file is given", function () {
            return __awaiter(this, void 0, void 0, function () {
                var parser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, lib_1.parseFile("/foo/project.als")];
                        case 1:
                            parser = _a.sent();
                            parser.getResourceLocations().should.eql(resources);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("Get the list of resourcefiles including internal when als project file is given", function () {
            return __awaiter(this, void 0, void 0, function () {
                var parser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, lib_1.parseFile("/foo/project.als")];
                        case 1:
                            parser = _a.sent();
                            parser.getResourceLocations(true).should.eql(resourcesInternal);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("Change location of all resourcefiles when als project file is given", function () {
            return __awaiter(this, void 0, void 0, function () {
                var newLocation, parser, secondParser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            newLocation = "/b/d";
                            return [4 /*yield*/, lib_1.parseFile("/foo/project.als")];
                        case 1:
                            parser = _a.sent();
                            parser.changeResourceLocations(newLocation, undefined, undefined, true);
                            return [4 /*yield*/, lib_1.parseFile("/foo/project.als")];
                        case 2:
                            secondParser = _a.sent();
                            secondParser.getResourceLocations().should.eql(modifiedResource);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe("Recorded", function () {
        beforeEach(function () {
            return __awaiter(this, void 0, void 0, function () {
                var mockVolume;
                return __generator(this, function (_a) {
                    mockVolume = new memfs_1.Volume();
                    memory_fs_1.mountDirectory(mockVolume, path_1.default.join(__dirname, "res/recorded-audio"), {
                        dest: path_1.default.join(tmp, "/recorded-audio")
                    });
                    memory_fs_1.mountDirectory(mockVolume, path_1.default.join(__dirname, "res/drums"), {
                        dest: path_1.default.join(tmp, "/drums")
                    });
                    memory_fs_1.mountDirectory(mockVolume, path_1.default.join(__dirname, "res/drums-midi"), {
                        dest: path_1.default.join(tmp, "/drums-midi")
                    });
                    this.unpatch = fs_monkey_1.patchFs(mockVolume);
                    return [2 /*return*/];
                });
            });
        });
        afterEach(function () {
            if (this.unpatch) {
                this.unpatch();
            }
        });
        it("Get the list of resourcefiles when als project with recorded audio is given", function () {
            return __awaiter(this, void 0, void 0, function () {
                var projectFile, parser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            projectFile = path_1.default.join(tmp, "/recorded-audio/recorded-audio.als");
                            return [4 /*yield*/, lib_1.parseFile(projectFile)];
                        case 1:
                            parser = _a.sent();
                            parser.getResourceLocations().should.eql(recordedResources);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("Get the list of resourcefiles when als project with recorded drums is given", function () {
            return __awaiter(this, void 0, void 0, function () {
                var projectFile, parser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            projectFile = path_1.default.join(tmp, "/drums/drums.als");
                            return [4 /*yield*/, lib_1.parseFile(projectFile)];
                        case 1:
                            parser = _a.sent();
                            parser.getResourceLocations().should.eql([]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("Get the list of resourcefiles when als project with drums midi is given", function () {
            return __awaiter(this, void 0, void 0, function () {
                var projectFile, parser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            projectFile = path_1.default.join(tmp, "/drums-midi/drums-midi.als");
                            return [4 /*yield*/, lib_1.parseFile(projectFile)];
                        case 1:
                            parser = _a.sent();
                            parser.getResourceLocations().should.eql([]);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
});

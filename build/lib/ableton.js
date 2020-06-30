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
Object.defineProperty(exports, "__esModule", { value: true });
var reader_1 = require("./reader/reader");
var fileref_1 = require("./fileref/fileref");
var utils_1 = require("./utils");
var defaultTracks = ['Reverb Default.adv'];
var AbletonParser = /** @class */ (function () {
    function AbletonParser(file) {
        this.file = file;
    }
    AbletonParser.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.reader = new reader_1.Reader(this.file);
                        return [4 /*yield*/, this.reader.load()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AbletonParser.prototype.getTracks = function () {
        return this.reader.xmlJs.Ableton.LiveSet[0].Tracks;
    };
    AbletonParser.prototype.getTracksCount = function () {
        var rawTracks = this.reader.xmlJs.Ableton.LiveSet[0].Tracks[0];
        var trackCount = new Object();
        for (var trackGroup in rawTracks) {
            trackCount[trackGroup] = rawTracks[trackGroup].length;
        }
        return trackCount;
    };
    AbletonParser.prototype.getResourceLocations = function (internal) {
        if (internal === void 0) { internal = false; }
        var resList = new Set();
        utils_1.deepRecurrsion(this.reader.xmlJs, 'FileRef', this.appendResourceList, resList, internal);
        return Array.from(resList);
    };
    AbletonParser.prototype.getFilerefs = function () {
        var resList = new Set();
        utils_1.deepRecurrsion(this.reader.xmlJs, 'FileRef', this.appendReferenceList, resList);
        return Array.from(resList);
    };
    AbletonParser.prototype.appendReferenceList = function (obj, resList) {
        resList.add(obj[0]);
    };
    AbletonParser.prototype.appendResourceList = function (obj, resList, internal) {
        if (internal === void 0) { internal = false; }
        var fileref = new fileref_1.Fileref(obj[0]);
        var fileName = fileref.getFileName();
        if (fileName != '' && !defaultTracks.includes(fileName)) {
            if (!fileref.isInternal || internal) {
                resList.add(fileref.getRelativeLocation());
            }
        }
    };
    AbletonParser.prototype.changeResourceLocations = function (location, internal, useData, overideFileCheck) {
        if (internal === void 0) { internal = false; }
        if (useData === void 0) { useData = false; }
        if (overideFileCheck === void 0) { overideFileCheck = false; }
        // Modify the XmlJ
        utils_1.deepRecurrsion(this.reader.xmlJs, 'FileRef', this.changeLocation, location, this.file, internal, useData, overideFileCheck);
        // Save the Modified reader.xmlJs
        this.reader.save(this.file);
    };
    AbletonParser.prototype.changeLocation = function (obj, resourceFolder, project, internal, useData, overideFileCheck) {
        if (internal === void 0) { internal = false; }
        if (useData === void 0) { useData = false; }
        if (overideFileCheck === void 0) { overideFileCheck = false; }
        var fileref = new fileref_1.Fileref(obj[0], useData);
        var fileName = fileref.getFileName();
        if (fileref.getFileName() != '' && !defaultTracks.includes(fileName)) {
            if (!fileref.isInternal || internal) {
                fileref.changeLocation(resourceFolder, project, overideFileCheck);
            }
        }
    };
    return AbletonParser;
}());
exports.AbletonParser = AbletonParser;

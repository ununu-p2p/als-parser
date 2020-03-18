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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var zlib_1 = __importDefault(require("zlib"));
var file_type_1 = __importDefault(require("file-type"));
function copyFileAsync(src, dst) {
    return new Promise(function (resolve, reject) {
        fs_1.default.copyFile(src, dst, function (err) {
            if (err)
                reject(err);
            resolve();
        });
    });
}
exports.copyFileAsync = copyFileAsync;
function gunzipInMemory(fileName) {
    var _this = this;
    if (!fileExists(fileName)) {
        throw new Error('Invalid File Doesnt Exist');
    }
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        var src, tmp, chunks, tmp_1, tmp_1_1, chunk, e_1_1, buffer, err_1;
        var e_1, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 13, , 14]);
                    src = fs_1.default.createReadStream(fileName);
                    tmp = src.pipe(zlib_1.default.createGunzip());
                    chunks = [];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 12]);
                    tmp_1 = __asyncValues(tmp);
                    _b.label = 2;
                case 2: return [4 /*yield*/, tmp_1.next()];
                case 3:
                    if (!(tmp_1_1 = _b.sent(), !tmp_1_1.done)) return [3 /*break*/, 5];
                    chunk = tmp_1_1.value;
                    chunks.push(chunk);
                    _b.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _b.trys.push([7, , 10, 11]);
                    if (!(tmp_1_1 && !tmp_1_1.done && (_a = tmp_1.return))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _a.call(tmp_1)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12:
                    src.destroy();
                    buffer = Buffer.concat(chunks);
                    fs_1.default.writeFile(fileName, buffer, function (err) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve();
                        }
                    });
                    return [3 /*break*/, 14];
                case 13:
                    err_1 = _b.sent();
                    reject(err_1);
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    }); });
}
exports.gunzipInMemory = gunzipInMemory;
// checks whether a fileName exists
function fileExists(file) {
    try {
        return fs_1.default.statSync(file).isFile();
    }
    catch (err) {
        return false;
    }
}
exports.fileExists = fileExists;
function readFileAsync(file) {
    return new Promise(function (resolve, reject) {
        fs_1.default.readFile(file, function (err, data) {
            if (err)
                reject(err);
            resolve(data);
        });
    });
}
exports.readFileAsync = readFileAsync;
function writeFileAsync(file, data) {
    return new Promise(function (resolve, reject) {
        fs_1.default.writeFile(file, data, function (err) {
            if (err)
                reject(err);
            resolve();
        });
    });
}
exports.writeFileAsync = writeFileAsync;
function getType(file) {
    return file_type_1.default.fromFile(file);
}
exports.getType = getType;
function changeExt(file, newExt) {
    var parsePath = path_1.default.parse(file);
    parsePath.ext = newExt;
    parsePath.base =
        parsePath.base.substring(0, parsePath.base.lastIndexOf(".")) + newExt;
    return path_1.default.format(parsePath);
}
exports.changeExt = changeExt;

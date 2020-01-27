"use strict";
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
function extractGz(src, dst) {
    // check if src file exists
    if (!fileExists(src)) {
        throw new Error('Invalid File Doesnt Exist');
    }
    return new Promise(function (resolve, reject) {
        try {
            // prepare streams
            var source = fs_1.default.createReadStream(src);
            var destination = fs_1.default.createWriteStream(dst);
            // extract the archive
            source.pipe(zlib_1.default.createGunzip()).pipe(destination);
            // callback on extract completion
            destination.on('close', resolve);
        }
        catch (err) {
            reject(err);
        }
    });
}
exports.extractGz = extractGz;
// checks whether a file exists
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
    parsePath.base = parsePath.base.substring(0, parsePath.base.lastIndexOf(".")) + newExt;
    return path_1.default.format(parsePath);
}
exports.changeExt = changeExt;

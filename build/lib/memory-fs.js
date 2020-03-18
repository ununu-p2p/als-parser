"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
function mountDirectory(volume, src, opts) {
    if (opts === void 0) { opts = {}; }
    var dest = opts.dest || src;
    var recursively = opts.recursively || false;
    volume.mkdirpSync(dest);
    for (var _i = 0, _a = fs_1.default.readdirSync(src); _i < _a.length; _i++) {
        var file = _a[_i];
        var filePath = path_1.default.join(src, file);
        if (fs_1.default.statSync(filePath).isFile()) {
            var buf = fs_1.default.readFileSync(filePath);
            volume.writeFileSync(path_1.default.join(dest, file), buf);
        }
        else if (recursively && fs_1.default.statSync(filePath).isDirectory()) {
            mountDirectory(volume, filePath, {
                dest: path_1.default.join(dest, file),
                recursively: true
            });
        }
    }
}
exports.mountDirectory = mountDirectory;
function mountFile(volume, src, dest) {
    dest = dest ? dest : src;
    var destDir = path_1.default.parse(dest).dir;
    volume.mkdirpSync(destDir);
    var buf = fs_1.default.readFileSync(src);
    volume.writeFileSync(dest, buf);
}
exports.mountFile = mountFile;

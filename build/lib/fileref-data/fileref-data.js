"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileRefData = /** @class */ (function () {
    function FileRefData(systemName, location, format) {
        this.systemName = systemName;
        this.location = location;
        this.format = format;
    }
    FileRefData.prototype.getFileName = function () {
    };
    return FileRefData;
}());
exports.FileRefData = FileRefData;
// 0x00000000 (4 hex 0 padding) 
// 350 0x00  (Length of the whole payload in 2 hex, 1 hex padding)
//  0x0000 (?)
// 12 (1 hex,  length of 'Hacintosh HD', 12 in hex)
// Macintosh HD (System name, max 26 hex char, with 0 padding)
// BD 0x00 (?)
//  (?)
// 0xFFFFFFFF (?)
// 17 (1 hex, length of '0001 20-Audio.aif')
// 0001 20-Audio.aif (File name, 63 bit max, with 0 padding)
// 0xFFFFFFFF (?)
// 0x00000000 AIFF 0x00000000 (file format of 24 bit len)
// 0xFFFFFFFF (?)
// 0x0000 (?)
// 0x0A20 cu 0x00000000000000000000000000 (?) 
// 7 (1 hex value for length of 'Desktop')
// Desktop 0x0000 (final destination folder, with 2 hex padding)
//  0x00 (?)
// 48 (length of the below location (delminator :), 1 hex)
// /:Users:shresthagrawal:Desktop:0001 20-Audio.aif 00 (file loc, with 2 hex padding, if length of file loc is odd and 1 in vicevera)
// 0x0E00 (?)
// 36 0x00 (length of the file with padding and lenngth header (17*2 + 2 = 36), 1 hex padding)
// 17 0x00 (1 hex, length of '0001 20-Audio.aif', with 1 hex padding)
// 0001 20-Audio.aif (file name, with one hex padding after every char eg. 1A000300..)
// 0x0F00 (?)
// 26 0x00 (length of the system name with padding and length header (12*2 + 2 = 26), 1 hex padding)
// 12 0x00 (length of the System Name, with 1 hex padding)
// Macintosh HD (System Name, with one hex padding after every char eg. 1A003100..)
//  0x00
// 46 (length of file location, (delminator /), 1 hex)
// Users/shresthagrawal/Desktop/0001 20-Audio.aif (file loc, with 2 hex padding, if length of file loc is odd and 1 in vicevera)
//  0x00
// / 0x0000
//  0x00 
//  0x00
// 
// 0xFFFF0000

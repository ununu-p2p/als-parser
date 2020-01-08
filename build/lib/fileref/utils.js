"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ascii2hex(str) {
    var hex = '';
    for (var _i = 0, str_1 = str; _i < str_1.length; _i++) {
        var char = str_1[_i];
        var res = char.charCodeAt(0).toString(16);
        hex += res == '0' ? '00' : res;
    }
    return hex.toUpperCase();
}
exports.ascii2hex = ascii2hex;
function hex2ascii(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2) {
        var val = parseInt(hex.substr(i, 2), 16);
        if (val != 0)
            str += String.fromCharCode(val);
    }
    return str;
}
exports.hex2ascii = hex2ascii;
function hex2dec(hex) {
    return parseInt(hex, 16);
}
exports.hex2dec = hex2dec;
function dec2hex(dec) {
    var hex = dec.toString(16).toUpperCase();
    if (hex.length % 2 == 1)
        return '0' + hex;
    else
        return hex;
}
exports.dec2hex = dec2hex;
function lenPad(len) {
    return len % 2 == 0 ? '00' : '0000';
}
exports.lenPad = lenPad;
function replaceAt(str, rep, index) {
    var arr = str.split('');
    for (var i = 0; i < rep.length; i++) {
        arr[index + i] = rep[i];
    }
    return arr.join('');
}
exports.replaceAt = replaceAt;

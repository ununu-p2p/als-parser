"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
function deepRecurrsion(obj, key, callback) {
    var params = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        params[_i - 3] = arguments[_i];
    }
    for (var k in obj) {
        //BaseCase
        if (k == key)
            callback.apply(void 0, __spreadArrays([obj[k]], params));
        // RecurrsiveCase
        else if (typeof obj[k] == "object" && obj[k] !== null)
            deepRecurrsion.apply(void 0, __spreadArrays([obj[k], key, callback], params));
    }
}
exports.deepRecurrsion = deepRecurrsion;

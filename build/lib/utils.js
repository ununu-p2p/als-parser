"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function deepRecurrsion(obj, key, callback, params) {
    for (var k in obj) {
        //BaseCase
        if (k == key)
            callback(obj[k], params);
        // RecurrsiveCase
        else if (typeof obj[k] == "object" && obj[k] !== null)
            deepRecurrsion(obj[k], key, callback, params);
    }
}
exports.deepRecurrsion = deepRecurrsion;

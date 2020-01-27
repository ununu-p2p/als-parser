export function deepRecurrsion(obj: any, key: string, callback: any, ...params: any[]) {
    for (var k in obj)
    {
        //BaseCase
        if (k == key) callback(obj[k], ...params);
        // RecurrsiveCase
        else if (typeof obj[k] == "object" && obj[k] !== null) deepRecurrsion(obj[k], key, callback, ...params);
    }
}
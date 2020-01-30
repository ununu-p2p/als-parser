import fs from "fs";
import path from "path";
import zlib from "zlib";
import fileType from "file-type";
import ReadableStream = NodeJS.ReadableStream;
import WritableStream = NodeJS.WritableStream;

export function copyFileAsync(src: string, dst: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.copyFile(src, dst, err => {
      if (err) reject(err);
      resolve();
    });
  });
}

export function gunzipInMemory(fileName: string): Promise<void> {
  if (!fileExists(fileName)) {
    throw new Error(
        'Invalid File Doesnt Exist'
    );
  }
  
  return new Promise(async (resolve, reject) => {
    try {
      const src = fs.createReadStream(fileName);
      const tmp = src.pipe(zlib.createGunzip());
      const chunks = [];

      // read from gunzip stream into memory
      for await (const chunk of tmp) {
        chunks.push(chunk);
      }
      src.destroy();

      // create buffer from chunks, write to file
      const buffer = Buffer.concat(chunks);
      fs.writeFile(fileName, buffer, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

// checks whether a fileName exists
export function fileExists(file: string): boolean {
  try {
    return fs.statSync(file).isFile();
  } catch (err) {
    return false;
  }
}

export function readFileAsync(file: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(file, function(err, data) {
      if (err) reject(err);
      resolve(data);
    });
  });
}

export function writeFileAsync(file: string, data: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, function(err) {
      if (err) reject(err);
      resolve();
    });
  });
}

export function getType(file: string) {
  return fileType.fromFile(file);
}

export function changeExt(file: string, newExt: string) {
  var parsePath = path.parse(file);
  parsePath.ext = newExt;
  parsePath.base =
    parsePath.base.substring(0, parsePath.base.lastIndexOf(".")) + newExt;
  return path.format(parsePath);
}

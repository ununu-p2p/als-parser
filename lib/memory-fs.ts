import fs from "fs";
import path from "path";

type MountOpts = {
  dest?: string;
  recursively?: boolean;
};

export function mountDirectory(volume: any, src: string, opts: MountOpts = {}) {
  const dest = opts.dest || src;
  const recursively = opts.recursively || false;

  volume.mkdirpSync(dest);
  for (const file of fs.readdirSync(src)) {
    const filePath = path.join(src, file);

    if (fs.statSync(filePath).isFile()) {
      const buf = fs.readFileSync(filePath);
      volume.writeFileSync(path.join(dest, file), buf);
    } else if (recursively && fs.statSync(filePath).isDirectory()) {
      mountDirectory(volume, filePath, {
        dest: path.join(dest, file),
        recursively: true
      });
    }
  }
}

export function mountFile(volume: any, src: string, dest?: string) {
  dest = dest ? dest : src;
  const destDir = path.parse(dest).dir;

  volume.mkdirpSync(destDir);

  const buf = fs.readFileSync(src);
  volume.writeFileSync(dest, buf);
}

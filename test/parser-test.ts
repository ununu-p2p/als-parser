import fs from "fs";
import path from "path";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { copySync, remove } from "fs-extra";
import { Volume } from "memfs";
import { patchFs } from "fs-monkey";

import { parseFile } from "../lib";
import { loadXml } from "../lib/reader/xml";
import { copyFileAsync } from "../lib/reader/utils";

chai.use(chaiAsPromised);
chai.should();
const expect = chai.expect;

// Test resource directory
const resDir = "./test/res";
// Tmp directory created as an exact copy of the res directory before test
const tmpDir = "/private/tmp/com.ununu.als-parser/dir0";
const tmpDir2 = "/private/tmp/com.ununu.als-parser/dir1";

// Sample file relative path to res dir
const projectDir = "project/a Project/";
const sampleAls = "a.als";
const sampleXml = "a.xml";

// Resource List
const resources = [
  "/private/tmp/com.ununu.als-parser/a/d/drum.aif",
  "/private/tmp/com.ununu.als-parser/a/d/audio.aif",
  "/Users/ama/Downloads/Reverb Default.adv",
  "/Users/mak/Library/Application Support/Ableton/Live 10 Core Library/Devices/Audio Effects/Simple Delay/Dotted Eighth Note.adv"
];

const modifiedResource = [
  "/private/tmp/com.ununu.als-parser/b/d/drum.aif",
  "/private/tmp/com.ununu.als-parser/b/d/audio.aif",
  "/Users/ama/Downloads/Reverb Default.adv",
  "/Users/mak/Library/Application Support/Ableton/Live 10 Core Library/Devices/Audio Effects/Simple Delay/Dotted Eighth Note.adv"
];

function mountDirectory(volume: any, dir: string) {
  volume.mkdirpSync(dir);
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);

    if (fs.statSync(filePath).isFile()) {
      const buf = fs.readFileSync(filePath);
      volume.writeFileSync(filePath, buf);
    }
  }
}

describe("Parser", function() {
  describe("Parse File", function() {
    // TODO: Put proper analytics to check how slow?
    this.slow(100);
    before(async function() {
      // Create a copy of the sample files.
      // This is important as the parser modifies the origional file.
      copySync(resDir, tmpDir);
      this.expectedXml = await loadXml(
        path.join(tmpDir, projectDir, sampleXml)
      );
    });

    it("Load when als project file is given", async function() {
      let parser = await parseFile(path.join(tmpDir, projectDir, sampleAls));
      parser.reader.xmlJs.should.eql(this.expectedXml);
    });

    it("Get tracks count when als project file is given", async function() {
      let parser = await parseFile(path.join(tmpDir, projectDir, sampleAls));
      parser.getTracksCount().should.eql({
        AudioTrack: 2,
        ReturnTrack: 2
      });
    });

    after(function() {
      // Cleanup after test
      remove(tmpDir);
    });
  });

  describe("Resource", function() {
    before(function() {
      this.unpatch = () => {};

      this.drumSample = fs.readFileSync(
        path.join(__dirname, "res/a/d/drum.aif")
      );
      this.audioSample = fs.readFileSync(
        path.join(__dirname, "res/a/d/audio.aif")
      );
      this.projectFile = fs.readFileSync(
        path.join(__dirname, "res/project/a Project/a.als")
      );
    });

    beforeEach(async function() {
      const tmp = "/private/tmp/com.ununu.als-parser";
      const mockVolume = new Volume();

      mockVolume.mkdirpSync(`${tmp}/a/d`);
      mockVolume.mkdirpSync(`${tmp}/b/d`);
      mockVolume.mkdirpSync(`/foo`);

      mockVolume.writeFileSync(`${tmp}/a/d/audio.aif`, this.audioSample);
      mockVolume.writeFileSync(`${tmp}/a/d/drum.aif`, this.drumSample);

      mockVolume.writeFileSync(`${tmp}/b/d/audio.aif`, this.audioSample);
      mockVolume.writeFileSync(`${tmp}/b/d/drum.aif`, this.drumSample);

      mockVolume.writeFileSync("/foo/project.als", this.projectFile);

      /* FIXME: this is a very bad practice – pseudo-mounting some of our
       * dependencies. however, as xml2js and xmlbuilder are fundamentally
       * flawed node modules, they load modules during runtime and require
       * a real-mounted fs
       */
      mountDirectory(
        mockVolume,
        path.join(__dirname, "../node_modules/xmlbuilder/lib")
      );

      this.unpatch = patchFs(mockVolume);
    });

    afterEach(function() {
      this.unpatch();
    });

    it("Get the list of resourcefiles when als project file is given", async function() {
      const parser = await parseFile("/foo/project.als");
      parser.getResourceLocations().should.eql(resources);
    });
    it("Change location of all resourcefiles when als project file is given", async function() {
      const newLocation = "/private/tmp/com.ununu.als-parser/b/d/";

      const parser = await parseFile("/foo/project.als");
      parser.changeResourceLocations(newLocation);

      const secondParser = await parseFile(path.join("/foo/project.als"));
      secondParser.getResourceLocations().should.eql(modifiedResource);
    });
  });
});

import fs from "fs";
import path from "path";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { Volume } from "memfs";
import { patchFs } from "fs-monkey";
import { mountDirectory, mountFile } from "../lib/memory-fs";

import { parseFile } from "../lib";
import { loadXml } from "../lib/reader/xml";

chai.use(chaiAsPromised);
chai.should();
const expect = chai.expect;

// Test resource directory
const resDir = "./test/res";
// Tmp directory created as an exact copy of the res directory before test
const tmp = "/private/tmp/com.ununu.als-parser";
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

describe("Parser", function() {
  describe("Parse File", function() {
    // TODO: Put proper analytics to check how slow?
    this.slow(100);

    beforeEach(async function() {
      const mockVolume = new Volume();

      mountDirectory(mockVolume, path.join(__dirname, "res"), {
        dest: tmp,
        recursively: true
      });

      mockVolume.mkdirpSync(`/foo`);
      mockVolume.writeFileSync(
        "/foo/project.als",
        fs.readFileSync(path.join(__dirname, "res/project/a Project/a.als"))
      );

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

      this.expectedXml = await loadXml(path.join(tmp, projectDir, sampleXml));
    });

    afterEach(function() {
      if (this.unpatch) {
        this.unpatch();
      }
    });

    it("Load when als project file is given", async function() {
      let parser = await parseFile("/foo/project.als");
      parser.reader.xmlJs.should.eql(this.expectedXml);
    });

    it("Get tracks count when als project file is given", async function() {
      let parser = await parseFile("/foo/project.als");
      parser.getTracksCount().should.eql({
        AudioTrack: 2,
        ReturnTrack: 2
      });
    });
  });

  describe("Resource", function() {
    beforeEach(async function() {
      const mockVolume = new Volume();

      mountDirectory(mockVolume, path.join(__dirname, "res/a/d"), {
        dest: path.join(tmp, "/a/d")
      });
      mountDirectory(mockVolume, path.join(__dirname, "res/a/d"), {
        dest: path.join(tmp, "/b/d")
      });
      mountFile(
        mockVolume,
        path.join(__dirname, "res/project/a Project/a.als"),
        "/foo/project.als"
      );

      // FIXME: same as above
      mountDirectory(
        mockVolume,
        path.join(__dirname, "../node_modules/xmlbuilder/lib")
      );

      this.unpatch = patchFs(mockVolume);
    });

    afterEach(function() {
      if (this.unpatch) {
        this.unpatch();
      }
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

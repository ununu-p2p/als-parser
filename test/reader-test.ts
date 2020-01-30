import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { Reader, INVALID_FILE } from "../lib/reader/reader";
import { copyFileAsync, changeExt } from "../lib/reader/utils";
import { loadXml } from "../lib/reader/xml";
import { copySync, remove } from "fs-extra";
import path from "path";
import { Volume } from "memfs";
import { mountDirectory } from "../lib/memory-fs";
import { patchFs } from "fs-monkey";
import fs from 'fs'
chai.use(chaiAsPromised);
chai.should();
const expect = chai.expect;

// temporary directory created as an exact copy of the res directory before test
const tmpDir = "/private/tmp/com.ununu.als-parser";

const projectDir = "project/a Project/";
const sampleAls = "a.als";
const sampleXml = "a.xml";
const invalid_file = "invalid-file";

describe("Reader", function() {
  describe("Load Reader", function() {
    // TODO: Put proper analytics to check how slow?
    this.slow(100);

    beforeEach(async function() {
      const mockVolume = new Volume();

      mountDirectory(mockVolume, path.join(__dirname, "res"), {
        dest: tmpDir,
        recursively: true
      });

      /* FIXME: see `parser-test.ts` */
      mountDirectory(
        mockVolume,
        path.join(__dirname, "../node_modules/xmlbuilder/lib")
      );

      this.unpatch = patchFs(mockVolume);
      this.expectedXml = await loadXml(
        path.join(tmpDir, projectDir, sampleXml)
      );
    });

    afterEach(function() {
      if (this.unpatch) {
        this.unpatch();
      }
    });

    it("When the valid gzipped als is given", function(done) {
      let reader = new Reader(path.join(tmpDir, projectDir, sampleAls));
      // eql is used instead of equal as the objects are not directly comparable
      reader
        .load()
        .should.eventually.eql(this.expectedXml)
        .notify(done);
    });

    it("When the invalid file type is given", function(done) {
      let reader = new Reader(path.join(tmpDir, invalid_file));
      reader
        .load()
        .should.eventually.rejectedWith(INVALID_FILE)
        .notify(done);
    });

    it("When the valid extracted(xml) als is given", function(done) {
      // Create a copy of the extracted xml as .als
      let tmpAls = changeExt(path.join(tmpDir, projectDir, sampleXml), ".als");
      fs.copyFileSync(path.join(tmpDir, projectDir, sampleXml), tmpAls);
      let reader = new Reader(tmpAls);
      reader
        .load()
        .should.eventually.eql(this.expectedXml)
        .notify(done);
    });
  });

  describe("Save Reader", function() {
    beforeEach(async function() {
      const mockVolume = new Volume();

      mountDirectory(mockVolume, path.join(__dirname, "res"), {
        dest: tmpDir,
        recursively: true
      });

      /* FIXME: see `parser-test.ts` */
      mountDirectory(
          mockVolume,
          path.join(__dirname, "../node_modules/xmlbuilder/lib")
      );

      this.unpatch = patchFs(mockVolume);

      this.reader = new Reader(path.join(tmpDir, projectDir, sampleAls));
      await this.reader.load();
    });

    afterEach(function() {
      if (this.unpatch) {
        this.unpatch();
      }
    });

    it("When a valid als file is given", async function() {
      let newPath = path.join(tmpDir, projectDir, "saved.als");
      await this.reader.save(newPath);
      // Check if the saved  als is valid
      let newReader = new Reader(newPath);
      await newReader.load();
      newReader.xmlJs.should.eql(this.reader.xmlJs);
    });
  });
});

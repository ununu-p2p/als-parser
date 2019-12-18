import assert from "mocha";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { Reader, INVALID_FILE } from "../lib/reader/reader";
import { copyFileAsync, changeExt } from "../lib/reader/utils";
import { loadXml } from "../lib/reader/xml";
import { copySync, remove } from "fs-extra";
import path from "path";

chai.use(chaiAsPromised);
chai.should();
const expect = chai.expect;

// Test resource directory
const resDir = "./test/res";
// Tmp directory created as an exact copy of the res directory before test
const tmpDir = "./test/tmp";

// Sample file relative path to res dir
const sampleAls = "sample-project/sample-project.als";
const sampleXml = "sample-project/extracted.xml"
const invalid_file = "invalid-file";

describe('Reader', function() {
    describe ('Load Reader', function() {
        // TODO: Put proper analytics to check how slow?
        this.slow(100);
        before(async function() {
            // Create a copy of the sample files.
            // This is important as the parser modifies the origional file.
            copySync(resDir, tmpDir);
            this.expectedXml = await loadXml(path.join(tmpDir, sampleXml));
        });

        it('When the valid gzipped als is given', function(done) {
            let reader = new Reader(path.join(tmpDir, sampleAls));
            // eql is used instead of equal as the objects are not directly comparable
            reader.load().should.eventually.eql(this.expectedXml).notify(done);
        });

        it('When the invalid file type is given', function(done) {
            let reader = new Reader(path.join(tmpDir, invalid_file));
            reader.load().should.eventually.rejectedWith(INVALID_FILE).notify(done);
        });

        it('When the valid extracted(xml) als is given', function(done) {
            // Create a copy of the extracted xml as .als
            let tmpAls = changeExt(path.join(tmpDir, sampleXml), '.als');
            copySync(path.join(tmpDir, sampleXml), tmpAls);
            let reader = new Reader(tmpAls);
            reader.load().should.eventually.eql(this.expectedXml).notify(done);
        });

        after(function() {
            // Cleanup after test
            remove(tmpDir);
        });
    });
});

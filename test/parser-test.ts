import assert from "mocha";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { parseFile } from "../lib/index";
import { loadXml } from "../lib/reader/xml";
import { copySync, remove } from "fs-extra";
import path from "path";

chai.use(chaiAsPromised);
chai.should();
const expect = chai.expect;

// Test resource directory
const resDir = "./test/res";
// Tmp directory created as an exact copy of the res directory before test
const tmpDir = "./test/tmp2";
const tmpDir2 = "./test/tmp3";

// Sample file relative path to res dir
const sampleAls = "sample-project/sample-project.als";
const sampleXml = "sample-project/extracted.xml";

// Resource List
const resources = [
  'Users/ama/Downloads/Reverb Default.adv',
  'Users/mak/Library/Application Support/Ableton/Live 10 Core Library/Devices/Audio Effects/Simple Delay/Dotted Eighth Note.adv'
];

describe('Parser', function() {
    describe ('Parse File', function() {
        // TODO: Put proper analytics to check how slow?
        this.slow(100);
        before(async function() {
            // Create a copy of the sample files.
            // This is important as the parser modifies the origional file.
            copySync(resDir, tmpDir);
            this.expectedXml = await loadXml(path.join(tmpDir, sampleXml));
        });

        it('Load when als project file is given', function(done) {
            let parser = parseFile(path.join(tmpDir, sampleAls));
            parser.should.eventually.have.deep.property('xmlJs', this.expectedXml).notify(done);
        });

        it('Get tracks count when als project file is given', async function() {
            let parser = await parseFile(path.join(tmpDir, sampleAls));
            parser.getTracksCount().should.eql({ 
                MidiTrack: 1, 
                AudioTrack: 1, 
                ReturnTrack: 2 
            });
        });

        after(function() {
            // Cleanup after test
            remove(tmpDir);
        });
    });
    describe ('Resource', function() {
        before(async function() {
            // Create a copy of the sample files.
            // This is important as the parser modifies the origional file.
            copySync(resDir, tmpDir2);
            this.parser = await parseFile(path.join(tmpDir2, sampleAls));
        });
        it('Get the list of resourcefiles when als project file is given', function() {
            this.parser.getResourceLocations().should.eql(resources);
        });
        after(function() {
            // Cleanup after test
            remove(tmpDir2);
        });
    })
});

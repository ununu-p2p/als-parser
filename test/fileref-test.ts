import assert from "mocha";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { ascii2hex, hex2ascii } from "../lib/fileref/utils";
import { unmarshall, marshall, FilerefData } from "../lib/fileref/fileref-data";
import { Fileref } from "../lib/fileref/fileref";
import { loadXml } from "../lib/reader/xml";
import path from "path";

chai.use(chaiAsPromised);
chai.should();
const expect = chai.expect;
const stream = "000000000140000200000C4D6163696E746F73682048440000000000000000000000000000000000\
000042440001FFFFFFFF086472756D2E616966000000000000000000000000000000000000000000\
00000000000000000000000000000000000000000000000000000000000000000000FFFFFFFF0000\
00000000000000000000FFFFFFFF00000A206375000000000000000000000000000164000002002F\
2F3A707269766174653A746D703A636F6D2E756E756E752E616C732D7061727365723A613A643A64\
72756D2E61696600000E00120008006400720075006D002E006100690066000F001A000C004D0061\
00630069006E0074006F007300680020004800440012002D707269766174652F746D702F636F6D2E\
756E756E752E616C732D7061727365722F612F642F6472756D2E61696600001300012F00FFFF0000";

const newStream = "000000000140000200000C4D6163696E746F73682048440000000000000000000000000000000000\
000042440001FFFFFFFF086472756D2E616966000000000000000000000000000000000000000000\
00000000000000000000000000000000000000000000000000000000000000000000FFFFFFFF0000\
00000000000000000000FFFFFFFF00000A206375000000000000000000000000000164000002002F\
2F3A707269766174653A746D703A636F6D2E756E756E752E616C732D7061727365723A623A643A64\
72756D2E61696600000E00120008006400720075006D002E006100690066000F001A000C004D0061\
00630069006E0074006F007300680020004800440012002D707269766174652F746D702F636F6D2E\
756E756E752E616C732D7061727365722F622F642F6472756D2E61696600001300012F00FFFF0000";

const header = "000000000140000200000C4D6163696E746F73682048440000000000000000000000000000000000\
000042440001FFFFFFFF086472756D2E616966000000000000000000000000000000000000000000\
00000000000000000000000000000000000000000000000000000000000000000000FFFFFFFF0000\
00000000000000000000FFFFFFFF00000A2063750000000000000000000000000001640000";

const footer = "1300012F00FFFF0000";

// TODO: Use a relative location as this location would not exist in every system.
const location = "a/d/drum.aif";
const newLocation = "b/d/drum.aif";
const systemName = "Macintosh HD";
const hex = "48656C6C6F20576F726C6421313233344023";
const ascii = "Hello World!1234@#";

// Test resource directory
const tmpDir = "private/tmp/com.ununu.als-parser/";

describe('FilerefData', function() {
    describe ('Utils', function() {
        it('Hex to Ascii', function() {
            hex2ascii(hex).should.equal(ascii);
        });
        it('Ascii to Hex', function() {
            ascii2hex(ascii).should.equal(hex);
        });
    });
    describe ('Parsing', function() {
        it('Unmarshall when data stream is given', function() {
            let data = unmarshall(stream);
            data.getLocation('/').should.equal(path.join(tmpDir, location));
            data.getSystemName().should.equal(systemName);
            data.getHeader().should.equal(header);
            data.getFooter().should.equal(footer);
        });
        it('Marshall when location, systemName, and format is given', function() {
            let data = new FilerefData(header, systemName, path.join(tmpDir, location), footer);
            marshall(data).should.equal(stream);
        });
        it('Change Location when stream is given', function() {
            let data = unmarshall(stream);
            data.setLocation(path.join('/', tmpDir, newLocation));
            marshall(data).should.equal(newStream);
        });
    });
});

describe('Fileref', function() {
    beforeEach(async function() {
      this.originalRef = (await loadXml('./test/res/fileref-original.xml')).FileRef;
      this.expectedRef = (await loadXml('./test/res/fileref-expected.xml')).FileRef;
    });

    describe ('Change Location', function() {
        it('Change Location when internal resource is given', function() {
            let originalRef = new Fileref(this.originalRef);
            let expectedRef = new Fileref(this.expectedRef);
            originalRef.changeLocation('resource',
                '/Users/shresthagrawal/Desktop/work/ununu/sample-project/tom3 Project/tom3.als',
                true);
            originalRef.fileref.LivePackName.should.deep.equal(expectedRef.fileref.LivePackName);
            originalRef.fileref.LivePackId.should.deep.equal(expectedRef.fileref.LivePackId);
            originalRef.fileref.RelativePathType.should.deep.equal(expectedRef.fileref.RelativePathType);
        })
    });
});

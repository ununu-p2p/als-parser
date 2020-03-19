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

const streamExternal = "0000000001900002000018736D696C652D656C73652D692D77696C6C2D6B696C6C2D75000000DA98\
F20D482B0005000000020E6C6574732D70617274792E616966000000000000000000000000000000\
0000000000000000000000000000000000000000000000000000000000000000000000000071D9A3\
D5FB4149464600000000FFFFFFFF0000090200000000000000000000000000000018736D696C652D\
656C73652D692D77696C6C2D6B696C6C2D75001000080000DA98E3FD0000001100080000D9A3B9DB\
00000001000000020027736D696C652D656C73652D692D77696C6C2D6B696C6C2D753A6C6574732D\
70617274792E61696600000E001E000E006C006500740073002D00700061007200740079002E0061\
00690066000F003200180073006D0069006C0065002D0065006C00730065002D0069002D00770069\
006C006C002D006B0069006C006C002D00750012000F2F6C6574732D70617274792E616966000013\
00212F566F6C756D65732F736D696C652D656C73652D692D77696C6C2D6B696C6C2D7500FFFF0000";

const header = "000000000140000200000C4D6163696E746F73682048440000000000000000000000000000000000\
000042440001FFFFFFFF086472756D2E616966000000000000000000000000000000000000000000\
00000000000000000000000000000000000000000000000000000000000000000000FFFFFFFF0000\
00000000000000000000FFFFFFFF00000A2063750000000000000000000000000001640000";

const footer = "1300012F00FFFF0000";

// TODO: Use a relative location as this location would not exist in every system.
const location = "a/d/drum.aif";
const newLocation = "b/d/drum.aif";
const diskName = "Macintosh HD";
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
            data.getDiskName().should.equal(diskName);
            data.getHeader().should.equal(header);
            data.getFooter().should.equal(footer);
        });
        it('Marshall when location, diskName, and format is given', function() {
            let data = new FilerefData(header, diskName, path.join(tmpDir, location), footer, false);
            marshall(data).should.equal(stream);
        });
        it('Change Location when stream is given', function() {
            let data = unmarshall(stream);
            data.setLocation(path.join('/', tmpDir, newLocation));
            marshall(data).should.equal(newStream);
        });
        it('Unmarshall when data stream is for external resource', function() {
            let data = unmarshall(streamExternal);
            data.getLocation('/').should.equal('/Volumes/smile-else-i-will-kill-u/lets-party.aif')
            data.getDiskName().should.equal('smile-else-i-will-kill-u')
            data.isExternal().should.equal(true);
        })
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

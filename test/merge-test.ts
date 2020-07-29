import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { Volume } from "memfs";
import path from "path";
import { patchFs } from "fs-monkey";
import { mountDirectory } from "../lib/memory-fs";
import { mergeFiles } from "../lib/merge";

chai.use(chaiAsPromised);
chai.should();
const expect = chai.expect;

const projectPath = "/tmp/merge-parser";

describe('FileMerge', function () {
    beforeEach(async function () {
        const mockVolume = new Volume();
        mountDirectory(mockVolume, path.join(__dirname, "res/merge-parser"), {
            dest: projectPath,
            recursively: true
        });
        /* FIXME: see `parser-test.ts` */
        mountDirectory(
            mockVolume,
            path.join(__dirname, "../node_modules/xmlbuilder/lib")
        );
        this.unpatch = patchFs(mockVolume);
    });
    it('when it one file is a newer version of another', async function () { 
        // one version is part of another
        const olderVersion = path.join(projectPath, 'a', 'project.als');
        const newerVersion = path.join(projectPath, 'b', 'project.als');
        const mergedVersion = mergeFiles(olderVersion, newerVersion);
        mergedVersion.should.eql(newerVersion);
    });
    // it('when it files not conflict', async function () { 
    //     // files can be added to the project together
    //     const versionB = path.join(projectPath, 'b', 'project.als');
    //     const versionC = path.join(projectPath, 'c', 'project.als');
    //     const versionBC = path.join(projectPath, 'd', 'project.als');
    //     const mergedVersion = mergeFiles(versionB, versionC);
    //     mergedVersion.should.eql(versionBC);
    // });
    // it('when overlap cannot be resolved', async function () { 
    //     // when two different tracks are added to the same line
    //     const versionB = path.join(projectPath, 'b', 'project.als');
    //     const versionE = path.join(projectPath, 'e', 'project.als');
    //     const versionBC = path.join(projectPath, 'd', 'project.als');
    //     const mergedVersion = mergeFiles(versionB, versionE);
    //     mergedVersion.should.eql(versionBC); // or throw an error, to be decided
    // });
    afterEach(async function () {
        if (this.unpatch) {
            this.unpatch();
        };
    });
});

  
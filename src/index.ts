import * as GitHub from 'github-api';
import * as download from 'download';
import {asSequence} from 'sequency';
import {join} from "path";
import * as tmp from "tmp";

const sumchecker = require("sumchecker");
import decompress = require("decompress");

async function downloadJdk(jdkVersion: number, doChecksum: boolean = true) {
    const gh = new GitHub();
    const response = await gh.getRepo(`AdoptOpenJDK/openjdk${jdkVersion}-releases`).listReleases();

    const data = response.data;

    const latestRelease = asSequence(data)
        .sortedBy(r => r.published_at)
        .last();

    const macReleases = asSequence(latestRelease.assets)
        .filter(r => r.name.includes("Mac"))
        .toArray();

    const tarFile = asSequence(macReleases).find(r => r.name.endsWith("tar.gz"));
    const checksumFile = asSequence(macReleases).find(r => r.name.endsWith("sha256.txt"));

    if (tarFile == null) {
        throw new Error(`Could not find tar for jdk ${jdkVersion}`)
    }
    if (checksumFile == null) {
        throw new Error(`Could not find checksum for jdk ${jdkVersion}`)
    }

    const temp = tmp.dirSync().name;
    const checksumLocation = join(temp, checksumFile.name);

    console.log(temp);
    console.log(`Downloading checksum to ${checksumLocation}`);

    await download(checksumFile.browser_download_url, temp);

    const tarLocation = join(temp, tarFile.name);

    console.log(`Downloading tar to ${tarLocation}`);
    await download(tarFile.browser_download_url, temp);

    return checksum(doChecksum)(checksumLocation, temp, tarFile.name)
        .then(() => decompress(tarLocation, temp))
        .then(jdk => join(temp, jdk[0].path));
}

function checksum(check: boolean): (c: string, t: string, f: string) => Promise<any> {
    if (check) {
        return (checksumFilename, temp, tarFileName) => {
            return new sumchecker.ChecksumValidator("sha256", checksumFilename, {defaultTextEncoding:"binary"})
                .validate(temp, tarFileName);
        };
    }
    return () => Promise.resolve();
}

(async () => {
    const jdkPath = await downloadJdk(10);
    console.log(`jdk downloaded to ${jdkPath}`);
})();

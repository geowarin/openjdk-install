import * as GitHub from 'github-api';
import {asSequence} from 'sequency';

(async () => {
    const gh = new GitHub();
    const response = await gh.getRepo("AdoptOpenJDK/openjdk10-releases").listReleases();
    // const response = await got('https://api.github.com/repos/AdoptOpenJDK/openjdk10-releases/releases');

    const data = response.data;
    console.log(data);
    console.log("-------");

    const latestRelease = asSequence(data)
        .sortedBy(r => r.published_at)
        .last();

    const macReleases = asSequence(latestRelease.assets)
        .filter(r => r.name.includes("Mac"))
        .toArray();


    console.log(macReleases);


})();

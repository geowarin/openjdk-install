declare module 'github-api' {

    interface Asset {
        name: string
        browser_download_url: string
    }

    interface Release {
        published_at: string
        name: string
        assets: Asset[]
    }

    interface DataRelease {
        data: Release[]
    }

    interface Repo {
        listReleases(): DataRelease
    }

    class Github {
        getRepo(name: string): Repo;
    }
    namespace Github {
    }

    export = Github;
}



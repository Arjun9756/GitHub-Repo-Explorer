const cacheService = require('./Backend/Source/Services/Cache.Service')
const githubService = require('./Backend/Source/Services/Github.Service')

async function cacheHitOrMiss(userName) {
    if (cacheService.get(userName)) {
        console.log(`Key ${userName} Cache Hit`)
    } else {
        console.log(`Key ${userName} Cache Miss`)
    }
}

async function unfoundGithub(userName) {
    if (await githubService.getUserProfile(userName)) {
        console.log("User Exists")
    } else {
        console.log("User Not Exists")
    }
}

async function hasRepos(userName) {
    const data = await githubService.getUserRepos(userName)
    if (data.repos.length) {
        console.log("Username Contain Repos")
    } else {
        console.log("No Repos Found For This User")
    }
}



async function runTest() {
    console.log("=== Running Tests ===\n")

    cacheService.clear()

    console.log("-- Cache Tests --")
    await cacheHitOrMiss("torvalds")      // Cache Miss expected
    cacheService.set("torvalds", { name: "Linus" })
    await cacheHitOrMiss("torvalds")      // Cache Hit expected

    console.log("\n-- GitHub API Tests --")
    await unfoundGithub("torvalds")       // User Exists
    await unfoundGithub("xyzabc123999")   // User Not Exists

    console.log("\n-- Repo Tests --")
    await hasRepos("torvalds")            // Has Repos

    console.log("\n=== Tests Done ===")
}

runTest()
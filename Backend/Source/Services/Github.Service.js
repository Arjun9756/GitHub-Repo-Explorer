const axios = require('axios')
const cacheService = require('./Cache.Service')

const GITHUB_API_BASE = "https://api.github.com"
const GITHUB_HEADERS = {
    Accept: "application/vnd.github.com", 
    Authorization: `Bearer ${ process.env.GITHUB_TOKEN || ""}`
}
/**
 * @param {string} Github Username 
 * @returns {Promise<object>} Github User Profile 
*/

async function getUserProfile(userName) {
    try {
        const cacheKey = `user: ${ userName }`
        const cached = cacheService.get(cacheKey)

        if (cached) {
            console.log(`Cache Hit ${ cacheKey }`)
            return cached
        }

        console.log(`Cache Miss`)
        const response = await axios.get(`${ GITHUB_API_BASE } / users / ${ userName }, { headers: GITHUB_HEADERS }`)

        const profile = { // Ready response for user 
            login: response.data.login,
            name: response.data.name,
            bio: response.data.bio,
            avatar_url: response.data.avatar_url,
            followers: response.data.followers,
            following: response.data.following,
            public_repos: response.data.public_repos,
            html_url: response.data.html_url, location:
                response.data.location,
        }

        cacheService.set(cacheKey, profile) // Cache data for future return profile 
        return cached

    } catch (error) {
        console.log(`Some error occured while fetching ${ error?.message || "Github API Error" }`) 
        return null 
    }
}


async function getUserRepo(userName, pageNo = 1) {
    try {
        const cacheKey = ` repos: ${ userName }: ${ pageNo }`
        const cached = cacheService.get(cacheKey)

        if (cached) {
            console.log("Cache hit for github repo find " + cached)
            return cached
        }
    } catch (error) {
        
    }
}
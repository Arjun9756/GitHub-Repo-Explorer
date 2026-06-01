const axios = require('axios')
const cacheService = require('./Cache.Service')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({
    path:path.join(__dirname , ".." , ".." , ".env")
})

const GITHUB_API_BASE = "https://api.github.com"
const GITHUB_HEADERS = {
    Accept: "application/vnd.github.com",
    Authorization: `Bearer ${process.env.GITHUB_TOKEN || ""}`
}

/**
 * @param {string} Github Username 
 * @returns {Promise<object>} Github User Profile 
*/

async function getUserProfile(userName) {
    try {
        const cacheKey = `user:${userName}`
        const cached = cacheService.get(cacheKey)

        if (cached) {
            console.log(`Cache Hit ${cacheKey}`)
            return cached
        }

        console.log(`Cache Miss`)
        const response = await axios.get(`${GITHUB_API_BASE}/users/${userName}`, { headers: GITHUB_HEADERS })

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
        return profile

    } catch (error) {
        console.log(`Some error occured while fetching ${error?.message || "Github API Error"}`)
        return null
    }
}

/**
 * 
 * @param {string} userName - Github Username
 * @param {number} pageNo Page number for pagination
 * @returns Github repos + pagination info
 */

async function getUserRepos(userName, pageNo = 1) {
    try {
        const cacheKey = ` repos:${userName}:${pageNo}`
        const cached = cacheService.get(cacheKey)

        if (cached) {
            console.log("Cache hit for github repo find " + cached)
            return cached
        }

        const response = await axios.get(`${GITHUB_API_BASE}/users/${userName}/repos`, {
            headers: GITHUB_HEADERS,
            params: {
                per_page: 30,
                page:pageNo,
                sort: "updated"
            }
        })

        const repos = response.data.map((repo) => ({
            id: repo.id,
            name: repo.name,
            description: repo.description,
            language: repo.language,
            stargazers_count: repo.stargazers_count,
            updated_at: repo.updated_at,
            html_url: repo.html_url,
            open_issues_count: repo.open_issues_count,
            default_branch: repo.default_branch,
            forks_count: repo.forks_count
        }))

        const linkHeader = response.headers["link"]
        const hasNextPage = linkHeader ? linkHeader.includes(`rel=next`) : false

        const result = {
            repos,
            hasNextPage,
            currentPage:pageNo
        }

        cacheService.set(cacheKey , result)
        return result

    } catch (error) {
        console.log("Error while fetching repos from github " + error?.message)
        return null
    }
}

module.exports = Object.freeze({
    getUserProfile,
    getUserRepos
})
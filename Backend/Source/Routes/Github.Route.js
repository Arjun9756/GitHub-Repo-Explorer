const express = require('express')
const router = express.Router()
const gitHubService = require('../Services/Github.Service')

/**
 * GET /api/github/user/:username
 * Returns Github User Profile
 */

router.get('/user/:username', async function (req, res, next) {
    const userName = req.params.username
    if (!userName || userName.trim() === '') {
        return res.status(400).json({
            status: false,
            message: "Username is required"
        })
    }

    try {
        const profile = await gitHubService.getUserProfile(userName.trim())
        if (!profile) {
            return res.status(404).json({
                status: false,
                message: "Github user not found"
            })
        }

        return res.status(200).json({
            status: true,
            data: profile
        })
    }
    catch (error) {
        console.log("Error while fetching user from github")
        next(error)
    }
})

/**
 * GET /api/github/user/username
 * Returns Github Profile Repos
 */
router.get('/user/:username/repos', async function (req, res, next) {
    try {
        const userName = req.params.username
        const pageNo = parseInt(req.query.page) || 1

        if (!userName || userName.trim() === '') {
            return res.status(400).json({
                status: false,
                message: "Username not found"
            })
        }

        if (pageNo < 0) {
            return res.status(400).json({
                status: false,
                message: "Page no must be greater than 0"
            })
        }

        const result = await gitHubService.getUserRepos(userName.trim(), pageNo)
        return res.status(200).json({
            status: true,
            data: result
        })
    }
    catch (error) {
        console.log("Error while fetching repos from github " + error?.message)
        next(error)
    }
})

module.exports = router
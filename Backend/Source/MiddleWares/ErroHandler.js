/**
 * Global Error Handler Middleware
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */

function errorHandler(err, req, res, next) {
    console.error(`Error ${err.message}`)

    // GitHub API errors
    if (err.response) {
        const status = err.response.status

        if (status === 404) {
            return res.status(404).json({
                success: false,
                message: "GitHub user not found"
            })
        }

        if (status === 403) {
            return res.status(429).json({
                success: false,
                message: "GitHub rate limit exceeded. Please try again later."
            })
        }

        if (status === 401) {
            return res.status(401).json({
                success: false,
                message: "Invalid GitHub token"
            })
        }
    }

    // Network error
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
        return res.status(503).json({
            success: false,
            message: "Unable to reach GitHub API. Check your network."
        })
    }

    // Default
    return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
    })
}

module.exports = errorHandler
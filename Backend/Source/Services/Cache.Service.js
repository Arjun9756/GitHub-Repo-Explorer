const CACHE_TTL  = 60 * 1000 // 60 Seconds
const cacheStore = new Map() // Key Value Pair {username -> Value}

/**
 * 
 * @param {string} key - Unique cache key.
 * @param {*} value - Data to be cached
 * @returns {*} {{success:boolean , message:string}}
 */

function set(key, value) {
    const cacheKey = String(key).trim().toLowerCase()     // Github User Names are case insensitive

    if (!cacheKey || cacheKey.trim() === '')
        throw new Error("Cache key is required")

    cacheStore.set(cacheKey, {
        value,
        expiresAt: Date.now() + CACHE_TTL
    })

    return {
        success: true,
        message: "Cache stored successfully"
    }
}

/**
 * Retrives data from cache store if key present and not expired also
 * 
 * @param {string} key - Cache key
 * @returns {*|null}
 */

function get(key)
{
    const cacheKey = String(key).trim().toLowerCase()
    if(!cacheKey || cacheKey.trim() === '')
        throw new Error("No key is provided")

    const cachedEntry = cacheStore.get(cacheKey)
    if(!cachedEntry)
        return null

    if(Date.now() > cachedEntry.expiresAt){
        cacheStore.delete(cacheKey)
        return null
    }

    return cachedEntry.value
}

/**
 * 
 * @param {string} key - Cache key
 * @returns {boolean}
 */

function has(key){
    return get(key) !== null
}

/**
 * Remove all entries from cache stored
 * 
 * @returns {{status:boolean , message:string}}
 */

function clear(){
    cacheStore.clear()
    return {
        success:true,
        message:"Cache cleared successfuly"
    }
}

/**
 * 
 * @param {string} key - Cache key
 * @returns {{success:boolean , message:string}}
 */

function remove(key){
    const deleted = cacheStore.delete(String(key).trim().toLowerCase())
    return {
        success:true,
        message:deleted ? "Cached enrty removed successfullu" : "Cache entry not found"
    }
}

module.exports = Object.freeze({
    get,
    set,
    has,
    clear,
    remove
})
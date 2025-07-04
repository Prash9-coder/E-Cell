/**
 * Utility functions for handling YouTube video URLs
 */

/**
 * Extract video ID from various YouTube URL formats
 * @param {string} url - YouTube video URL
 * @returns {string|null} - Video ID or null if not found
 */
export const getVideoId = (url) => {
  if (!url) return null
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/.*[?&]v=)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    /youtu\.be\/([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  return null
}

/**
 * Generate YouTube embed URL from video ID
 * @param {string} videoId - YouTube video ID
 * @returns {string} - Embed URL
 */
export const getEmbedUrl = (videoId) => {
  if (!videoId) return null
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`
}

/**
 * Generate YouTube thumbnail URL from video ID
 * @param {string} videoId - YouTube video ID
 * @param {string} quality - Thumbnail quality (default, medium, high, standard, maxres)
 * @returns {string} - Thumbnail URL
 */
export const getThumbnailUrl = (videoId, quality = 'maxresdefault') => {
  if (!videoId) return null
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`
}

/**
 * Generate YouTube watch URL from video ID
 * @param {string} videoId - YouTube video ID
 * @returns {string} - Watch URL
 */
export const getWatchUrl = (videoId) => {
  if (!videoId) return null
  return `https://www.youtube.com/watch?v=${videoId}`
}

/**
 * Validate if a URL is a valid YouTube URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid YouTube URL
 */
export const isValidYouTubeUrl = (url) => {
  return getVideoId(url) !== null
}

/**
 * Extract video information from YouTube URL
 * @param {string} url - YouTube video URL
 * @returns {object} - Video information object
 */
export const getVideoInfo = (url) => {
  const videoId = getVideoId(url)
  
  if (!videoId) {
    return {
      isValid: false,
      videoId: null,
      embedUrl: null,
      thumbnailUrl: null,
      watchUrl: null
    }
  }
  
  return {
    isValid: true,
    videoId,
    embedUrl: getEmbedUrl(videoId),
    thumbnailUrl: getThumbnailUrl(videoId),
    watchUrl: getWatchUrl(videoId)
  }
}
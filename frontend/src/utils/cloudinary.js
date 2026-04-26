const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

/**
 * Generates an optimized Cloudinary URL for a given public ID.
 * Defaults to automatic quality and format with 800px width.
 * 
 * @param {string} publicId - The Cloudinary public ID of the image
 * @param {string} transformations - Transformation parameters (e.g., "w_1200,c_limit")
 * @returns {string} The full Cloudinary URL
 */
export const getOptimizedUrl = (publicId, transformations = "q_auto,f_auto,w_800") => {
  if (!publicId) return "";
  
  // If we already have a Cloudinary URL or another full URL, return it
  if (publicId.startsWith('http')) {
    // If it's a Cloudinary URL, we can still try to inject transformations if they're not there
    if (publicId.includes('res.cloudinary.com') && !publicId.includes('/q_auto')) {
        return publicId.replace('/upload/', `/upload/${transformations}/`);
    }
    return publicId;
  }

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
};

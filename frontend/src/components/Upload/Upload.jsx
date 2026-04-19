import { useState } from 'react';

/**
 * Cloudinary Upload Component
 * 
 * Note: The Cloudinary Node.js SDK (used in the migration script) should not be used directly in the frontend
 * for security reasons (API Secret exposure). For frontend uploads, use the Cloudinary Upload Widget
 * or a secure backend proxy.
 * 
 * This file serves as a reference for your Cloudinary setup and future image optimization.
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;

// Helper to get optimized Cloudinary URLs
export const getOptimizedUrl = (publicId, options = "q_auto,f_auto,w_800") => {
  if (!publicId) return "";
  // Check if it's already a full URL
  if (publicId.startsWith('http')) return publicId;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${options}/${publicId}`;
};

const Upload = () => {
  const [status, setStatus] = useState("Cloudinary is configured and ready.");

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px', marginTop: '20px' }}>
      <h2>Cloudinary Asset Management</h2>
      <p style={{ color: '#666' }}>
        <strong>Status:</strong> {status}
      </p>
      
      <div style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
        <h3>Optimization Tips:</h3>
        <ul>
          <li><strong>q_auto,f_auto:</strong> Automatically adjusts quality and format for best performance.</li>
          <li><strong>w_800:</strong> Resizes images to 800px width (save bandwidth).</li>
          <li><strong>c_fill,g_auto:</strong> Crops to fill specific areas while focusing on the subject.</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px', padding: '10px', background: '#e3f2fd', borderRadius: '4px' }}>
        <code>
          // Example usage in code:<br />
          import &#123; getOptimizedUrl &#125; from './utils/cloudinary';<br />
          &lt;img src=&#123;getOptimizedUrl("your_image_id")&#125; /&gt;
        </code>
      </div>
    </div>
  );
};

export default Upload;

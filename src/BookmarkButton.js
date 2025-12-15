import React, { useState } from 'react';

// *** IMPORTANT: This component assumes your API endpoint for bookmarking is /api/articles/{id}/bookmark ***

function BookmarkButton({ articleId }) {
  const [status, setStatus] = useState('online');
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = async () => {
    const action = isBookmarked ? 'unbookmark' : 'bookmark';
    setStatus(`Attempting to ${action}...`);

    // The URL for the POST request that the Service Worker will intercept
    const bookmarkUrl = `/api/articles/${articleId}/bookmark`; 

    try {
      // Attempt the network request immediately
      const response = await fetch(bookmarkUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookmarked: !isBookmarked, articleId }),
      });

      if (response.ok) {
        // Successful sync to the server
        setIsBookmarked(!isBookmarked);
        setStatus(`Action Synced: ${isBookmarked ? 'Unbookmarked' : 'Bookmarked'}!`);
      } else {
        // Server returned an error (e.g., 500), not an offline error
        setStatus('Server error. Check Network logs.');
      }
    } catch (error) {
      // *** THIS IS THE OFFLINE FALLBACK LOGIC ***
      // The fetch failed, likely due to no network.
      // The BackgroundSyncPlugin in src/service-worker.js automatically
      // queued this failed POST request for later retry.
      console.log('Network request failed. Relying on Background Sync.', error);

      // Optimistic UI update: Assume it will succeed when online
      setIsBookmarked(!isBookmarked);
      setStatus(`Action queued! Will sync when reconnected. (${action})`); 

      // You could optionally save the action to localforage here for complex apps
      // to ensure it persists if the SW is cleared, but Background Sync handles retrying.
    }
  };

  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', margin: '10px 0' }}>
      <h3>Article ID: {articleId}</h3>
      <button 
        onClick={handleBookmark} 
        style={{ 
          backgroundColor: isBookmarked ? 'gold' : 'white', 
          cursor: status.includes('Attempting') ? 'wait' : 'pointer'
        }}
      >
        {isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
      </button>
      <p style={{ marginTop: '5px', fontSize: '12px' }}>
        **Sync Status:** *{status}*
      </p>
    </div>
  );
}

export default BookmarkButton;
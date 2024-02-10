/**
 * Initialize settings on install. This is the best time to set default
 * settings. By default the radar will be visible until user's navigate
 * to page popup to change the settings.
 */
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    chrome.storage.local.set({
      settings: {
        frames: 60,
        size: 150,
        speed: 0.0017,
        visible: true,
      },
    });
  }
});

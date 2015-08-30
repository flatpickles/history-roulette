// Maintain current URL so we can reuse the current tab if no new navigation has occurred
var currentUrl = "";

// Get a random entry from the user's browser history; call newUrlCallback with this URL
function getNewUrl(newUrlCallback) {
  chrome.history.search({
    text: "", // All things,
    startTime: 0, // from the beginning of time,
    maxResults: 2147483647 // as many as possible.
  }, function(historyItems) {
    console.log(historyItems.length);
    var idx = Math.floor(Math.random() * historyItems.length);
    newUrlCallback(historyItems[idx].url)
  });
}

// Load up a new random history page, replacing the current tab if (inCurrentTab == true)
function newNavigation(inCurrentTab) {
  getNewUrl(function(newUrl) {
    if (inCurrentTab) {
      console.log("[History Roulette] Reusing current tab.")
      chrome.tabs.update({url: newUrl})
    } else {
      console.log("[History Roulette] Loading new tab.")
      chrome.tabs.create({url: newUrl});
    }
    currentUrl = newUrl;
  });
}

// Browser action was clicked
chrome.browserAction.onClicked.addListener(function() {
  console.log("[History Roulette] Browser action clicked.");
  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  }, function(tabArray) {
    var currentTab = tabArray[0];
    var inCurrentTab = (currentTab && currentUrl === currentTab.url);
    newNavigation(inCurrentTab);
  });
});
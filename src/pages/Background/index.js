function reddenPage() {
  console.log('document', document);
  document.body.style.backgroundColor = 'red';
}

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: reddenPage,
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    chrome.tabs.executeScript(null, {
      code: "document.body.style.backgroundColor='red'",
    });

    // chrome.tabs.executeScript(tabId, { file: '../Content/index.js' });
  }
});

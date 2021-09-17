// // Вызывается, когда пользователь нажимает на действие браузера.
// chrome.browserAction.onClicked.addListener(function (tab) {
//   // Отправить сообщение на активную вкладку
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     var activeTab = tabs[0];
//     chrome.tabs.sendMessage(activeTab.id, { "message": "clicked_browser_action" });
//   });
// });


chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "popup_shown") {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { "message": "popup_shown" }, (response) => console.log(response));
      });
    }
  }
);
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "take_screen") {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.desktopCapture.chooseDesktopMedia([
          "screen",
          "window",
          "tab"
        ], activeTab, (streamId) => {
          //check whether the user canceled the request or not
          if (streamId && streamId.length) {
            chrome.tabs.sendMessage(activeTab.id, { name: "stream", streamId }, (response) => console.log(response))
          }
        });
      });
    }
  }
);



chrome.runtime.onMessage.addListener((message, sender, senderResponse) => {
  if (message.name === 'download' && message.url) {
    console.log(message.url);
    chrome.downloads.download({
      filename: 'screenshot.png',
      url: message.url
    }, (downloadId) => {
      senderResponse({ success: true })
    });
    return true;
  }
})
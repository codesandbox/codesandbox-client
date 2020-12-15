chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "screenshot") {
    capture(sender.tab.id, request.bounds)
  }

  sendResponse({});
});


function capture(tabId, bounds) {
  chrome.tabs.get(tabId, function (tab) {
    chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, function (dataUrl) {
      const canvas = document.createElement("canvas");

      const image = new Image();
      image.onload = function () {
        canvas.width = bounds.width;
        canvas.height = bounds.height;

        const context = canvas.getContext("2d");

        context.drawImage(image, bounds.left, bounds.top, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height);

        const croppedDataUrl = canvas.toDataURL("image/png");

        chrome.tabs.sendMessage(tab.id, { type: "screenshot-taken", url: croppedDataUrl }, function (response) { });
      }
      image.src = dataUrl;
    });
  });
}
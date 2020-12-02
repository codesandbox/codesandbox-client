chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "screenshot") {
    findBounds(sender.tab.id);
  }
  else if (request.type === "screenshot-snap") {
    capture(sender.tab.id, request.bounds)
  }

  sendResponse({});
  function send(request) {
    chrome.tabs.sendMessage(sender.tab.id, request, function (response) { });
  }
});

chrome.browserAction.onClicked.addListener(function onClicked(tab) {
  chrome.tabs.sendMessage(tab.id, { type: "start" }, function (response) { });
});

chrome.commands.onCommand.addListener(function (command) {
  if (command === 'take-screenshot') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currTab = tabs[0];
      if (currTab) { // Sanity check
        chrome.tabs.sendMessage(currTab.id, { type: 'start' }, function (response) { });
      }
    });
  }
});

function findBounds(tabId) {
  chrome.tabs.get(tabId, function (tab) {
    chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, function (dataUrl) {
      const canvas = document.createElement("canvas");

      const image = new Image();
      image.onload = function () {
        canvas.width = image.width;
        canvas.height = image.height;

        const context = canvas.getContext("2d");

        context.drawImage(image, 0, 0);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const size = imageData.width * imageData.height * 4;

        const COLOR_OFFSET = 30;

        const probablyColor = (source, target) => {
          return source <= target + COLOR_OFFSET && source >= target - COLOR_OFFSET;
        };

        const isIndicator = (x) => {
          return (
            probablyColor(imageData.data[x], 255) &&
            probablyColor(imageData.data[x + 1], 0) &&
            probablyColor(imageData.data[x + 2], 0) &&
            // Skipping alpha
            probablyColor(imageData.data[x + 4], 0) &&
            probablyColor(imageData.data[x + 5], 255) &&
            probablyColor(imageData.data[x + 6], 0) &&
            // skipping alpha
            probablyColor(imageData.data[x + 8], 0) &&
            probablyColor(imageData.data[x + 9], 0) &&
            probablyColor(imageData.data[x + 10], 255)
          );
        };

        const findIndicator = (initialX) => {
          for (let x = initialX; x < size; x += 4) {
            if (isIndicator(x)) {
              return x / 4;
            }
          }
        };

        const indicatorTopLeft = findIndicator(0);
        const indicatorBottomRight = findIndicator(indicatorTopLeft * 4 + 4);
        const indicatorTopLeftY = parseInt(indicatorTopLeft / imageData.width, 10)
        const indicatorTopLeftX =
          indicatorTopLeft - indicatorTopLeftY * imageData.width
        const indicatorBottomRightY = parseInt(
          indicatorBottomRight / imageData.width,
          10
        )
        const indicatorBottomRightX =
          indicatorBottomRight - indicatorBottomRightY * imageData.width
        const width = indicatorBottomRightX - indicatorTopLeftX;
        const height = indicatorBottomRightY - indicatorTopLeftY;

        chrome.tabs.sendMessage(tab.id, { type: "screenshot-bounds-found", bounds: { left: indicatorTopLeftX - 2, top: indicatorTopLeftY - 2, width: width + 4, height: height + 4 } }, function (response) { });
      }
      image.src = dataUrl;
    });
  });
}

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

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "popup_shown") {
      chrome.runtime.sendMessage({ "message": "kek", "url": "www" });

      const {
        connection,
        language,
        languages,
        onLine,
        platform,
        userAgentData,
      } = window.navigator;


      let arr = [];
      let bat = navigator.getBattery();


      Promise.allSettled([bat]).then(values => {

        arr = [
          {
            name: "Window width",
            value: window.innerWidth
          },
          {
            name: "Window height",
            value: window.innerHeight
          },
          {
            name: "Connection",
            value: connection.effectiveType
          },
          {
            name: "Language",
            value: language
          },
          {
            name: "System languages",
            value: languages.filter((e, i) => !(i % 2)).join(" ")
          },
          {
            name: "Are you online",
            value: onLine
          },
          {
            name: "Platform",
            value: platform
          },
          {
            name: "User agent",
            value: userAgentData.brands.length ? `${userAgentData.brands[0].brand}, version:${userAgentData.brands[0].version}` : "Unknown"
          },
          {
            name: "Is mobile?",
            value: userAgentData.mobile
          },
        ];

        chrome.runtime.sendMessage({ "message": "content__info", arr });

      });
    }
  }
);

chrome.runtime.onMessage.addListener((message, sender, senderResponse) => {
  if (message.name === 'stream' && message.streamId) {
    let track, canvas
    navigator.mediaDevices.getUserMedia({
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: message.streamId
        },
      }
    })
      .then((stream) => {
        track = stream.getVideoTracks()[0]
        const imageCapture = new ImageCapture(track)
        return imageCapture.grabFrame()
      })
      .then((bitmap) => {
        track.stop();
        canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        let context = canvas.getContext('2d');
        context.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);
        return canvas.toDataURL();
      })
      .then((url) => {
        chrome.runtime.sendMessage({ name: 'download', url }, (response) => {
          if (response.success) {
            console.log("Screenshot saved");
          } else {
            console.log("Could not save screenshot")
          }
          canvas.remove()
          senderResponse({ success: true })
        })
      }).catch((err) => {
        console.log("Could not take screenshot")
        senderResponse({ success: false, message: err })
      })
    return true;
  }
});

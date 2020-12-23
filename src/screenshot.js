const { desktopCapturer } = window.require("electron");

/**
 * Create a screenshot of the entire screen using the desktopCapturer module of Electron.
 *
 * @param callback {Function} callback receives as first parameter the base64 string of the image
 **/
function fullscreenScreenshot(callback) {
  

  // 'image/jpeg' or 'image/png'
  const imageFormat = "image/jpeg";
  
  const handleStream = (stream) => {
    // Create hidden video tag
    var video = document.createElement("video");
    video.style.cssText = "position:absolute;top:-10000px;left:-10000px;";
    
    // Event connected to stream
    video.onloadedmetadata = function () {
      // Set video ORIGINAL height (screenshot)
      video.style.height = this.videoHeight + "px"; // videoHeight
      video.style.width = this.videoWidth + "px"; // videoWidth

      video.play();

      // Create canvas
      var canvas = document.createElement("canvas");
      canvas.width = this.videoWidth;
      canvas.height = this.videoHeight;
      var ctx = canvas.getContext("2d");
      // Draw video on canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (callback) {
        // Save screenshot to base64
        
        callback(canvas.toDataURL(imageFormat));
      } else {
        
      }

      // Remove hidden video tag
      video.remove();
      try {
        // Destroy connect to stream
        stream.getTracks()[0].stop();
      } catch (e) {}
    };

    video.srcObject = stream;
    document.body.appendChild(video);
  };

  const handleError = function (e) {
    
  };

  desktopCapturer
    .getSources({ types: ["window", "screen"] })
    .then(async (sources) => {
      

      for (const source of sources) {
        // Filter: main screen
        if (
          source.name === "Entire Screen" ||
          source.name === "Screen 1" ||
          source.name === "Screen 2"
        ) {
          try {
            
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: false,
              video: {
                mandatory: {
                  chromeMediaSource: "desktop",
                  chromeMediaSourceId: source.id,
                  minWidth: 1280,
                  maxWidth: 4000,
                  minHeight: 720,
                  maxHeight: 4000,
                },
              },
            });

            handleStream(stream);
          } catch (e) {
            handleError(e);
          }
        }
      }
    });
}

// module.exports = fullscreenScreenshot;
export default fullscreenScreenshot;

class Recording {
  /**
   *Creates an instance of Recording.
   * @param {HTMLElement} videoRecord
   * @param {HTMLElement} imgPreview
   * @memberof Recording
   */
  constructor(videoRecord, imgPreview) {
    this.stream = null;
    this.video = videoRecord;
    this.recorder = null;
    this.blob = null;
    this.urlBlobGif = null;
    this.urlBlobPng = null;
    this.imgPreview = imgPreview;
  }

  /**
   * Configuration for video stream.
   * @readonly
   * @memberof Recording
   */
  get getVideoConstraints() {
    return {
      audio: false,
      video: {
        width: { exact: 832 },
        height: { exact: 440 }
      }
    };
  }

  /**
   * Validate and prepare the MediaDevices api for both new and old browsers.
   */
  validateAndPrepare = () => {
    try {
      // Older browsers might not implement mediaDevices at all, so we set an empty object first
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }

      // Some browsers partially implement mediaDevices. We can't just assign an object
      // with getUserMedia as it would overwrite existing properties.
      // Here, we will just add the getUserMedia property if it's missing.
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = (constraints) => {
          // First get ahold of the legacy getUserMedia, if present
          const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

          // Some browsers just don't implement it - return a rejected promise with an error
          // to keep a consistent interface
          if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
          }

          // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
          return new Promise((resolve, reject) => {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        };
      }
    } catch (err) {
      console.error(`Failed to validate and prepare navigator for recording. ${err}`);
    }
  };

  /**
   * Get the stream and enable the video from the camera.
   */
  getStream = async () => {
    await this.validateAndPrepare();

    await navigator.mediaDevices
      .getUserMedia(this.getVideoConstraints)
      .then((stream) => {
        this.stream = stream;
        // Older browsers may not have srcObject
        if ('srcObject' in this.video) {
          this.video.srcObject = this.stream;
        } else {
          // Avoid using this in new browsers, as it is going away.
          this.video.src = window.URL.createObjectURL(this.stream);
        }
        this.video.onloadedmetadata = (e) => this.video.play();
      })
      .catch((err) => {
        modal.open('myModal', '¡Error!', err.message, 'error_icon', locationReload);
        console.error(`${err.name}: ${err.message}`);
      });
  };

  start = (view) => {
    try {
      this.recorder = RecordRTC(this.stream, {
        type: 'gif',
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,

        onGifRecordingStarted: () => {
          this.takeScreenshotFromRecord();

          view === 'capture-my-guifos' ? viewCapture() : null;
        }
      });
      // This method resets the recorder. So that you can reuse single recorder instance many times.
      this.recorder.reset();
      this.recorder.startRecording();
    } catch (err) {
      console.error(`Failed to start recording. ${err}`);
    }
  };

  stop = () => {
    try {
      this.recorder.stopRecording(async () => {
        this.video.srcObject = null;
        this.blob = this.recorder.getBlob();
        this.urlBlobGif = URL.createObjectURL(this.blob); // Show preview

        // Stop streaming - Close webcam -> Taken from https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/stop
        this.stream.getTracks().forEach((track) => track.stop());
        // Also reset recorder states and remove the data
        this.recorder.reset();
        // Destroy RecordRTC instance. Clear all recorders, objects and memory. Clear everything.
        this.recorder.destroy();

        this.recorder = null;
      });
    } catch (err) {
      console.error(`Failed to stop recording. ${err}`);
    }
  };

  /**
   * Take a screenshot when start recording.
   */
  takeScreenshotFromRecord = () => {
    try {
      // Taken from https://developer.mozilla.org/es/docs/WebRTC/Taking_webcam_photos
      let canvas = document.createElement('canvas'); // Dynamically Create a Canvas Element
      canvas.id = 'extractFileCanvas'; // Give the canvas an id
      canvas.width = this.video.videoWidth; // Set the width of the Canvas
      canvas.height = this.video.videoHeight; // Set the height of the Canvas
      let ctx = canvas.getContext('2d'); // Get the "CTX" of the canvas
      ctx.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight); // Draw your image to the canvas
      this.urlBlobPng = canvas.toDataURL('image/png'); // This will save your image as a //png file in the base64 format.
      this.imgPreview.src = this.urlBlobPng;
    } catch (err) {
      console.error(`Failed to take screenshot from record. ${err}`);
    }
  };
}

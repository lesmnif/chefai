// Import the Google Cloud client library
const speech = require('@google-cloud/speech');

// Check if the browser supports SpeechRecognition
class GoogleCloudSpeechRecognition {
    // Set default properties
    continuous = false;
    interimResults = false;
    onresult = null;
    onend = null;
    onerror = null;

    speechClient = new speech.SpeechClient();

    // Set the audio constraints
    constraints = { audio: true, video: false };

    // Initialize the MediaRecorder
    mediaRecorder = null;

    // Initialize the audio chunks
    audioChunks = [];
    
    start = function () {
        if (this.mediaRecorder) {
          this.mediaRecorder.start();
          return;
        }
  
        navigator.mediaDevices
          .getUserMedia(this.constraints)
          .then((stream) => {
            this.mediaRecorder = new MediaRecorder(stream);
            this.mediaRecorder.start();
  
            // Collect audio data
            this.mediaRecorder.addEventListener('dataavailable', (event) => {
              this.audioChunks.push(event.data);
            });
  
            // Process the audio data
            this.mediaRecorder.addEventListener('stop', () => {
              const audioBlob = new Blob(this.audioChunks);
              this.sendToGoogleCloud(audioBlob);
            });
          })
          .catch((error) => {
            if (this.onerror) {
              this.onerror({ error: 'not-allowed' });
            }
          });
      };
  
      // Stop the speech recognition
      stop = function () {
        if (this.mediaRecorder) {
          this.mediaRecorder.stop();
          this.audioChunks = [];
          if (this.onend) {
            this.onend();
          }
        }
      };
  
      // Abort the speech recognition
      abort = function () {
        if (this.mediaRecorder) {
          this.mediaRecorder.stop();
          this.audioChunks = [];
          if (this.onend) {
            this.onend();
          }
        }
      };
  
      // Send the audio data to Google Cloud Speech-to-Text
      sendToGoogleCloud = async function (audioBlob) {
        const audioBuffer = await audioBlob.arrayBuffer();
        const audioBytes = new Uint8Array(audioBuffer).toString();
  
        const request = {
          audio: {
            content: audioBytes,
          },
          config: {
            encoding: 'LINEAR16',
            sampleRateHertz: 16000,
            languageCode: 'en-US',
          },
        };
  
        this.speechClient
          .recognize(request)
          .then((response) => {
            const results = response[0].results;
            if (results.length > 0 && this.onresult) {
              const transcript = results[0].alternatives[0].transcript;
              this.onresult({ results: [{ transcript }] });
            }
          })
          .catch((error) => {
            if (this.onerror) {
              this.onerror({ error: 'audio-capture' });
            }
          });
      };
    };

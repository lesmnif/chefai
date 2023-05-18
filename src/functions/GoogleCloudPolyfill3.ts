import { SpeechClient } from "@google-cloud/speech"

export default class GoogleCloudSpeechRecognition {
  speechClient: any;
  stream: any;
  continuous: boolean;
  interimResults: boolean;
  onresult: any;
  onend: any;
  onerror: any;

  constructor() {
    this.speechClient = new SpeechClient({
        credentials: {
            private_key: 'AIzaSyBlu5gA938g51K6sk4K6oUG-wZciKuNg4E',
            client_email: 'fake@fake.com'
        }
    });
    this.stream = null;
    this.continuous = false;
    this.interimResults = false;
    this.onresult = null;
    this.onend = null;
    this.onerror = null;
  }

  async start() {
    if (this.stream) {
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(mediaStream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      source.connect(processor);
      processor.connect(audioContext.destination);

      const config = {
        encoding: "LINEAR16",
        sampleRateHertz: audioContext.sampleRate,
        languageCode: "en-US",
      };

      const request = {
        config,
        interimResults: this.interimResults,
      };

      this.stream = this.speechClient
        .streamingRecognize(request)
        .on("data", (data) => {
          if (this.onresult) {
            this.onresult(data);
          }
        })
        .on("error", (error) => {
          if (this.onerror) {
            this.onerror(error);
          }
          this.stop();
        })
        .on("end", () => {
          if (this.onend) {
            this.onend();
          }
        });

      processor.onaudioprocess = (event) => {
        if (!this.stream) {
          return;
        }

        const inputBuffer = event.inputBuffer.getChannelData(0);
        const buffer = new Int16Array(inputBuffer.length);

        for (let i = 0; i < inputBuffer.length; i++) {
          buffer[i] = inputBuffer[i] * 32767;
        }

        this.stream.write(buffer);
      };
    } catch (error) {
      if (this.onerror) {
        this.onerror(error);
      }
    }
  }

  stop() {
    if (!this.stream) {
      return;
    }

    this.stream.removeAllListeners();
    this.stream.end();
    this.stream = null;
  }

  abort() {
    this.stop();
  }
}

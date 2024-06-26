// const browserSupportsAudioApis: boolean =
// typeof window !== 'undefined' &&
// window.navigator?.mediaDevices !== undefined &&
// (window.AudioContext !== undefined || window.webkitAudioContext !== undefined)

// class SpeechlySpeechRecognition {
//     static readonly hasBrowserSupport: boolean = browserSupportsAudioApis

//     // private readonly client: BrowserClient
//     private readonly microphone: BrowserMicrophone
//     private aborted = false
//     private transcribing = false
//     private taskQueue: Promise<void> | null = null

//     continuous = false
//     interimResults = false
//     onresult: SpeechRecognitionEventCallback = () => {}
//     onend: SpeechEndCallback = () => {}
//     onerror: SpeechErrorCallback = () => {}

//     constructor() {
//       this.client = new BrowserClient({ appId })
//       this.microphone = new BrowserMicrophone()
//       this.client.onSegmentChange(this.handleResult)
//     }

//     public start = async (): Promise<void> => {
//       try {
//         this.aborted = false
//         await this._start()
//       } catch (e) {
//         if (e === ErrNoAudioConsent) {
//           this.onerror(MicrophoneNotAllowedError)
//         } else {
//           this.onerror(SpeechRecognitionFailedError)
//         }
//       }
//     }

//     public stop = async (): Promise<void> => {
//       await this._stop()
//     }

//     public abort = async (): Promise<void> => {
//       this.aborted = true
//       await this._stop()
//     }

//     private readonly _start = async (): Promise<void> => {
//       if (this.transcribing) {
//         return
//       }

//       this.transcribing = true

//       const startTask = async (): Promise<void> => {
//         await this.microphone.initialize()
//         const { mediaStream } = this.microphone
//         if (mediaStream === null || mediaStream === undefined) {
//           throw ErrDeviceNotSupported
//         }
//         await this.client.attach(mediaStream)
//         await this.client.start()
//       }
//       await this.enqueueTask(startTask)
//     }

//     private readonly _stop = async (): Promise<void> => {
//       if (!this.transcribing) {
//         return
//       }

//       this.transcribing = false

//       const stopTask = async (): Promise<void> => {
//         try {
//           await this.client.stop()
//           await this.client.detach()
//           await this.microphone.close()
//           this.onend()
//         } catch (e) {
//           // swallow errors
//         }
//       }
//       await this.enqueueTask(stopTask)
//     }

//     private readonly enqueueTask = async (task: () => Promise<void>): Promise<void> => {
//       const queuedTask = async (): Promise<void> => {
//         // Wait for earlier task(s) to complete, effectively adding to a task queue
//         await this.taskQueue
//         await task()
//       }
//       this.taskQueue = queuedTask()

//       await this.taskQueue
//     }

//     private readonly handleResult = (segment: Segment): void => {
//       if (this.aborted) {
//         return
//       }
//       if (!this.interimResults && !segment.isFinal) {
//         return
//       }
//       const transcript = segment.words
//         .map(x => x.value)
//         .filter(x => x)
//         .join(' ')
//       const results: SpeechRecognitionResult[] = [
//         {
//           0: {
//             transcript,
//             confidence: 1,
//           },
//           isFinal: segment.isFinal,
//         },
//       ]
//       this.onresult({ results, resultIndex: 0 })
//       if (!this.continuous && segment.isFinal) {
//         this.abort().catch(() => {}) // swallow errors
//       }
//     }
//   }
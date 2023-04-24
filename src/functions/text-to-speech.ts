export async function speak(text: string, language: string) {
  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language
    speechSynthesis.speak(utterance)
    utterance.onend = () => {
      resolve(undefined)
    }
    utterance.onerror = (err) => {
      reject(err)
    }

    // looks like there is a bug in Chromium with long texts https://stackoverflow.com/a/57672147
    const interval = setInterval(() => {
      if (!speechSynthesis.speaking) {
        clearInterval(interval)
      } else {
        speechSynthesis.pause()
        speechSynthesis.resume()
      }
    }, 14000)
  })
}

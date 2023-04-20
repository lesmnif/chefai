export default function GetTimers(recipeSteps) {
  let times = []

  for (let i = 0; i < recipeSteps.length; i++) {
    let step = recipeSteps[i]
    let timeMatch = step.match(/\d+-\d*\s*(minutes|minute|min)/)

    if (timeMatch) {
      let time = timeMatch[0]
      let minutes = time.split("-")[0].trim()
      if (!times.includes(minutes + " minutes")) {
        times.push(minutes + " minutes")
      }
    } else {
      timeMatch = step.match(/\d*\s*(minutes|minute|min)/)
      if (timeMatch) {
        let time = timeMatch[0]
        let minutes = time.split(" ")[0].trim()
        if (!times.includes(minutes + " minutes")) {
          times.push(minutes + " minutes")
        }
      }
    }
  }
  return times
}

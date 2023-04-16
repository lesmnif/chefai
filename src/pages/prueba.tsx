import styles from "../styles/Home.module.css"
import { useState } from "react"

export default function Pruebita() {
  const [base64img, setBase64img] = useState("")
  const [prompt, setPrompt] = useState("")

  const fetchImage = async () => {
    console.log("what", prompt)
    const res = await fetch("/api/text-to-image", {
      method: "POST",
      body: JSON.stringify({
        prompt: prompt,
      }),
    })

    const data = await res.json()
    console.log("data", data)
    setBase64img(data.base64)
  }
  console.log("this si my r", prompt)
  return (
    <div className={styles.main}>
      <input
        value={prompt}
        placeholder="Enter your prompt"
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={() => fetchImage()}>send me</button>
      <button>Try me</button>
      <img src={"data:image/png;base64," + base64img} />
    </div>
  )
}

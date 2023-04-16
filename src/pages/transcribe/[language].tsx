import * as React from "react"

import styles from "../../styles/Home.module.css"
import { useRouter } from "next/router"
import dynamic from "next/dynamic"

const SpeechToText = dynamic(() => import("../../components/Transcriber"), {
  ssr: false,
})

export default function Receipt() {
  const router = useRouter()
  const { language } = router.query

  if (language && language !== "es-ES" && language !== "en-US") {
    return <div className={styles.main}> invalid route</div>
  }
  return language && <SpeechToText language={language} />
}

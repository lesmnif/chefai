import React from "react"
import { useTimer } from "use-timer"

export default function Timer({ timer }) {
  const { time, start, pause, reset, status } = useTimer({
    initialTime: timer,
    timerType: "DECREMENTAL",
  })
  console.log(status)
  return (
    <>
      <p onClick={status === "RUNNING" ? pause : start}>{time}</p>
      {status === "RUNNING" && <p>Running...</p>}
    </>
  )
}

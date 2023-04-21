import { useState, useEffect, useRef } from "react"

export default function Timer({ initialTime }) {
  const [time, setTime] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  const startTimer = () => {
    if (!isRunning && time > 0) {
      setIsRunning(true)
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime - 1)
      }, 1000)
    }
  }

  const pauseTimer = () => {
    if (isRunning) {
      setIsRunning(false)
      clearInterval(intervalRef.current)
    }
  }

  const resetTimer = () => {
    setIsRunning(false)
    clearInterval(intervalRef.current)
    setTime(initialTime)
  }

  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  return (
    <div>
      <div onClick={isRunning ? pauseTimer : startTimer}>{`${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}</div>
      <p 
      className=" border-t-2 border-red-600"
      onClick={resetTimer}>Reset</p>
    </div>
  )
}

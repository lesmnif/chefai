import { useState, useRef, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Timer({ time, toastId, language }) {
  const duration = time
  const [remainingTime, setRemainingTime] = useState(duration)
  const [isPaused, setIsPaused] = useState(false)
  const durationRef = useRef(duration)

  const handlePause = () => {
    setIsPaused(!isPaused)
  }

  const handleReset = () => {
    setIsPaused(true)
    setRemainingTime(duration)
  }

  const finish = () => {
    toast.dismiss(toastId)
    toast.success('Timer finished!')
  }

  const children = ({ remainingTime }) => {
    const minutes = Math.floor(remainingTime / 60)
    const seconds = remainingTime % 60

    // Use padStart to add a leading zero if needed
    const displayMinutes = minutes.toString().padStart(2, '0')
    const displaySeconds = seconds.toString().padStart(2, '0')

    return (
      <div className="font-bold">
        {displayMinutes}:{displaySeconds}
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <div className="justify-center text-center flex">
          <CountdownCircleTimer
            isPlaying={!isPaused}
            size={55}
            strokeWidth={3}
            children={children}
            duration={remainingTime}
            colors={['#004777', '#F7B801', '#A30000', '#A30000']}
            colorsTime={[7, 5, 2, 0]}
            onComplete={() => {
              // do your stuff here
              return finish() // repeat animation in 1.5 seconds
            }}
            key={remainingTime}
            // Update remaining time in state every second
            onTick={(time) => setRemainingTime(time)}
          />
        </div>
        <div className="flex items-center mt-4">
          <span className="isolate inline-flex rounded-md shadow-sm">
            <button
              type="button"
              className="relative inline-flex items-center rounded-l-md bg-white px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
              onClick={handlePause}
            >
              {isPaused ? (language === 'es' ? 'Reproducir' : 'Resume') : language === 'es' ? 'Pausa' : 'Pause'}
            </button>
            {/* <button
              type="button"
              className="relative -ml-px inline-flex items-center bg-white px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
              onClick={handleReset}
            >
              Reset
            </button> */}
            <button
              type="button"
              onClick={() => toast.dismiss(toastId)}
              className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
            >
              {language === 'es' ? 'Borrar' : 'Dismiss'}
            </button>
          </span>
        </div>
      </div>
    </div>
  )
}

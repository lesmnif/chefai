import Timer from "./Timer"

export default function TimersButtons({ timers }) {
  console.log("what", timers)
  const time = new Date()
  time.setSeconds(time.getSeconds() + 600) // 10 minutes timer
  return (
    <span className="isolate inline-flex rounded-md shadow-sm">
      {timers.map((timer, index) => {
        return (
          <button
            title="lmaoXD"
            key={index}
            type="button"
            className={
              index === 0 && !timers[index + 1]
                ? "relative inline-flex items-center rounded-l-md rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                : index === 0
                ? "relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                : !timers[index + 1]
                ? "relative inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                : "relative inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
            }
          >
            <Timer initialTime={timer * 60} />
          </button>
        )
      })}
    </span>
  )
}

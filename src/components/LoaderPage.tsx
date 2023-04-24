import { useState, CSSProperties } from "react"
import BounceLoader from "react-spinners/BounceLoader"

// const override: CSSProperties = {
//   display: "flex",
//   alignItems: "center",
//   alignSelf: "center",
//   margin: "0 auto",
//   borderColor: "blue",
// }

export default function App() {
  let [loading, setLoading] = useState(true)
  let [color, setColor] = useState("#412398")

  return (
    <div className="sweet-loading flex justify-center items-center h-screen">
        <BounceLoader
          color={color}
          loading={loading}
          // cssOverride={override}
          size={120}
          aria-label="Bounce Loader"
          data-testid="loader"
        />
    </div>
  )
}

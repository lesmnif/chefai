import React, { useEffect, useState } from 'react'
import ModalGettingRecipe from '../components/ModalGettingRecipe'

export default function Testing() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div>
      </div>
      <p onClick={() => setOpen(true)}>openitmag</p>
      <ModalGettingRecipe open={open} setOpen={setOpen} />
    </>
  )
}

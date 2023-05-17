import React, { useEffect, useState } from 'react'
import ModalRecipes from '../components/ModalRecipes'

export default function Testing() {
  const [input, setInput] = useState('')
  const [recipes, setRecipes] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  async function handleSubmitButton(query) {
    if (query.length < 5) {
      return alert(
        language === 'es-ES'
          ? 'Su solicitud debe tener al menos 5 caracteres.'
          : 'Your request must have at least 5 characters.'
      )
    }
    try {
      setRecipes([])
      setSelectedRecipe(null)
      const response = await fetch(`/api/testingStream?query=${query}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
        }),
      })
      setOpen(true)
      const reader = response.body.getReader() // Create a readable stream reader

      let chunk = ''
      let lines = []

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        chunk += new TextDecoder().decode(value)

        // Check if the chunk contains a complete line
        while (chunk.includes('\n')) {
          const index = chunk.indexOf('\n')
          const line = chunk.slice(0, index)
          chunk = chunk.slice(index + 1)

          // Parse the line and update the state with the new recipe
          if (/^\d+\.\s/.test(line)) {
            const recipeData = line.match(/^(\d+)\.\s(.*)\s-\s(.*)$/)

            if (recipeData && recipeData.length === 4) {
              const recipe = {
                recipeName: recipeData[2],
                cookingTime: recipeData[3],
              }

              setRecipes((prevRecipes) => [...prevRecipes, recipe])
            }
          }
        }
      }
    } catch (error) {
      // Handle the error
      console.log(error.message)
    }
  }

  useEffect(() => {
    console.log('recipes', recipes)
  }, [recipes])

  return (
    <>
      <div>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={() => handleSubmitButton(input)}>fetch me ma g</button>
      </div>
      <p onClick={() => setOpen(true)}>openitmag</p>
      <ModalRecipes
        open={open}
        setOpen={setOpen}
        selectedRecipe={selectedRecipe}
        setSelectedRecipe={setSelectedRecipe}
        recipes={recipes}
        language={'es-ES'}
      />
    </>
  )
}

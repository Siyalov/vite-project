import { useState, useEffect } from 'react'


import './App.css'

const SIZE = 34;
function App() {
  
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  useEffect( () => {
    window.addEventListener('mousemove', (event)=> {
      setX(event.x)
      setY(event.y)
    })
  },[])
  return (
    <>
     {x},
     {y} 
      <div style={{position:'absolute', left: x-SIZE/2, top: y-SIZE/2, width: SIZE, height: SIZE, backgroundColor: 'black'}}>

      </div>
    </>
  )
}

export default App

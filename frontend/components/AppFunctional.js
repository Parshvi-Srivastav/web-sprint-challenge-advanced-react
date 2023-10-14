import React, { useState, useEffect } from 'react'

// Suggested initial states
const initialValues = {
message: '',
email: '',
steps: 0,
index: 4 // the index the "B" is at
}
export default function AppFunctional(props) {
  const [values, setValues] = useState(initialValues)
  const [currentIdx, setCurrentIdx] = useState(4)
  const theGrid = Array(9).fill(null);
  theGrid[initialValues.index] = 'B'
  const [coordinates, setCoordinates] = useState(
    [
    '1,1', '2,1', '3,1', 
    '2,1', '2,2', '2,3', 
    '3,1', '3,2', '3,3'
    ]);

  
    
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  function getXY() {

    return coordinates[currentIdx]
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    return `Coordinates (${getXY()})`
  }
  

  function reset() {
   setCurrentIdx(initialValues.index)
    // Use this helper to reset all states to their initial values.
  }

  
  function getNextIndex(direction) {
    
      switch (direction) {
        case 'left': 
          setCurrentIdx(currentIdx => currentIdx > 0 ? currentIdx - 1 : currentIdx)
          
          break; 
  
        case 'right':
          setCurrentIdx(currentIdx => currentIdx < theGrid.length - 1 ? currentIdx + 1 : currentIdx);

          break;
  
        case 'up':       
          setCurrentIdx(currentIdx => currentIdx >= 3 ? currentIdx - 3 : currentIdx);
          
          break;
        
        case 'down': 
          setCurrentIdx(currentIdx => currentIdx <= 6 ? currentIdx + 3 : currentIdx );

            break;
  
        default: 
          break;

    }
    

    
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  function onChange(evt) {
   const { value } = evt.target 
   setValues(value)
   

    // You will need this to update the value of the input.
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved 0 times</h3>
      </div>
      <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === currentIdx ? ' active' : ''}`}>
                {idx === currentIdx ? 'B' : null}
              </div>
            ))
          }
    
      </div>
      <div className="info">
        <h3 id="message"></h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => getNextIndex('left')}>LEFT</button>
        <button id="up" onClick={() => getNextIndex('up')}>UP</button>
        <button id="right" onClick={() => getNextIndex('right')}>RIGHT</button>
        <button id="down" onClick={() => getNextIndex('down')}>DOWN</button>
        <button id="reset" onClick={() => reset()}>reset</button>
      </div>
      <form>
        <input onChange={onChange} id="email" type="email" placeholder="type email"></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}

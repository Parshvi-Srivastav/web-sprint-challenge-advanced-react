import React from 'react';
import axios from 'axios';

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

const errorMsgs = {
  right: "You can't go right",
  left: "You can't go left",
  up: "You can't go up",
  down: "You can't go down",
 }

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor(props) {
    super(props);
    this.state = {
      errMessages: initialState.message,
      successMessage: initialState.message,
      currentIdx: initialState.index,
      inputValue: initialState.email,
      steps: initialState.steps,
      coordinates: [
        '1,1', '2,1', '3,1', 
        '1,2', '2,2', '3,2', 
        '1,3', '2,3', '3,3' 
      ]
    }
    const theGrid = Array(9).fill(null);
    theGrid[4] = 'B';

    
  }
  

  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
      const xyOfB = this.state.coordinates[this.state.currentIdx]
    
    return xyOfB
  };
  

  getXYMessage = () => {
    // It is not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    
   return `Coordinates (${this.getXY()})`
  }

  reset = () => {
    this.setState({
      errMessages: initialState.message,
      successMessage: initialState.message,
      currentIdx: initialState.index,
      inputValue: initialState.email,
      steps: initialState.steps,
    })
    // Use this helper to reset all states to their initial values.
  }

  getNextIndex = (direction) => {
    this.setState({ successMsg: '' });

    switch(direction){
      case 'left':
        this.setState((prevState => ({
          currentIdx: prevState.currentIdx % 3 !== 0 ? prevState.currentIdx - 1 : prevState.currentIdx, 
        })));
        if (this.state.currentIdx === 0 || this.state.currentIdx === 3 || this.state.currentIdx === 6) {
          this.setState({ errMessages: errorMsgs.left });
        } else {
          this.setState({ errMessages: ''})
        }
      break;

      case 'right':
        this.setState((prevState) => ({
          currentIdx: prevState.currentIdx % 3 !== 2 ? prevState.currentIdx + 1 : prevState.currentIdx,
        }));
        if (this.state.currentIdx === 2 || this.state.currentIdx === 5 || this.state.currentIdx === 8) {
          this.setState({ errMessages: errorMsgs.right})
        } else {
          this.setState({ errMessages: '' })
        }
        break;

        case 'up':
          this.setState((prevState) => ({
            currentIdx: prevState.currentIdx >= 3 ? prevState.currentIdx - 3 : prevState.currentIdx,
          }));
          if (this.state.currentIdx === 0 || this.state.currentIdx === 1 || this.state.currentIdx === 2) {
            this.setState({ errMessages: errorMsgs.up })
          } else {
            this.setState({ errMessages: ''})
          }
          break;

        case 'down': 
          this.setState((prevState) => ({
            currentIdx: prevState.currentIdx < 6 ? prevState.currentIdx + 3 : prevState.currentIdx,
          }));
          if (this.state.currentIdx === 6 || this.state.currentIdx === 7 || this.state.currentIdx === 8) {
            this.setState({ errMessages: errorMsgs.down })
          } else {
            this.setState({ errMessages: '' })
          }
          break;

          default:
            break;

    }
      
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  onChange = (evt) => {
    const newInput = evt.target.value;
    this.setState({ inputValue: newInput });
    // You will need this to update the value of the input.
  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    if (this.state.inputValue === '') {
      this.setState({errMessages:'Ouch: email is required'})
    }
    axios
      .post('http://localhost:9000/api/result', {
        "x": (this.state.currentIdx % 3) + 1,
        "y": Math.floor(this.state.currentIdx / 3) + 1,
        steps: this.state.steps,
        email: this.state.inputValue,
      })
      .then((response) => {
        this.setState({ successMessage: response.data.message });
        this.setState({ inputValue: initialEmail})
        console.log(response.data.message)
      })
      .catch((err) => console.error(err));
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentIdx !== initialState.index && this.state.currentIdx !== prevState.currentIdx) {
      this.setState((prevState) => ({ steps: prevState.steps + 1 }), () => {

      });
    }
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">
            {`You moved ${this.state.steps} ${this.state.steps === 1 ? 'time' : 'times'}`}
          </h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.currentIdx ? ' active' : ''}`}>
                {idx === this.state.currentIdx ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.errMessages || this.state.successMessage}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={() => this.getNextIndex('left')}>LEFT</button>
          <button id="up" onClick={() => this.getNextIndex('up')}>UP</button>
          <button id="right" onClick={() => this.getNextIndex('right')}>RIGHT</button>
          <button id="down" onClick={() => this.getNextIndex('down')}>DOWN</button>
          <button id="reset" onClick={() => this.reset()}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            onChange={this.onChange} 
            id="email" 
            type="email" 
            placeholder="type email"
            value={this.state.inputValue}
          >
          </input>
          <input 
            id="submit" 
            type="submit"
          >
          </input>
        </form>
      </div>
    )}
}


import './App.css';
import React from 'react';
import GMap from './Map';

class App extends React.Component {
  render(){
    return (
      <div className="App">
        <div className="App-body">
          <h1>
            AquaTracker
          </h1>
          <GMap/>
        </div>
      </div>
    );
  }
}

export default App;

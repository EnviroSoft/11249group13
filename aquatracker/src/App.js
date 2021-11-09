import './App.css';
import React from 'react';
import GMap from './Map';

class App extends React.Component {
  render(){
    return (
      <div className="App">
        <div className="App-body">
        <header>
            <h1>AquaTracker</h1>
        </header>
        <nav id="nav_menu">
            <ul>
                <li> <a href="" class="current">Home</a>
                </li>
                <li> <a href="">Settings</a>
                </li>
                <li> <a href="">Help</a>
                </li>
                <li> <a href="">Login</a>
                </li>
            </ul>
        </nav>
        <h2>
            Water Quality Data Locations
          </h2>
          <GMap/>
        </div>
      </div>
    );
  }
}

export default App;

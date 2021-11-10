import './App.css';
import React from 'react';
import GMap from './Map';
import TestBox from './TestBox';

const MAP_LOADED = 'Map Loaded'
const SITE_DATA_RECEIVED = 'USGS Site Data Received'
const MARKERS_LOADED = 'Markers Loaded'
const BOUNDS_VISIBLE = 'Florida Bounds Visible'

class App extends React.Component {
  constructor(props){
    super(props)

    this.testing = (process.env.REACT_APP_TESTING === 'true')

    let tests = {}
    tests[MAP_LOADED] = false
    tests[SITE_DATA_RECEIVED] = false
    tests[MARKERS_LOADED] = false
    tests[BOUNDS_VISIBLE] = false

    this.state = {
      tests: tests
    }
  }

  passTest = (test) => {
    let tests = this.state.tests
    tests[test] = true
    this.setState({tests: tests})
  }

  render() {
    let testBoxes = []
    if(this.testing){
      for (let test in this.state.tests){
        testBoxes.push(
          <TestBox testName={test} passed={this.state.tests[test]}/>
        )
      }
    }
    return (
      <div className="App">
        <div className="App-body">
          <h1>
            AquaTracker
          </h1>
          <GMap
            onMapLoaded={(this.testing && !this.state.tests[MAP_LOADED]) ? ()=>{
              this.passTest(MAP_LOADED)
            } : null}
            onSiteDataReceived={(this.testing && !this.state.tests[SITE_DATA_RECEIVED]) ? ()=>{
              this.passTest(SITE_DATA_RECEIVED)
            } : null}
            onMarkersLoaded={(this.testing && !this.state.tests[MARKERS_LOADED]) ? ()=>{
              this.passTest(MARKERS_LOADED)
            } : null}
            onBoundsCheckPassed={(this.testing && !this.state.tests[BOUNDS_VISIBLE]) ? ()=>{
              this.passTest(BOUNDS_VISIBLE)
            } : null}
          />
          <div style={{height:'5px'}}/>
          {testBoxes}
        </div>
      </div>
    );
  }
}

export default App;

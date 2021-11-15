import './App.css';
import React from 'react';
import GMap from './Map';
import TestBox from './TestBox';
import { Login } from './Login';
import { Help } from './Help';
import { Settings } from './Settings';

const MAP_LOADED = 'Map Loaded'
const SITE_DATA_RECEIVED = 'USGS Site Data Received'
const MARKERS_LOADED = 'Markers Loaded'
const BOUNDS_VISIBLE = 'Florida Bounds Visible'

const HOME = 'HOME'
const SETTINGS = 'SETTINGS'
const HELP = 'HELP'
const LOGIN = 'LOGIN'

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
      tests: tests,
      section: HOME
    }
  }

  passTest = (test) => {
    let tests = this.state.tests
    tests[test] = true
    this.setState({tests: tests})
  }

  render() {
    let sectionElements = []
    if(this.state.section == HOME){
      sectionElements.push(
        <h2>
            Water Quality Data Locations
        </h2>
      )
      sectionElements.push(
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
      )
      sectionElements.push(
        <div style={{height:'5px'}}/>
      )
      if(this.testing){
        for (let test in this.state.tests){
          sectionElements.push(
            <TestBox testName={test} passed={this.state.tests[test]}/>
          )
        }
      }
    } else if (this.state.section == SETTINGS){
      sectionElements.push(
        <Settings></Settings>
      )
    } else if (this.state.section == HELP){
      sectionElements.push(
        <Help></Help>
      )
    } else if (this.state.section == LOGIN){
      sectionElements.push(
        <Login></Login>
      )
    }
    console.log(this.state.section)
    return (
      <div className="App">
        <div className="App-body">
        <header>
            <h1>AquaTracker</h1>
        </header>
        <nav id="nav_menu">
            <ul>
                <li> <a onClick={() => {this.setState({section: HOME})}} class={this.state.section == HOME ? "current" : ""}>Home</a>
                </li>
                <li> <a onClick={() => {this.setState({section: SETTINGS})}} class={this.state.section == SETTINGS ? "current" : ""}>Settings</a>
                </li>
                <li> <a onClick={() => {this.setState({section: HELP})}} class={this.state.section == HELP ? "current" : ""}>Help</a>
                </li>
                <li> <a onClick={() => {this.setState({section: LOGIN})}} class={this.state.section == LOGIN ? "current" : ""}>Login</a>
                </li>
            </ul>
        </nav>
        {sectionElements}
        </div>
      </div>
    );
  }
}

export default App;

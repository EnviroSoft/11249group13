import React from 'react';
import './Settings.css'

export class Settings extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            
        }
    }

    render = () => {
        return (
            <div>
                <h2>Settings</h2>
                <br></br>

                <div class="border">
                    <div class="sliderWrapper">
                        <div>Temperature&nbsp;&nbsp;</div>
                        <label class="switch">
                            <input type="checkbox" checked/>
                            <span class="slider round"></span>
                        </label>
                    </div>

                    <br></br>
                    <div class="sliderWrapper">
                        <div>pH Levels&nbsp;&nbsp;</div>
                        <label class="switch">
                            <input type="checkbox"/>
                            <span class="slider round"></span>
                        </label>
                    </div>

                    <br></br>
                    <div class="sliderWrapper">
                        <div>Graphs&nbsp;&nbsp;</div>
                        <label class="switch">
                            <input type="checkbox" checked/>
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </div>
        );
    }
}
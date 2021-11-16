import React from 'react';
import './Help.css'

export class Help extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            
        }
    }

    render = () => {
        return (
            <div>
                <h2>Help</h2>
                <br></br>
                <p> For issues with AquaTracker please email us at 
                    <span style={{color: 'rgb(19, 172, 138)'}}>
                        <b> help@AquaTracker.org </b> 
                    </span>
                    or give us a call at 
                    <span style={{color: 'rgb(19, 172, 138)'}}>
                        <b> 1-800-AQUATRACKER</b>
                    </span>    
                .</p>
                    
            </div>
        );
    }
}
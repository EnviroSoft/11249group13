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
                <p> For issues with AquaTracker please email us at <b>help@AquaTracker.org</b>  or give us a call at <b>1-800-AQUATRACKER</b>.</p>
            </div>
        );
    }
}
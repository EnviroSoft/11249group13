import React from 'react';

class TestBox extends React.Component{
    render(){
        return (
            <div style={{width: '50vmin', height: '30px', backgroundClip: 'content-box', backgroundColor: this.props.passed ? 'green' : 'red', margin: 'auto', padding: '3px'}}>
                {this.props.testName}
            </div>
        )
    }
}

export default TestBox
import React from 'react';
import './Login.css'

export class Login extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            
        }
    }

    

    render = () => {
        return (
            <form action="action_page.php">
                <div class="container">
                    <h1>Welcome Back</h1>
                    <p>Please enter your email and password to sign in.</p>
                    <hr></hr>
                    <br></br>

                    <label for="email"><b>Email</b></label>
                    <input type="text" placeholder="Enter Email" name="email" id="email" required/>

                    <label for="psw"><b>Password</b></label>
                    <input type="password" placeholder="Enter Password" name="psw" id="psw" required/>


                    <button type="submit" class="registerbtn">Login</button>
                    <p>By signing into your account you agree to our <a href="#">Terms & Privacy</a>.</p>

                </div>
            </form>
       
        );
    }
}
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useRef } from "react";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const nameInput = useRef(null);
    const emailInput = useRef(null);
    const passwordInput = useRef(null);

  async function registerUser(e) {
    e.preventDefault();
    try {
        const response = await axios.post("/register", {
            name,
            email,
            password,
        });

        if (response.status === 201) {
            alert("Registration successful, Now you can login");
        } else {
            alert("Registration failed, please try again");
        }

        nameInput.current.value = "";
        emailInput.current.value = "";
        passwordInput.current.value = "";
    } catch(err) {
        console.error(err);
        alert("Registration failed, please try again");
    }
}
    return(
        <div className="flex items-center justify-center grow h-screen">
            <div className="-mt-32 p-4 sm:p-6 md:p-8"> 
                <h1 className="text-4xl text-center mb-4 sm:mb-6 md:mb-8">Register</h1>
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    <input type="text" 
                        placeholder="John Doe"
                        name="name"  
                        value={name} 
                        ref={nameInput}
                        onChange={e => setName(e.target.value)} className="name"/>
                    
                    <input type="email" 
                        placeholder="your@email.com" 
                        name="email"
                        value={email} 
                        ref={emailInput}
                        onChange={e => setEmail(e.target.value)}/>
                    
                    <input type="password" 
                        placeholder="password"
                        name="password"
                        value={password}
                        ref={passwordInput} 
                        onChange={ e => setPassword(e.target.value)}/>
                    
                    <button className="primary">Register</button>
                    <div className="p-2 text-center">
                        Already have an account, <Link to="/login">
                        <span className="text-primary underline font-medium">Login</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
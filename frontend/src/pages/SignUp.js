import React, { useEffect, useState } from "react";
import Navigation from '../components/Navigation';
import {
    useNavigate
} from "react-router-dom";
import axios from "axios";
import Logo from '../components/Logo';



const SignUp = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const navigate = useNavigate();


    const HandleSignUp = (e) => {
        e.preventDefault();
        if (username.length < 3) {
            setError(true);
        } else {
            axios.post("http://localhost:3008/api/auth/signup", {
                username: username,
                email: email,
                password: password
            });
            setError(false);
            setUsername("");
            setPassword("");
            setEmail("");
            navigate(`/login`);
        }
    };



    return (
        <div>
            <Logo />
            <Navigation />
            <form onSubmit={(e) => HandleSignUp(e)}>
                <label>
                    Adresse e-mail :
                    <input
                        type="email"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </label>
                <label>
                    Nom d'utilisateur :
                    <input
                        type="text"
                        name="username"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    />
                </label>
                <label>
                    Mot de passe :
                    <input
                        type="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </label>
                {error && <p>Veuillez écrire un minimum de 3 caractères</p>}
                <input type="submit" value="S'enregister" />
            </form>
        </div>

    );
};


export default SignUp;
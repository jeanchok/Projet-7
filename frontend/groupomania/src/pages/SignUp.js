import React, { useState } from "react";
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


        axios.post("http://localhost:3008/api/auth/signup", {
            username: username,
            email: email,
            password: password
        })
            .then(() => {
                setError(false);
                setUsername("");
                setPassword("");
                setEmail("");
                navigate(`/login`)
            })
            .catch(() => {
                setError(true);
            }
            )


    };




    return (
        <div className="forum-container">
            <header>
                <Logo />
                <Navigation />
            </header>

            <form className="homeForm" onSubmit={(e) => HandleSignUp(e)}>
                <h1 className="hometitle">Inscription</h1>
                <label className="homeForm__label">
                    <h2>Adresse e-mail :</h2>
                    <input
                        type="email"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                        required
                    />
                </label>
                <label className="homeForm__label">
                    <h2>Nom d'utilisateur :</h2>
                    <input
                        type="text"
                        name="username"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        required
                        minLength={3}
                        pattern="[a-zA-Z0-9éèêôöïà]*"
                    />
                </label>
                <label className="homeForm__label">
                    <h2>Mot de passe :</h2>
                    <input
                        type="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                        minLength={8}
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Doit contenir au minimum 8 caractères, un chiffre, une majuscule et une minuscule"
                    />
                </label>
                {error && <p>Veuillez choisir un nom d'utilisateur et une adresse e-mail unique.</p>}
                <input className="homeSubmit" type="submit" value="S'enregister" />
            </form>
        </div>

    );
};


export default SignUp;
import React, { useState } from "react";
import Navigation from '../components/Navigation';
import Logo from '../components/Logo';
import axios from "axios";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Login
    const HandleLogin = (e) => {
        e.preventDefault();
        axios
            .post('http://localhost:3008/api/auth/login', {
                username: username,
                password: password
            })
            .catch((error) => {
                console.log(`Erreur : ` + error);
                if (error.response.status === 401) {
                    setErrorMessage("Votre mot de passe ou votre nom d'utilisateur est incorrect");
                }
                if (error.response.status === 400) {
                    setErrorMessage("Votre mot de passe ou votre nom d'utilisateur est incorrect");
                }
                if (error.response.status === 500) {
                    setErrorMessage("Une erreur est survenue, veuillez réessayer plus tard");
                }
                if (error.response.status === 404) {
                    setErrorMessage("Une erreur est survenue, veuillez réessayer plus tard");
                }
                if (error.response.status === 429) {
                    setErrorMessage("Trop de tentatives de connexion. Veuillez réessayer dans quelques minutes");
                }

            })
            .then((res) => {
                if (!res) {
                    window.location.reload();
                } else {

                    sessionStorage.setItem('token', res.data.token);
                    sessionStorage.setItem('userId', res.data.userId);
                    sessionStorage.setItem('isAdmin', res.data.isAdmin);
                    window.location.href = "/groupomania";
                }

            })

    }


    return (
        <div className="forum-container">
            <header>
                <Logo />
                <Navigation />
            </header>
            <form className="homeForm" onSubmit={(e) => HandleLogin(e)}>
                <h1 className="hometitle">Connexion</h1>
                <label className="homeForm__label">
                    <h2>Nom d'utilisateur :</h2>
                    <input
                        type="text"
                        name="username"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    />
                </label>
                <label className="homeForm__label">
                    <h2>Mot de passe :</h2>

                    <input
                        type="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </label>
                <input className="homeSubmit" type="submit" value="Se connecter" />
                <h4 className="errorMessage">{errorMessage}</h4>
            </form>
        </div>

    );
};

export default Login;
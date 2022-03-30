import React, { useEffect, useState } from "react";
import Navigation from '../components/Navigation';
import Logo from '../components/Logo';
import {
    useNavigate
} from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [jwt, setJwt] = useState("");
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const HandleLogin = (e) => {
        e.preventDefault();
        axios
            .post('http://localhost:3008/api/auth/login', {
                username: username,
                password: password
            })
            .catch((error) => console.log(`Erreur : ` + error))
            .then((res) => {
                if (!res) {
                    window.location.reload();
                } else {

                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('userId', res.data.userId);
                    localStorage.setItem('isAdmin', res.data.isAdmin);
                    setJwt(res.data.token);
                    window.location.href = "/groupomania";
                }

            })
    }


    return (
        <div>
            <Logo />
            <Navigation />
            <form onSubmit={(e) => HandleLogin(e)}>
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
                <input type="submit" value="Se connecter" />
            </form>
        </div>

    );
};

export default Login;
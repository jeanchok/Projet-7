import React, { useEffect, useState } from "react";
import axios from "axios";
import Logo from "../components/Logo";
import Navigation2 from "../components/Navigation2";


const User = () => {
    const storedJwt = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const [email, setEmail] = useState("");
    const [editEmail, seteditEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [userData, setuserData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isMailEditing, setIsMailEditing] = useState(false);
    const [isPasswordEditing, setIsPasswordEditing] = useState(false);
    const [isUsernameEditing, setIsUsernameEditing] = useState(false);

    const handleDelete = () => {
        axios.delete("http://localhost:3008/api/auth/delete/" + userId, {
            headers: {
                'Authorization': `Bearer ${storedJwt}`
            }
        })
            .then(() => window.location.href = "/")

    }
    useEffect(() => getDataUser(), []);

    const getDataUser = () => {
        axios
            .get("http://localhost:3008/api/auth/" + userId, {
                headers: {
                    'Authorization': `Bearer ${storedJwt}`,
                }
            })
            .then((res) =>
                setuserData(res.data))
            .catch((err) => {
                console.error(err)
            })
    };


    const HandleUpdate = (e) => {
        e.preventDefault();
        if (username.length < 3) {
            setError(true);
        } else {
            axios.put("http://localhost:3008/api/auth/" + userId, {
                username: username,
                email: email,
                password: password
            },
                {
                    headers: {
                        'Authorization': `Bearer ${storedJwt}`,
                    }
                });
            setError(false);
            setIsMailEditing("");
            setPassword("");
            setEmail("");
        }
    };

    const HandleEmailUpdate = (e) => {
        e.preventDefault();
        if (email.length < 3) {
            setError(true);
        } else {
            axios
                .put("http://localhost:3008/api/auth/email/" + userId,
                    { email: email },

                    {
                        headers: {
                            'Authorization': `Bearer ${storedJwt}`,
                        }
                    })
                .then(() => {
                    setError(false);
                    seteditEmail(email);
                    setIsMailEditing(false);
                    getDataUser();

                })
                .catch((err) => {
                    console.error(err);
                    console.log("ici")
                })
        }
    };

    const HandleUsernameUpdate = (e) => {
        e.preventDefault();
        if (username.length < 3) {
            setError(true);
        } else {
            axios.put("http://localhost:3008/api/auth/username/" + userId, {
                email: email
            },
                {
                    headers: {
                        'Authorization': `Bearer ${storedJwt}`,
                    }
                });
            setError(false);
            setIsUsernameEditing(false);

        }
    };

    const HandlePasswordUpdate = (e) => {
        e.preventDefault();
        if (username.length < 3) {
            setError(true);
        } else {
            axios.put("http://localhost:3008/api/auth/password/" + userId, {
                email: email
            },
                {
                    headers: {
                        'Authorization': `Bearer ${storedJwt}`,
                    }
                });
            setError(false);
            setIsPasswordEditing(false);
        }
    };


    return (

        <div>
            <Logo />
            <Navigation2 />
            <h1>Mon compte</h1>
            <button onClick={() => {
                if (
                    window.confirm("Voulez-vous vraiment supprimer votre compte ?")
                ) {
                    handleDelete();
                }
            }}>Supprimer mon compte</button>

            <div className="user-container">
                <div className="user-container-left">
                    <h2>Informations personnelles</h2>
                    <h3>Adresse email :</h3>
                    {isMailEditing ? (
                        <div>
                            <p>{userData.email}</p>
                            <form onSubmit={(e) => HandleEmailUpdate(e)}>
                                <label>
                                    <input
                                        type="email"
                                        name="email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                    />
                                </label>
                                <input type="submit" value="Enregister" />
                            </form>
                        </div>) : (<p>{editEmail ? editEmail : userData.email}</p>)}
                    <button onClick={() => setIsMailEditing(!isMailEditing)}>Modifier mon adresse email</button>
                    <h3>Nom d'utilisateur :</h3>
                    {isUsernameEditing ? (
                        <div>
                            <p>{userData.username}</p>
                            <form onSubmit={(e) => HandleUsernameUpdate(e)}>
                                <label>
                                    <input
                                        type="text"
                                        name="username"
                                        onChange={(e) => setUsername(e.target.value)}
                                        value={username}
                                    />
                                </label>
                                <input type="submit" value="Enregister" />
                            </form>
                        </div>) : (<p>{userData.username}</p>)}
                    <button onClick={() => setIsUsernameEditing(!isUsernameEditing)}>Modifier mon nom d'utilisateur</button>
                    <h3>Mot de passe :</h3>
                    {isPasswordEditing ? (
                        <div>
                            <form onSubmit={(e) => HandlePasswordUpdate(e)}>
                                <label>
                                    <input

                                        type="password"
                                        name="password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                    />
                                </label>

                                <input type="submit" value="Enregister" />
                            </form>
                        </div>) : (<p></p>)}
                    <button onClick={() => setIsPasswordEditing(!isPasswordEditing)}>Modifier mon mot de passe</button>
                </div>
            </div>


            )



        </div>
    );
};

export default User;
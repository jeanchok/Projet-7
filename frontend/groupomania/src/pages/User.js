import React, { useEffect, useState } from "react";
import axios from "axios";
import Logo from "../components/Logo";
import Navigation2 from "../components/Navigation2";


const User = () => {
    const storedJwt = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('userId');
    const [email, setEmail] = useState("");
    const [fileToUpload, setFileToUpload] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorUsername, setErrorUsername] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorAttachment, setErrorAttachment] = useState(false);
    const [userData, setuserData] = useState([]);
    const [isPictureEditing, setIsPictureEditing] = useState(false);
    const [isMailEditing, setIsMailEditing] = useState(false);
    const [isPasswordEditing, setIsPasswordEditing] = useState(false);
    const [isUsernameEditing, setIsUsernameEditing] = useState(false);

    // Delete user account
    const handleDelete = () => {
        axios.delete("http://localhost:3008/api/auth/delete/" + userId, {
            headers: {
                'Authorization': `Bearer ${storedJwt}`
            }
        })
            .then(() => window.location.href = "/")

    };
    useEffect(() => getDataUser(), []);

    // Get user data
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

    // Update user Avatar
    const HandlePictureUpdate = (e) => {
        const MIME_TYPES = ["image/png", "image/jpeg", "image/jpg"];

        if (fileToUpload && !MIME_TYPES.includes(fileToUpload.type)) {
            setErrorAttachment(true);
            setFileToUpload(null);
            return;
        }

        const userAttachement = new FormData();
        userAttachement.append("attachment", fileToUpload);

        axios
            .put("http://localhost:3008/api/auth/avatar/" + userId,
                userAttachement,
                {
                    headers: {
                        'Authorization': `Bearer ${storedJwt}`,
                    }
                })
            .then((res) => {
                setErrorAttachment(false);
                setuserData({ ...userData, attachment: res.data.newAttachment });
                setIsPictureEditing(false);
                setFileToUpload(null);
            })
            .catch((err) => {
                setErrorAttachment(true);
                console.error(err);
            })
    };

    // Update user mail
    const HandleEmailUpdate = (e) => {
        e.preventDefault();
        axios
            .put("http://localhost:3008/api/auth/email/" + userId,
                { email: email },

                {
                    headers: {
                        'Authorization': `Bearer ${storedJwt}`,
                    }
                })
            .then((res) => {
                setErrorEmail(false);
                console.log(res);
                setuserData({ ...userData, email: res.data.email });
                setIsMailEditing(false);

            })
            .catch((err) => {
                console.error(err);
                setErrorEmail(true);
            })
    };

    // Update user name
    const HandleUsernameUpdate = (e) => {
        e.preventDefault();
        axios.put("http://localhost:3008/api/auth/username/" + userId, {
            username: username
        },
            {
                headers: {
                    'Authorization': `Bearer ${storedJwt}`,
                }
            })
            .then((res) => {
                setErrorUsername(false);
                setIsUsernameEditing(false);
                setuserData({ ...userData, username: res.data.username });
            })
            .catch((err) => {
                console.error(err);
                setErrorUsername(true);
            })
    };


    // Update user password
    const HandlePasswordUpdate = (e) => {
        e.preventDefault();
        axios.put("http://localhost:3008/api/auth/password/" + userId, {
            password: password
        },
            {
                headers: {
                    'Authorization': `Bearer ${storedJwt}`,
                }
            })
            .then(() => {
                setErrorPassword(false);
                console.log("Mot de passe changé");
                setIsPasswordEditing(false);
            })
            .catch((err) => {
                console.error(err);
                setErrorPassword(true);
            })
    };

    return (

        <div className="forum-container">
            <header>
                <Logo />
                <Navigation2 />
            </header>
            <div className="user-header">
                <h1>Mon compte</h1>
                <button onClick={() => {
                    if (
                        window.confirm("Voulez-vous vraiment supprimer votre compte ?")
                    ) {
                        handleDelete();
                    }
                }}>Supprimer mon compte</button>
            </div>
            <div className="user-container">
                <div className="user-container-left">
                    <h2>Informations personnelles</h2>
                    <div className="user-container__box">
                        <h3>Photo de profil :</h3>
                        <div className="user-container__box--info">
                            {isPictureEditing ? (
                                <div className="user-container__box--infoSubDiv">
                                    <div className="userImage__container">
                                        <img className="userImage__container--avatar" src={userData.attachment} alt="avatar" />
                                    </div>

                                    <div className="forum-container__Form--box userLabel">
                                        <input className="forum-container__Form--file userLabel"
                                            type="file"
                                            name="fileToUpload"
                                            onChange={(e) => setFileToUpload(e.target.files[0])}
                                        />

                                        <label className="forum-container__Form--label" htmlFor="file">
                                            <svg className="forum-container__Form--labelIcone" xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path></svg>
                                            {fileToUpload ? <span>Fichier choisit : {fileToUpload.name}</span> : <span>Choisir un fichier</span>}
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div className="userImage__container">
                                    <img className="userImage__container--avatar" src={userData.attachment} alt="avatar" />
                                </div>
                            )}
                        </div>

                        {isPictureEditing ?
                            <div className="user-container__box--edit">
                                {fileToUpload ? <button onClick={() => HandlePictureUpdate()}>Valider</button> : null}
                                <button onClick={() => {
                                    setIsPictureEditing(!isPictureEditing);
                                    setErrorAttachment(false);
                                }}>Annuler</button>
                            </div> :
                            <button onClick={() => setIsPictureEditing(!isPictureEditing)}>Modifier</button>
                        }
                    </div>
                    {errorAttachment && <p>Veuillez choisir une image au format PNG, JPEG ou JPG.</p>}
                    <div className="user-container__box">
                        <h3>Adresse email :</h3>
                        <div className="user-container__box--info">
                            {isMailEditing ? (
                                <div>
                                    <p>{userData.email}</p>
                                    <form>
                                        <label>
                                            <input
                                                type="email"
                                                name="email"
                                                onChange={(e) => setEmail(e.target.value)}
                                                value={email}
                                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                                required
                                            />
                                        </label>
                                    </form>
                                </div>) : (<p>{userData.email}</p>)}
                        </div>
                        {isMailEditing ?
                            <div className="user-container__box--edit">
                                {email ? <button onClick={(e) => HandleEmailUpdate(e)}>Valider</button> : null}
                                <button onClick={() => {
                                    setIsMailEditing(!isMailEditing);
                                    setErrorEmail(false);
                                }}>Annuler</button>
                            </div> :
                            <button onClick={() => setIsMailEditing(!isMailEditing)}>Modifier</button>
                        }
                    </div>
                    {errorEmail && <p>Veuillez choisir une adresse e-mail unique.</p>}
                    <div className="user-container__box">
                        <h3>Nom d'utilisateur :</h3>
                        <div className="user-container__box--info">
                            {isUsernameEditing ? (
                                <div>
                                    <p>{userData.username}</p>
                                    <form>
                                        <label>
                                            <input
                                                type="text"
                                                name="username"
                                                onChange={(e) => setUsername(e.target.value)}
                                                value={username}
                                                minLength={3}
                                                pattern="[a-zA-Z0-9éèêôöïà]*"
                                                required
                                            />
                                        </label>
                                    </form>
                                </div>) : (<p>{userData.username}</p>)}
                        </div>
                        {isUsernameEditing ?
                            <div className="user-container__box--edit">
                                {username ? <button onClick={(e) => HandleUsernameUpdate(e)}>Valider</button> : null}
                                <button onClick={() => {
                                    setIsUsernameEditing(!isUsernameEditing);
                                    setErrorUsername(false);
                                }}>Annuler</button>
                            </div> :
                            <button onClick={() => setIsUsernameEditing(!isUsernameEditing)}>Modifier</button>
                        }
                    </div>
                    {errorUsername && <p>Veuillez choisir un nom d'utilisateur unique.</p>}

                    <div className="user-container__box">
                        <h3>Mot de passe </h3>
                        <div className="user-container__box--info">
                            {isPasswordEditing ? (
                                <div className="passwordInput">
                                    <form>
                                        <label>
                                            <input

                                                type="password"
                                                name="password"
                                                onChange={(e) => setPassword(e.target.value)}
                                                value={password}
                                                minLength={8}
                                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                                title="Doit contenir au minimum 8 caractères, un chiffre, une majuscule et une minuscule"
                                            />
                                        </label>
                                    </form>
                                </div>) : (<p></p>)}
                        </div>
                        {isPasswordEditing ?
                            <div className="user-container__box--edit">
                                {password ? <button onClick={(e) => HandlePasswordUpdate(e)}>Valider</button> : null}
                                <button onClick={() => {
                                    setIsPasswordEditing(!isPasswordEditing);
                                    setErrorPassword(false);
                                }}>Annuler</button>
                            </div> :
                            <button onClick={() => setIsPasswordEditing(!isPasswordEditing)}>Modifier</button>
                        }
                    </div>
                    {errorPassword && <p>Votre mot de passe doit contenir au minimum 8 caractères, un chiffre, une majuscule et une minuscule.</p>}
                </div>
            </div>
        </div>
    );
};

export default User;
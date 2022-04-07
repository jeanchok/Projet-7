import React, { useEffect, useState } from "react";
import axios from "axios";
import Logo from "../components/Logo";
import Navigation2 from "../components/Navigation2";


const User = () => {
    const storedJwt = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const [email, setEmail] = useState("");
    const [attachment, setAttachment] = useState(null);
    const [editEmail, seteditEmail] = useState("");
    const [editAttachment, seteditAttachment] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [userData, setuserData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isPictureEditing, setIsPictureEditing] = useState(false);
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

    const HandlePictureUpdate = (e) => {

        //e.preventDefault();
        const userAttachement = new FormData();
        userAttachement.append("attachment", editAttachment);
        console.log(editAttachment); console.log(userAttachement);

        axios
            .put("http://localhost:3008/api/auth/avatar/" + userId,
                userAttachement,

                {
                    headers: {
                        'Authorization': `Bearer ${storedJwt}`,
                    }
                })
            .then((res) => {
                setError(false);
                console.log(res);
                //seteditAtseteditAttachment(attachment);
                setIsPictureEditing(false);
                //getDataUser();

            })
            .catch((err) => {
                console.error(err);
                console.log("ici");
                console.log(userAttachement);
            })
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
                .then((res) => {
                    setError(false);
                    console.log(res);
                    setuserData({ ...userData, email: res.data.email });
                    setIsMailEditing(false);

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
                username: username
            },
                {
                    headers: {
                        'Authorization': `Bearer ${storedJwt}`,
                    }
                })
                .then((res) => {
                    setError(false);
                    setIsUsernameEditing(false);
                    setuserData({ ...userData, username: res.data.username });
                })
                .catch((err) => {
                    console.error(err);
                })
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
            console.log("Mot de passe changé");
            setIsPasswordEditing(false);
        }
    };


    return (

        <div>
            <Logo />
            <Navigation2 />
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
                                <div>
                                    <div className="userImage__container">
                                        <img className="userImage__container--avatar" src={editAttachment ? editAttachment : userData.attachment} alt="avatar" />
                                    </div>

                                    <div className="forum-container__Form--box">
                                        <input className="forum-container__Form--file"
                                            type="file"
                                            name="fileToUpload"
                                            onChange={(e) => seteditAttachment(e.target.files[0])}
                                        />

                                        <label className="forum-container__Form--label" htmlFor="file">
                                            <svg className="forum-container__Form--labelIcone" xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path></svg>
                                            {editAttachment ? <span>Fichier choisit : {editAttachment.name}</span> : <span>Choisir un fichier</span>}
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div className="userImage__container">
                                    <img className="userImage__container--avatar" src={editAttachment ? editAttachment : userData.attachment} alt="avatar" />
                                </div>
                            )}
                        </div>

                        {isPictureEditing ?
                            <div className="user-container__box--edit">
                                {editAttachment ? <button onClick={() => HandlePictureUpdate()}>Valider</button> : null}
                                <button onClick={() => setIsPictureEditing(!isPictureEditing)}>Annuler</button>
                            </div> :
                            <button onClick={() => setIsPictureEditing(!isPictureEditing)}>Modifier</button>

                        }
                    </div>
                    <div className="user-container__box">
                        <h3>Adresse email :</h3>
                        <div className="user-container__box--info">
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

                        </div>
                        {isMailEditing ? <button onClick={() => setIsMailEditing(!isMailEditing)}>Annuler</button> : <button onClick={() => setIsMailEditing(!isMailEditing)}>Modifier</button>}
                    </div>
                    <div className="user-container__box">
                        <h3>Nom d'utilisateur :</h3>
                        <div className="user-container__box--info">
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
                        </div>
                        {isUsernameEditing ? <button onClick={() => setIsUsernameEditing(!isUsernameEditing)}>Annuler</button> : <button onClick={() => setIsUsernameEditing(!isUsernameEditing)}>Modifier</button>}
                    </div>


                    <div className="user-container__box">
                        <h3>Mot de passe </h3>
                        <div className="user-container__box--info">
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
                        </div>
                        {isPasswordEditing ? <button onClick={() => setIsPasswordEditing(!isPasswordEditing)}>Annuler</button> : <button onClick={() => setIsPasswordEditing(!isPasswordEditing)}>Modifier</button>}
                    </div>
                </div>
            </div>






        </div>
    );
};

export default User;
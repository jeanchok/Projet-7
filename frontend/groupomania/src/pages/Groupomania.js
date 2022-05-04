import React, { useEffect, useState } from "react";
import axios from "axios";
import Logo from "../components/Logo";
import Post from "../components/Post";
import Navigation2 from "../components/Navigation2";

const FormData = require('form-data');

const Groupomania = () => {
    const [forumData, setForumData] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [attachment, setAttachment] = useState(null);
    const [error, setError] = useState(false);
    const [errorImageFormat, setErrorImageFormat] = useState(false);
    const storedJwt = sessionStorage.getItem('token');



    // Text area get bigger when typing
    const handleKeyDown = (e) => {
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`;
    }

    // Get all posts and comments
    const getData = () => {
        axios
            .get('http://localhost:3008/api/post/', {
                headers: {
                    'Authorization': `Bearer ${storedJwt}`,
                }
            })
            .then((res) => {
                setForumData(res.data);
            })
            .catch((err) => {
                console.error(err)
            })
    };


    // Function to handle upate post (as a props)
    const updatePost = (updatedPost) => {
        setForumData(updatedPost)
    };

    useEffect(() => getData(), []);

    // Add a Post
    const handleSubmit = (e) => {
        e.preventDefault();

        const MIME_TYPES = ["image/png", "image/jpeg", "image/jpg"];

        if (attachment && !MIME_TYPES.includes(attachment.type)) {
            setErrorImageFormat(true);
            setAttachment(null);
            return;
        }

        if (content.length < 1) {
            setError(true);
        } else {
            const formData = new FormData();
            formData.append("attachment", attachment);
            formData.append("title", title);
            formData.append("content", content);
            axios
                .post("http://localhost:3008/api/post/",
                    formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${storedJwt}`,
                        }
                    })
                .then(() => getData());
            setError(false);
            setContent("");
            setTitle("");
            setAttachment(null);
            setErrorImageFormat(false);
        }
    };

    return (
        <div className="forum-container">
            <header>
                <Logo />
                <Navigation2 />
            </header>
            <main>
                <h1>Fil d’actualité</h1>
                {/* Post form submission */}
                <form className="forum-container__Form" onSubmit={(e) => handleSubmit(e)}>
                    <input
                        placeholder="Titre..."
                        className="forum-container__Form--title"
                        type='text'
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                    />
                    <textarea
                        className="forum-container__Form--content"
                        style={{ border: error ? "1px solid red" : "1px solid #52cdfa" }}
                        placeholder="Exprimez vous :)"
                        onChange={(e) => setContent(e.target.value)}
                        value={content}
                        onKeyDown={(e) => handleKeyDown(e)}
                    ></textarea>
                    <div className="forum-container__Form--box">
                        <label className="forum-container__Form--label" htmlFor="file">
                            <input className="forum-container__Form--file"
                                type="file"
                                name="file"
                                onChange={(e) => setAttachment(e.target.files[0])}
                                defaultValue={attachment}
                            />

                            <svg className="forum-container__Form--labelIcone" xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path></svg>
                            {attachment ? <span>Fichier choisit : {attachment.name}</span> : <span>Choisir un fichier</span>}
                        </label>
                    </div>
                    {errorImageFormat ? <p className="forum-container__Form--error">Votre image doit être au format jpg, jpeg ou png</p> : null}
                    {error && <p className="forum-container__Form--error">Veuillez écrire un minimum de 5 caractères</p>}
                    <input className="forum-container__Form--submit" type="submit" value="Poster" />
                </form>
                <ul>
                    <li>
                        {/* Mapping posts  */}
                        {forumData
                            .sort((a, b) => b.date - a.date)
                            .map((post) => (
                                <Post key={post.id} post={post} storedJwt={storedJwt} getData={getData} comments={post.comments} updatePost={updatePost} forumData={forumData} />
                            ))
                        }
                    </li>
                </ul>
            </main>
        </div>
    );
};


export default Groupomania;
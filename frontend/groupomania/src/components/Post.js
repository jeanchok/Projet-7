import axios from "axios";
import React, { useState } from "react";
import Comments from "./Comments";

const Post = ({ post, storedJwt, getData, updatePost, forumData }) => {
    const [like, setlike] = useState(post.likes);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [fileToUpdate, setFileToUpdate] = useState(null);
    const [editPostAttachment, seteditPostAttachment] = useState("");
    const [postComments, setpostComments] = useState(post.Comments);
    const [commentContent, setCommentContent] = useState("");
    const [commentAttachment, setCommentAttachment] = useState(null);
    const [error, setError] = useState(false);
    const isAdmin = JSON.parse(sessionStorage.getItem('isAdmin'));
    const userId = sessionStorage.getItem('userId');
    const [userLiked, setUserLiked] = useState(post.PostLikes.some(like => like.userId == userId));
    const [errorImageFormat, setErrorImageFormat] = useState(false);

    // Textearea get larger when user is typing
    const handleKeyDown = (e) => {
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`;
    }

    // udpate comment
    const updateComments = (updatedComments) => {
        setpostComments(updatedComments);
    };

    // Date format
    const dateFormater = (date) => {
        let newDate = new Date(date).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
        });
        return newDate;
    };

    // Update post
    const handleEdit = () => {

        let title = editTitle ? editTitle : post.title;
        let content = editContent ? editContent : post.content;
        let attachment = fileToUpdate ? fileToUpdate : post.attachment;

        const formData = new FormData();
        formData.append("attachment", attachment);
        formData.append("title", title);
        formData.append("content", content);



        axios.put("http://localhost:3008/api/post/" + post.id, formData, {
            headers: {
                'Authorization': `Bearer ${storedJwt}`
            }
        })
            .then((result) => {
                seteditPostAttachment(result.data.postObject.attachment);
                setIsEditing(false);
            })
            .catch((err) => {
                console.error(err)
            })
    };

    // Delete post
    const handleDelete = () => {
        axios.delete("http://localhost:3008/api/post/" + post.id, {
            headers: {
                'Authorization': `Bearer ${storedJwt}`
            }
        })
            .then((result) => {
                updatePost(forumData.filter((post) => post.id !== result.data.post.id));
            })
            .catch((err) => {
                console.error(err)
            })
    };

    // Like a post
    const handleLike = () => {
        axios
            .post(`http://localhost:3008/api/post/${post.id}/like`, {
                like: !userLiked,
                userId: userId,
            },
                {
                    headers: {
                        'Authorization': `Bearer ${storedJwt}`
                    }
                })
            .then(() => {
                console.log(userLiked);
                setUserLiked(!userLiked);
                if (userLiked) {
                    setlike(like - 1);
                } else {
                    setlike(like + 1);
                }
            })
            .catch((err) => {
                console.error(err)
            })

    };

    // Add a comment
    const handleSubmit = (e) => {
        e.preventDefault();

        const MIME_TYPES = ["image/png", "image/jpeg", "image/jpg"];

        if (!MIME_TYPES.includes(commentAttachment.type)) {
            setErrorImageFormat(true);
            return;
        }


        if (commentContent.length < 1) {
            setError(true);
        } else {
            const formData = new FormData();
            formData.append("attachment", commentAttachment);
            formData.append("postId", post.id);
            formData.append("content", commentContent);
            axios
                .post("http://localhost:3008/api/comment/",
                    formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${storedJwt}`
                        }
                    })
                .then((result) => {
                    post.Comments.push(result.data.comment);
                    setpostComments(post.Comments);
                    setCommentContent("");
                    setCommentAttachment(null);
                })
                .catch((err) => {
                    console.error(err)
                }
                );
        }
    };

    return (
        <div
            className="post"
            style={{ background: isEditing ? "#f3feff" : "white" }}
        >
            <div className="card-header">
                <div className="card-header__imgContainer">
                    <img className="card-header__imgContainer--img" src={post.User.attachment} alt={post.User.username + ' avatar'} />
                </div>
                <div className="card-header__text">
                    <h3>{post.User.username}</h3>
                    <em>Posté le {dateFormater(post.createdAt)}</em>
                </div>
            </div>
            <div className="card-body">
                {isEditing ?
                    (<input
                        type='text'
                        defaultValue={editTitle ? editTitle : post.title}
                        onChange={(e) => setEditTitle(e.target.value)} />
                    ) : (

                        <h2>{post.title}</h2>

                    )}
                {isEditing ? (
                    <textarea
                        defaultValue={editContent ? editContent : post.content}
                        autoFocus
                        onChange={(e) => setEditContent(e.target.value)}
                    ></textarea>
                ) : (

                    <p>{editContent ? editContent : post.content}</p>

                )}
            </div>
            <div className="card-attachement">
                {
                    (post.attachment !== 'null') ? <img className="card-attachement--img" src={editPostAttachment ? editPostAttachment : post.attachment} alt="attachment2" /> : null
                }
            </div>
            {/*  */}
            <div className="card-footer">
                {isEditing ? (
                    <div className="forum-container__Form--box">
                        <label className="forum-container__Form--label" for="file">
                            <input className="forum-container__Form--file"
                                type="file"
                                name="fileToUpload"
                                onChange={(e) => setFileToUpdate(e.target.files[0])}
                            />
                            <svg className="forum-container__Form--labelIcone" xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path></svg>
                            {fileToUpdate ? <span>Fichier choisit : {fileToUpdate.name}</span> : <span>Choisir un fichier</span>}
                        </label>
                    </div>
                )
                    : null}
                {(isAdmin || userId == post.User.id) ? (
                    <div className="btn-container">
                        {isEditing ? (
                            <button onClick={() => handleEdit()}>Valider</button>
                        ) : (
                            <button onClick={() => setIsEditing(true)}>Editer</button>
                        )}
                        <button
                            onClick={() => {
                                if (
                                    window.confirm("Voulez-vous vraiment supprimer cet post ?")
                                ) {
                                    handleDelete();
                                }
                            }}
                        >
                            Suprpimer
                        </button>
                    </div>
                ) : null}
                <div className="postLike">
                    <button onClick={() => handleLike()}>
                        <span>{like}</span>
                        <img src={userLiked ? "./icones/Liked.png" : "./icones/Like.png"} alt="like" />
                    </button>
                </div>
            </div>
            {/* <-- Show Comments --> */}

            {postComments
                .sort((a, b) => b.date - a.date)
                .map((comments) => (
                    <Comments key={comments.id} comments={comments} storedJwt={storedJwt} postId={post.id} getData={getData} post={post} updateComments={updateComments} />
                ))
            }


            {/* <-- Create Comment --> */}
            <form className="postComment" onSubmit={(e) => handleSubmit(e)}>
                <textarea
                    placeholder="Ajouter un commentaire"
                    style={{ border: error ? "1px solid red" : "1px solid #61dafb" }}
                    className="postComment__textarea"
                    onChange={(e) => setCommentContent(e.target.value)}
                    value={commentContent}
                    onKeyDown={handleKeyDown}
                ></textarea>
                <div className="postComment__Form--box">
                    <label className="postComment__Form--label" htmlFor="file">
                        <input className="postComment__Form--file" type="file" name="fileToUpload" onChange={(e) => setCommentAttachment(e.target.files[0])} />
                        <svg className="postComment__Form--labelIcone" xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path></svg>
                        {commentAttachment ? <span>Fichier choisit : {commentAttachment.name}</span> : <span>Choisir un fichier</span>}
                    </label>
                </div>
                {error && <p className="error">Veuillez écrire un minimum de 5 caractères</p>}
                {errorImageFormat && <p className="error">Le fichier n'est pas une image</p>}
                <input className="postComment__submit" type="submit" value="Envoyer" />
            </form>
        </div>
    );
};

export default Post;

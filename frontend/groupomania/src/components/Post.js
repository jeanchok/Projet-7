import axios from "axios";
import React, { useState, useEffect } from "react";
import Comments from "./Comments";

const Post = ({ post, storedJwt, getData, updatePost, forumData }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [editPostAttachment, seteditPostAttachment] = useState("");
    const [postComments, setpostComments] = useState(post.Comments);
    const [commentContent, setCommentContent] = useState("");
    const [commentAttachment, setCommentAttachment] = useState(null);
    const [error, setError] = useState(false);
    const isAdmin = localStorage.getItem('isAdmin');
    const userId = localStorage.getItem('userId');

    const handleKeyDown = (e) => {
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`;
    }

    let managePost;
    if (isAdmin > 0 || userId == post.User.id) {
        managePost = true;
    }


    const updateComments = (updatedComments) => {
        setpostComments(updatedComments);
    };

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

    const handleEdit = () => {

        let title = editTitle ? editTitle : post.title;
        let content = editContent ? editContent : post.content;
        let attachment = editPostAttachment ? editPostAttachment : post.attachment;

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

    const handleSubmit = (e) => {
        e.preventDefault();


        if (commentContent.length < 5) {
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
                    console.log(post.Comments);
                    setCommentContent("");
                    setCommentContent("");
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
                <h3>{post.User.username}</h3>
                <em>Posté le {dateFormater(post.createdAt)}</em>
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
                    (post.attachment !== 'null') ? <img src={editPostAttachment ? editPostAttachment : post.attachment} alt="attachment2" /> : null
                }
            </div>
            {/*  */}
            <div className="card-footer">
                {isEditing ? (
                    <input
                        className="forum-container__Form--file"
                        type="file" name="fileToUpload"
                        onChange={(e) => seteditPostAttachment(e.target.files[0])} />
                )
                    : null}
                {managePost ? (
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
            </div>
            {/* <-- Show Comments --> */}
            <ul>
                {postComments
                    .sort((a, b) => b.date - a.date)
                    .map((comments) => (
                        <Comments key={comments.id} comments={comments} storedJwt={storedJwt} postId={post.id} getData={getData} post={post} updateComments={updateComments} />
                    ))
                }
            </ul>

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
                <input className="postComment__file" type="file" name="fileToUpload" onChange={(e) => setCommentAttachment(e.target.files[0])} />
                {error && <p>Veuillez écrire un minimum de 5 caractères</p>}
                <input className="postComment__submit" type="submit" value="Envoyer" />
            </form>
        </div>
    );
};

export default Post;

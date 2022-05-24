import axios from "axios";
import React, { useState } from "react";

const Comments = ({ comments, storedJwt, post, updateComments, getData, handleKeyDown }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState("");
    const [editCommenttAttachment, seteditCommenttAttachment] = useState("");
    const isAdmin = JSON.parse(sessionStorage.getItem('isAdmin'));
    const userId = sessionStorage.getItem('userId');

    // Allow user to manage comments
    let manageComment;
    if (isAdmin || userId == comments.userId) {
        manageComment = true;
    }

    // date format
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

    // Edit comment
    const handleEdit = () => {

        let content = editContent ? editContent : comments.content;
        let attachment = editCommenttAttachment ? editCommenttAttachment : comments.attachment;

        const formData = new FormData();
        formData.append("attachment", attachment);
        formData.append("content", content);

        axios.put("http://localhost:3008/api/comment/" + comments.id, formData, {
            headers: {
                'Authorization': `Bearer ${storedJwt}`
            }
        })
            .then((result) => {
                seteditCommenttAttachment(result.data.commentObject.attachment);
                setIsEditing(false);
                if (editCommenttAttachment) {
                    getData();
                }
            })
            .catch((err) => {
                console.error(err)
            })
    };

    // Delete comment
    const handleDelete = () => {
        axios.delete("http://localhost:3008/api/comment/" + comments.id, {
            headers: {
                'Authorization': `Bearer ${storedJwt}`
            }
        })
            .then((result) => {
                updateComments(post.Comments.filter((comment) => comment.id !== result.data.comment.id));
                getData();
            })
            .catch((err) => {
                console.error(err)
            })
    };




    return (
        <div
            className="comments"
            style={{ border: isEditing ? "red solid 1px" : "none" }}
        >
            <div className="card-header">
                <div className="card-header__imgContainer">
                    <img className="card-header__imgContainer--img" src={comments.User.attachment} alt={comments.User.username + ' avatar'} />
                </div>
                <div className="card-header__text">
                    <strong>{comments.User.username}</strong>
                    <em>commenté le {dateFormater(comments.createdAt)}</em>
                </div>
            </div>
            {isEditing ? (
                <textarea
                    defaultValue={editContent ? editContent : comments.content}
                    autoFocus
                    onChange={(e) => setEditContent(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e)}
                ></textarea>
            ) : (
                <p>{editContent ? editContent : comments.content}</p>
            )}
            {
                (comments.attachment == 'null') ? <img className="imgComment" src={editCommenttAttachment ? editCommenttAttachment : comments.attachment} alt="attachment" /> : null
            }
            {isEditing ? (
                <div className="forum-container__Form--box">
                    <input className="forum-container__Form--file"
                        type="file"
                        name="fileToUpload"
                        onChange={(e) => seteditCommenttAttachment(e.target.files[0])}
                    />
                    <label className="forum-container__Form--label" htmlFor="file">
                        <svg className="forum-container__Form--labelIcone" xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path></svg>
                        {editCommenttAttachment ? <span>Fichier choisit : {editCommenttAttachment.name}</span> : <span>Choisir un fichier</span>}
                    </label>
                </div>)
                : null}

            {manageComment ? (
                <div className="btn-container">
                    {isEditing ? (
                        <button onClick={() => handleEdit()}>Valider</button>
                    ) : (
                        <button onClick={() => setIsEditing(true)}>Editer</button>
                    )}
                    <button
                        onClick={() => {
                            if (
                                window.confirm("Voulez-vous vraiment supprimer cet comments ?")
                            ) {
                                handleDelete();
                            }
                        }}
                    >
                        Suprpimer
                    </button>
                </div>) : null}


        </div>
    );
};

export default Comments;
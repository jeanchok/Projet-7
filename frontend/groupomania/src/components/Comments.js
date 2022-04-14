import axios from "axios";
import React, { useState, useEffect } from "react";

const Comments = ({ comments, storedJwt, getData, post, updateComments }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState("");
    const [editCommenttAttachment, seteditCommenttAttachment] = useState("");
    const isAdmin = sessionStorage.getItem('isAdmin');
    const userId = sessionStorage.getItem('userId');

    let manageComment;


    if (isAdmin > 0 || userId == comments.userId) {
        manageComment = true;
    }




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
            })
            .catch((err) => {
                console.error(err)
            })
    };

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
            style={{ background: isEditing ? "#f3feff" : "#f2f2f2" }}
        >
            <div className="card-header">
                <div className="card-header__imgContainer">
                    <img className="card-header__imgContainer--img" src={comments.User.attachment} />
                </div>
                <div className="card-header__text">
                    <h3>{comments.User.username}</h3>
                    <em>commenté le {dateFormater(comments.createdAt)}</em>
                </div>
            </div>
            {isEditing ? (
                <textarea
                    defaultValue={editContent ? editContent : comments.content}
                    autoFocus
                    onChange={(e) => setEditContent(e.target.value)}
                ></textarea>
            ) : (
                <p>{editContent ? editContent : comments.content}</p>
            )}
            {
                (comments.attachment == 'null') ? null : <img className="imgComment" src={editCommenttAttachment ? editCommenttAttachment : comments.attachment} alt="attachment2" />
            }
            {isEditing ? (
                <div className="forum-container__Form--box">
                    <input className="forum-container__Form--file"
                        type="file"
                        name="fileToUpload"
                        onChange={(e) => seteditCommenttAttachment(e.target.files[0])}
                    />
                    <label className="forum-container__Form--label" for="file">
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
                        <button onClick={() => setIsEditing(true)}>Edit</button>
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
import axios from "axios";
import React, { useState, useEffect } from "react";

const Comments = ({ comments, storedJwt, getData, post, updateComments }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState("");
    const [editCommenttAttachment, seteditCommenttAttachment] = useState("");
    const isAdmin = localStorage.getItem('isAdmin');
    const userId = localStorage.getItem('userId');

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
                <h3>{comments.User.username}</h3>
                <em>commentsé le {dateFormater(comments.createdAt)}</em>
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
                (comments.attachment == 'null') ? null : <img src={editCommenttAttachment ? editCommenttAttachment : comments.attachment} alt="attachment2" />
            }
            {/* {console.log(comments.attachment)} */}
            {isEditing ? (
                <input
                    className="forum-container__Form--file"
                    type="file" name="fileToUpload"
                    onChange={(e) => seteditCommenttAttachment(e.target.files[0])} />
            )
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
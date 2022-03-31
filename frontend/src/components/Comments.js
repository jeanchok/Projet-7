import axios from "axios";
import React, { useState, useEffect } from "react";

const Comments = ({ comments, storedJwt, getData, post, updateComments }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState("");


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
        const data = {
            username: comments.username,
            content: editContent ? editContent : comments.content,
            date: comments.createdAt,
        };

        axios.put("http://localhost:3008/api/comment/" + comments.id, { data }, {
            headers: {
                'Authorization': `Bearer ${storedJwt}`
            }
        })
            .then(() => {
                setIsEditing(false);
            });
    };

    const handleDelete = () => {
        axios.delete("http://localhost:3008/api/comment/" + comments.id, {
            headers: {
                'Authorization': `Bearer ${storedJwt}`
            }
        })
            .then((result) => {
                updateComments(post.Comments.filter((comment) => comment.id !== result.data.comment.id));
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
            </div>

        </div>
    );
};

export default Comments;
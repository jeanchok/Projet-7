import axios from "axios";
import React, { useState } from "react";
import Comments from "./Comments";

const Post = ({ post, storedJwt, getData, updatePost, forumData }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [editPostAttachment, seteditPostAttachment] = useState("");
    const [postComments, setpostComments] = useState(post.Comments);
    const [commentContent, setContent] = useState("");
    const [attachment, setAttachment] = useState(null);
    const [error, setError] = useState(false);

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

        // username: post.username;
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
            });
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
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (commentContent.length < 5) {
            setError(true);
        } else {
            axios
                .post("http://localhost:3008/api/comment/",
                    {
                        comment: {
                            content: commentContent,
                            attachment: attachment,
                            postId: post.id
                        }
                    }
                    ,
                    {
                        headers: {
                            'Authorization': `Bearer ${storedJwt}`
                        }
                    })
                .then((result) => {
                    post.Comments.push(result.data.comment);
                    setpostComments(post.Comments);
                })
        }
    };

    return (
        <div
            className="post"
            style={{ background: isEditing ? "#f3feff" : "white" }}
        >
            <div className="card-header">
                {isEditing ?
                    (<input
                        type='text'
                        defaultValue={editTitle ? editTitle : post.title}
                        onChange={(e) => setEditTitle(e.target.value)} />
                    ) : (
                        <h2>{post.title}</h2>
                    )}
                <h3>{post.User.username}</h3>
                <em>Posté le {dateFormater(post.createdAt)}</em>
            </div>
            {isEditing ? (
                <textarea
                    defaultValue={editContent ? editContent : post.content}
                    autoFocus
                    onChange={(e) => setEditContent(e.target.value)}
                ></textarea>
            ) : (
                <p>{editContent ? editContent : post.content}</p>
            )}
            {isEditing ? (
                <img src={post.attachment} alt="attachment" />,
                <input
                    className="forum-container__Form--file"
                    type="file" name="fileToUpload"
                    onChange={(e) => seteditPostAttachment(e.target.files[0])} />
            )
                : (<img src={editPostAttachment ? editPostAttachment : post.attachment} alt="attachment" />)
            }
            <div className="btn-container">
                {isEditing ? (
                    <button onClick={() => handleEdit()}>Valider</button>
                ) : (
                    <button onClick={() => setIsEditing(true)}>Edit</button>
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
            <ul>
                {postComments
                    .sort((a, b) => b.date - a.date)
                    .map((comments) => (
                        <Comments key={comments.id} comments={comments} storedJwt={storedJwt} postId={post.id} getData={getData} post={post} updateComments={updateComments} />
                    ))
                }
            </ul>
            <form onSubmit={(e) => handleSubmit(e)}>
                <textarea
                    style={{ border: error ? "1px solid red" : "1px solid #61dafb" }}
                    placeholder="Commentes..."
                    onChange={(e) => setContent(e.target.value)}
                    value={commentContent}
                ></textarea>
                <input type="file" name="fileToUpload" onChange={(e) => setAttachment(e.target.files[0])} />
                {error && <p>Veuillez écrire un minimum de 5 caractères</p>}
                <input type="submit" value="Envoyer" />
            </form>
        </div>
    );
};

export default Post;

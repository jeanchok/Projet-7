import React, { useEffect, useState } from "react";
import axios from "axios";

const DisplayUsers = (user) => {
    const storedJwt = sessionStorage.getItem('token');

    const handleDelete = () => {
        axios.delete("http://localhost:3008/api/auth/delete/" + user.user.id, {
            headers: {
                'Authorization': `Bearer ${storedJwt}`
            }
        })
            .then(() => {
                user.getUsersData();
            })
            .catch((err) => {
                console.error(err)
            })
    };



    return (
        <div className="user-container__admin">
            <div className="user-container__admin--grid">
                <div className="user-container__box">
                    <h3>Adresse e-mail :</h3>
                    <div className="user-container__box--info">
                        <p>{user.user.email}</p>
                    </div>
                </div>
                <div className="user-container__box">
                    <h3>Nom d'utilisateur :</h3>
                    <div className="user-container__box--info">
                        <p>{user.user.username}</p>
                    </div>
                </div>
                <div className="user-container__box">
                    <h3>Est Administrateur :</h3>
                    <div className="user-container__box--info">
                        <p>{user.user.isAdmin > 0 ? "Oui" : "Non"}</p>
                    </div>
                </div>
                <div className="user-container__box">

                    <button onClick={() => {
                        if (
                            window.confirm("Voulez-vous vraiment supprimer ce compte ?")
                        ) {
                            handleDelete();
                        }
                    }}>Supprimer</button>

                </div>
            </div>
        </div>
    );
};

export default DisplayUsers;
import React, { useEffect, useState } from "react";
import axios from "axios";

const DisplayUsers = (user) => {
    const storedJwt = localStorage.getItem('token');

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
        <div>
            <h3>Adresse e-mail:</h3>
            <p>{user.user.email}</p>
            <h3>Nom d'utilisateur</h3>
            <p>{user.user.username}</p>
            <h3>Est Administrateur:</h3>
            <p>{user.user.isAdmin > 0 ? "Oui" : "Non"}</p>
            <button onClick={() => {
                if (
                    window.confirm("Voulez-vous vraiment supprimer votre compte ?")
                ) {
                    handleDelete();
                }
            }}>Supprimer ce compte</button>
        </div>
    );
};

export default DisplayUsers;
import React from 'react';
import axios from "axios";
import Logo from "../components/Logo";
import Navigation2 from "../components/Navigation2";


const User = () => {
    const storedJwt = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const handleDelete = () => {
        axios.delete("http://localhost:3008/api/auth/delete/" + userId, {
            headers: {
                'Authorization': `Bearer ${storedJwt}`
            }
        })
            .then(() => window.location.href = "/")

    }


    return (

        <div>
            <Logo />
            <Navigation2 />
            <h1>Mon compte</h1>
            <button onClick={() => {
                if (
                    window.confirm("Voulez-vous vraiment supprimer votre compte ?")
                ) {
                    handleDelete();
                }
            }}>Supprimer mon compte</button>

        </div>
    );
};

export default User;
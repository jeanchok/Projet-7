import React, { useEffect, useState } from "react";
import axios from "axios";
import Logo from "../components/Logo";
import Navigation2 from "../components/Navigation2";
import DisplayUsers from "../components/DisplayUsers";

const Admin = () => {
    const storedJwt = localStorage.getItem('token');
    const [usersData, setUsersData] = useState([]);

    const getUsersData = () => {
        axios
            .get('http://localhost:3008/api/auth/', {
                headers: {
                    'Authorization': `Bearer ${storedJwt}`,
                }
            })
            .then((res) => setUsersData(res.data))
            .catch((err) => {
                console.error(err)
            })
    };



    useEffect(() => getUsersData(), []);

    return (
        <div>
            <Logo />
            <Navigation2 />
            <div className="user-container__adminBox">
                <h2>
                    Liste des utilisateurs
                </h2>
                {usersData
                    .map((user) => (
                        <DisplayUsers key={user.id} user={user} getUsersData={getUsersData} />
                    ))
                }
            </div>
        </div>
    );
};

export default Admin;
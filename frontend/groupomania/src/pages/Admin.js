import React, { useEffect, useState } from "react";
import axios from "axios";
import Logo from "../components/Logo";
import Navigation2 from "../components/Navigation2";
import DisplayUsers from "../components/DisplayUsers";

const Admin = () => {
    const storedJwt = sessionStorage.getItem('token');
    const [usersData, setUsersData] = useState([]);

    // Get all users for admin
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
        <div className="forum-container">
            <header>
                <Logo />
                <Navigation2 />
            </header>
            <div className="user-container__adminBox">
                <h2 className="adminTitle">
                    Liste des utilisateurs
                </h2>

                {/* {Display all users} */}
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
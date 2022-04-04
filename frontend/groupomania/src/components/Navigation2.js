import React from 'react';
import { NavLink } from "react-router-dom";
const isAdmin = localStorage.getItem('isAdmin');

const Navigation2 = () => {

    const HandleLogout = () => {
        localStorage.clear();
    }


    return (
        <div className="navigation">
            <ul>
                <NavLink to="/groupomania" className={(nav) => (nav.isActive ? "nav-active" : "")}>
                    <li>Forum</li>
                </NavLink>
                <NavLink to="/user" className={(nav) => (nav.isActive ? "nav-active" : "")}>
                    <li>Mon compte</li>
                </NavLink>
                {
                    isAdmin > 0 ?
                        <NavLink to="/admin" className={(nav) => (nav.isActive ? "nav-active" : "")}>
                            <li>Administrer les utilisateurs</li>
                        </NavLink> : null
                }
                <NavLink
                    to="/"
                    className={(nav) => (nav.isActive ? "nav-active" : "")}
                    onClick={() => HandleLogout()}>
                    <li>Se déconnecter</li>
                </NavLink>
            </ul>
        </div>
    );
};

export default Navigation2;
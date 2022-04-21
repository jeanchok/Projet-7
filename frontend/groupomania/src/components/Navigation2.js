import React from 'react';
import { NavLink } from "react-router-dom";
const isAdmin = sessionStorage.getItem('isAdmin');

const Navigation2 = () => {

    const HandleLogout = () => {
        sessionStorage.clear();
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
                    isAdmin ?
                        <NavLink to="/admin" className={(nav) => (nav.isActive ? "nav-active" : "")}>
                            <li>Administrer</li>
                        </NavLink> : null
                }
                <NavLink
                    to="/"
                    className={(nav) => (nav.isActive ? "nav-active" : "")}
                    onClick={() => HandleLogout()}>
                    <li>Déconnexion</li>
                </NavLink>
            </ul>
        </div>
    );
};

export default Navigation2;
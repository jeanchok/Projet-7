import React from 'react';
import { NavLink } from "react-router-dom";

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
import React from 'react';
import { NavLink } from "react-router-dom";
const isAdmin = JSON.parse(sessionStorage.getItem('isAdmin'));


const Navigation2 = () => {

    // Navigation menu once logged in

    const HandleLogout = () => {
        sessionStorage.clear();
    }


    return (
        <div className="navigation">
            <ul>
                <li>
                    <NavLink to="/groupomania" className={(nav) => (nav.isActive ? "nav-active" : "")}>
                        <nav>Forum</nav>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/user" className={(nav) => (nav.isActive ? "nav-active" : "")}>
                        <nav>Mon compte</nav>
                    </NavLink>
                </li>
                {/* Display admin menu if admin */}
                <li>
                    {
                        isAdmin ?
                            <NavLink to="/admin" className={(nav) => (nav.isActive ? "nav-active" : "")}>
                                <nav>Administrer</nav>
                            </NavLink> : null
                    }
                </li>
                <li>
                    <NavLink
                        to="/"
                        className={(nav) => (nav.isActive ? "nav-active" : "")}
                        onClick={() => HandleLogout()}>
                        <nav>Déconnexion</nav>
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Navigation2;
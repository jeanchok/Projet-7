import React from 'react';
import { NavLink } from "react-router-dom";

const Navigation = () => {

    // Navigation menu if not logged in
    return (
        <div className="navigation">
            <ul>
                <li>
                    <NavLink
                        to="/signup"
                        className={(nav) => (nav.isActive ? "nav-active" : "")}
                    >
                        <nav>S'inscrire</nav>
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/login"
                        className={(nav) => (nav.isActive ? "nav-active" : "")}
                    >
                        <nav>Se connecter</nav>
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Navigation;
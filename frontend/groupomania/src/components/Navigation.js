import React from 'react';
import { NavLink } from "react-router-dom";

const Navigation = () => {
    return (
        <div className="navigation">
            <ul>
                <NavLink
                    to="/signup"
                    className={(nav) => (nav.isActive ? "nav-active" : "")}
                >
                    <li>S'inscrire</li>
                </NavLink>
                <NavLink
                    to="/login"
                    className={(nav) => (nav.isActive ? "nav-active" : "")}
                >
                    <li>Se connecter</li>
                </NavLink>
            </ul>
        </div>
    );
};

export default Navigation;
import React from 'react';
import Navigation from '../components/Navigation';
import Logo from '../components/Logo';

const Home = () => {
    return (
        <div className="forum-container">
            <header>
                <Logo />
                <Navigation />
            </header>
        </div>
    );
};

export default Home;
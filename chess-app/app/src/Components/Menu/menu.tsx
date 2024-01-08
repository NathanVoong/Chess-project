import React from 'react';
import './menu.css';
const MenuScreen = ({toggleMenu}) => {
    return (
        <div className="menu-container">
            <img src="assets/images/chessLogo.png" alt="Chess Logo" className="logo" />
            <h1>Chess Game</h1>
            <button className="playButton" onClick={toggleMenu}>Play</button>
        </div>
    );
};

export default MenuScreen;

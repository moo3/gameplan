import React from 'react';
import { GithubIcon } from './icons';

const GameplanLogo = () => {
    return (
        <div className="gameplan-logo">
            <span>GAMEPLAN</span>
            <span className="app-version">
                <span>v{__APP_VERSION__}</span>
                <a
                    className="github-badge"
                    href="https://github.com/moo3/gameplan"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View on GitHub"
                >
                    <GithubIcon />
                </a>
            </span>
        </div>
    );
};

export default GameplanLogo;

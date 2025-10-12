import React from "react";

const SiteNavbar:React.FC=():JSX.Element => {
    return (
        <nav className="navbar">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
        </nav>
    );
}

export default SiteNavbar;
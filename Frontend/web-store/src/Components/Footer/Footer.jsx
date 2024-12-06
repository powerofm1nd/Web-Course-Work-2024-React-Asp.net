import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

const Footer = () => {
    return (
        <Navbar bg="dark" variant="dark" >
            <Container>
                <div className="text-center w-100 p-3 mt-3" style={{borderTop: "1px solid white"}}>
                    Курсова робота на тему "Розробка вебплатформи для продажу спеціалізованої техніки та компонентів"
                </div>
            </Container>
        </Navbar>
    );
}

export default Footer;

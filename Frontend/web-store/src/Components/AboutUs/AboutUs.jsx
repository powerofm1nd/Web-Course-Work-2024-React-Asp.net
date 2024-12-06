import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import styles from './AboutUs.module.css'; 

const AboutUs = () => {
    return (
        <Container className={styles.container}>
            <h1 className={styles.title}>Про нас</h1>
            <p className={styles.text}>
                BlackoutStore — це ваш надійний партнер у часи блекауту. Ми спеціалізуємось на продажу товарів, які забезпечують комфорт, безпеку та енергію під час відключень електроенергії.
            </p>
            
            <Row className="text-center">
                <Col md={4}>
                    <Card className={styles.card}>
                        <Card.Body className={styles.cardBody}>
                            <Card.Title>Наш магазин</Card.Title>
                            <Card.Text>
                                У BlackoutStore ви знайдете широкий асортимент товарів для забезпечення енергетичної автономії. Від акумуляторів до генераторів — ми маємо все, щоб ви почували себе безпечно.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className={styles.card}>
                        <Card.Body className={styles.cardBody}>
                            <Card.Title>Надійність</Card.Title>
                            <Card.Text>
                                Ми прагнемо надавати тільки найкращу продукцію, щоб ви могли бути впевнені в її якості та надійності, навіть у найскладніших умовах.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className={styles.card}>
                        <Card.Body className={styles.cardBody}>
                            <Card.Title>Інновації</Card.Title>
                            <Card.Text>
                                Ми постійно стежимо за новітніми технологіями, щоб запропонувати вам найсучасніші рішення для забезпечення енергії та комфорту.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <p className={styles.footerText}>
                Наше завдання — зробити вашу повсякденність безпечною та зручною, незалежно від зовнішніх обставин. Довіряйте BlackoutStore — і будьте готові до будь-яких ситуацій!
            </p>
        </Container>
    );
};

export default AboutUs;
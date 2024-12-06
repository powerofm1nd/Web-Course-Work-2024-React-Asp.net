import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { useSelector, useDispatch } from "react-redux";
import { registerNewUser } from "../../redux/action/UserAction";
import { useNavigate } from 'react-router-dom';
import styles from './RegistrationPage.module.css'; 

const RegistrationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser, register_error } = useSelector((state) => state.user);

  const [error, setError] = useState(null);

  if (currentUser != null) {
    navigate('/');
  }

  useEffect(() => {
    setError(register_error);
  }, [dispatch, register_error]);

  const [formData, setFormData] = useState({
    login: '',
    password: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerNewUser(formData));
  };

  return (
    <Container className={`my-5 ${styles.container}`}>
      <h2 className={`mt-3 mb-3 ${styles.title}`}>Реєстрація</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group controlId="login">
              <Form.Label className={`mt-2 ${styles.label}`}>Логін:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your login"
                name="login"
                value={formData.login}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group controlId="email">
              <Form.Label className={`mt-2 ${styles.label}`}>E-mail адреса:</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group controlId="password">
              <Form.Label className={`mt-2 ${styles.label}`}>Пароль:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
                className={styles.input}
              />
            </Form.Group>
          </Col>
        </Row>

        {error && <Alert variant="danger" className={styles.alert}>{error}</Alert>}

        <Button type="submit" className={`mt-2 ${styles.submitButton}`}>Реєстрація</Button>
      </Form>
    </Container>
  );
};

export default RegistrationPage;
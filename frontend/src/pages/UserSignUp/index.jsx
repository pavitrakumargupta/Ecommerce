import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
import axios from 'axios';

const UserSignUp = () => {
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!firstname.trim()) newErrors.firstname = 'First name is required.';
    if (!lastname.trim()) newErrors.lastname = 'Last name is required.';

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else {
      const emailRegex = /^[\w.-]+@[\w.-]+\.\w+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Invalid email format.';
      }
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
        newErrors.phone = 'Invalid phone number format.';
      }
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/user/userSignup', {
        firstname,
        lastname,
        email,
        phone,
        password,
      });

      alert('Registration successful');
      navigate('/user-login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logincontainer}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className={styles.title}>User Sign Up</h2>

          <div className={styles.inputGroup}>
            <label>First Name</label>
            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className={styles.input}
            />
            {errors.firstname && <p className={styles.error}>{errors.firstname}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label>Last Name</label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className={styles.input}
            />
            {errors.lastname && <p className={styles.error}>{errors.lastname}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label>Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={styles.input}
            />
            {errors.phone && <p className={styles.error}>{errors.phone}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
            {errors.password && <p className={styles.error}>{errors.password}</p>}
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>

          <p className={styles.switch}>
            Already have an account?{' '}
            <button
              type="button"
              className={styles.linkButton}
              onClick={() => navigate('/user-login')}
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserSignUp;

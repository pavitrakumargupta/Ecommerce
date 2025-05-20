import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome</h1>
      <div className={styles.buttonGroup}>
        <button
          className={styles.button}
          onClick={() => navigate('/admin-login')}
        >
          Login as Admin
        </button>
        <button
          className={styles.button}
          onClick={() => navigate('/user-login')}
        >
          Login as User
        </button>
      </div>
    </div>
  );
};

export default Index;

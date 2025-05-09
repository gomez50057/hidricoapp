'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './login.module.css';

const imgBasePath = '/planhidrico/img/login/';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');

    try {
      const { data, status } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/inicio-sesion/`,
        { username, password },
        { withCredentials: true }
      );

      if (status === 200 && data.status === 'ok') {
        const role = data.group;
        const name = data.username || username;

        localStorage.setItem('userRole', role);
        localStorage.setItem('userName', name);
        localStorage.setItem('isLoggedIn', 'true');

        router.replace('/dashboard');
      } else {
        throw new Error(data.detail || 'Error en inicio de sesión');
      }
    } catch (e) {
      setErr(e.response?.data?.detail || e.message);
    }
  };

  return (
    <section>
      <form onSubmit={submit} className={styles.login}>
        <div className={styles.containerInicioSeccion}>
          <div className={styles.imgInicio}>
            <img
              src={`${imgBasePath}inicio de seccion.png`}
              alt="inicio de sesión"
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              id="username"
              className={styles.input}
              type="text"
              placeholder=" "
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <label htmlFor="username">Usuario</label>
          </div>

          <div className={styles.inputGroup}>
            <input
              id="password"
              className={styles.input}
              type="password"
              placeholder=" "
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password">Contraseña</label>
          </div>

          {err && <p className={styles.error}>{err}</p>}

          <button type="submit" className={styles.button}>
            Entrar
          </button>
        </div>

        <div className={styles.containerLoginImg}>
          <div className={styles.imgLogin}>
            <img src={`${imgBasePath}imgLogin.png`} alt="Login" />
          </div>
        </div>
      </form>
    </section>
  );
}

// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AuthForm.css'; 

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Ошибка входа:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Неверный email или пароль.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Некорректный формат email.');
      } else {
        setError('Не удалось войти. Пожалуйста, попробуйте еще раз.');
      }
      setLoading(false);
    }
    
  };

  return (
    <div className="authFormContainer"> {/* Используем новый класс */}
      <form onSubmit={handleSubmit} className="authForm"> {/* Используем новый класс */}
        <h2>Вход в Prosum</h2> {/* Заголовок остался, будет стилизован через .authForm h2 */}
        
        {error && <p className="errorMessage">{error}</p>} {/* Используем новый класс */}
        
        <div className="formGroup"> {/* Оборачиваем каждую группу label-input */}
          <label htmlFor="email" className="formLabel">Email:</label> {/* Можно добавить formLabel, если он определен в AuthForm.css или index.css */}
          <input
            type="email"
            id="email"
            className="formControl" /* Используем formControl или специфичный для AuthForm инпут */
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>
        
        <div className="formGroup">
          <label htmlFor="password" className="formLabel">Пароль:</label>
          <input
            type="password"
            id="password"
            className="formControl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
          />
        </div>
        
        <button type="submit" className="buttonSubmit" disabled={loading}> {/* Используем новый класс */}
          {loading ? 'Вход...' : 'Войти'}
        </button>
        
        <p className="switchFormLink"> {/* Используем новый класс */}
          Нет аккаунта? <Link to="/signup">Зарегистрироваться</Link>
        </p>
      </form>
    </div>
  );
}
export default LoginPage;
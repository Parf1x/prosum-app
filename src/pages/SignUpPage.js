// src/pages/SignUpPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AuthForm.css'; // Убедитесь, что этот файл импортируется и содержит новые стили

function SignUpPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) { // Добавил проверку на пустое имя
        return setError('Пожалуйста, укажите ваше имя или никнейм.');
    }
    if (password !== confirmPassword) {
      return setError('Пароли не совпадают');
    }
    if (password.length < 6) {
        return setError('Пароль должен быть не менее 6 символов');
    }
    setError('');
    setLoading(true);
    try {
      await signup(email, password, displayName.trim()); // Передаем displayName
      navigate('/dashboard');
    } catch (err) {
      console.error("Ошибка регистрации:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Этот email уже зарегистрирован.');
      } else if (err.code === 'auth/weak-password') {
        setError('Пароль слишком слабый. Используйте не менее 6 символов.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Некорректный формат email.');
      } else {
        setError('Не удалось создать аккаунт. Пожалуйста, попробуйте еще раз.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="authFormContainer"> {/* Используем новый класс */}
      <form onSubmit={handleSubmit} className="authForm"> {/* Используем новый класс */}
        <h2>Регистрация в Prosum</h2> {/* Заголовок */}
        
        {error && <p className="errorMessage">{error}</p>} {/* Используем новый класс */}
        
        <div className="formGroup">
          <label htmlFor="displayName" className="formLabel">Имя (или никнейм):</label>
          <input
            type="text"
            id="displayName"
            className="formControl"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Ваше имя"
            required
          />
        </div>

        <div className="formGroup">
          <label htmlFor="email" className="formLabel">Email:</label>
          <input
            type="email"
            id="email"
            className="formControl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>
        
        <div className="formGroup">
          <label htmlFor="password" className="formLabel">Пароль (мин. 6 симв.):</label>
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

        <div className="formGroup">
          <label htmlFor="confirmPassword" className="formLabel">Подтвердите пароль:</label>
          <input
            type="password"
            id="confirmPassword"
            className="formControl"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="********"
            required
          />
        </div>
        
        <button type="submit" className="buttonSubmit" disabled={loading}> {/* Используем новый класс */}
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
        
        <p className="switchFormLink"> {/* Используем новый класс */}
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </form>
    </div>
  );
}
export default SignUpPage;
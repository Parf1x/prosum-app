// src/components/layout/Header.js
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
// Убедитесь, что index.css импортируется глобально

function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };

  const getNavLinkClass = ({ isActive }) => {
    // Предполагаем, что базовые стили для NavLink (текстовых ссылок) есть в index.css
    // через селектор типа .app-header nav 
    // Здесь добавляем только класс для активного состояния.
    return isActive ? "active-nav-link" : ""; 
  };

  // Инлайновые стили для кнопки "Выйти"
  const logoutButtonStyle = {
    backgroundColor: 'transparent',
    color: 'var(--header-text-color, white)',       // Белый текст
    borderColor: 'var(--primary-color, #4a90e2)', // Синяя рамка
    borderWidth: '1px',
    borderStyle: 'solid',
    marginLeft: 'var(--spacing-lg, 24px)', // Увеличенный отступ слева (убедитесь, что --spacing-lg определена в :root)
    padding: '0.5rem 1rem', // Стандартный паддинг кнопки, чтобы текст был по центру
    fontSize: '0.9rem',     // Стандартный размер шрифта кнопки
    borderRadius: 'var(--border-radius, 6px)', // Стандартное скругление
    cursor: 'pointer',
    lineHeight: '1.2',      // Для выравнивания текста
    display: 'inline-flex', // Для align-items и justify-content
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease', // Плавный переход для hover
  };

  const logoutButtonHoverStyle = { // Стиль для hover, если не хотите делать через CSS :hover
    backgroundColor: 'var(--primary-color, #4a90e2)',
    color: 'var(--text-on-primary, white)',
  };


  return (
    <header className="app-header"> 
      <div className="header-container">
        <Link to="/" className="logo">PROSUM.</Link>
        <nav> 
          <NavLink to="/" className={getNavLinkClass} end>Главная</NavLink>
          <NavLink to="/about" className={getNavLinkClass}>О нас</NavLink>
          <NavLink to="/contact" className={getNavLinkClass}>Контакты</NavLink>

          {currentUser ? (
            <>
              <NavLink to="/dashboard" className={getNavLinkClass}>Панель</NavLink>
              <NavLink to="/profile" className={getNavLinkClass}>
                Профиль ({currentUser.displayName || currentUser.email})
              </NavLink>
              <button 
                onClick={handleLogout} 
                style={logoutButtonStyle}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = logoutButtonHoverStyle.backgroundColor;
                    e.currentTarget.style.color = logoutButtonHoverStyle.color;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = logoutButtonStyle.backgroundColor;
                    e.currentTarget.style.color = logoutButtonStyle.color;
                }}
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={getNavLinkClass}>Вход</NavLink>
              {/* Кнопка "Регистрация" остается с классами */}
              <NavLink 
                to="/signup" 
                className="header-button header-button-primary" 
              >
                Регистрация
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
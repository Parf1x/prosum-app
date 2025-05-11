// src/pages/ContactPage.js
import React from 'react';

// SVG иконка для Email (конверт)
const EmailIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

// SVG иконка для Телефона
const PhoneIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);


function ContactPage() {
  const contentCardStyle = {
    backgroundColor: 'var(--surface-color)', 
    padding: 'var(--spacing-xl, 32px) var(--spacing-lg, 24px)', 
    borderRadius: 'var(--border-radius, 6px)',
    boxShadow: 'var(--box-shadow, 0 4px 12px rgba(0,0,0,0.2))',
    maxWidth: '750px', 
    margin: 'var(--spacing-xl, 32px) auto',
    textAlign: 'left', 
  };

  const headerStyle = {
    marginBottom: 'var(--spacing-xl, 32px)',
    textAlign: 'center',
    paddingBottom: 'var(--spacing-lg, 24px)',
  };

  const h1Style = {
    color: 'var(--text-color, #f5f5f7)',
    fontSize: '2.5rem',
    borderBottom: '3px solid var(--success-color, #2ecc71)',
    display: 'inline-block',
    paddingBottom: 'var(--spacing-sm, 8px)',
    marginBottom: 0, 
  };

  const introTextStyle = {
    fontSize: '1.15rem',
    lineHeight: '1.8',
    color: 'var(--text-color-secondary, #b0b8c4)',
    marginBottom: 'var(--spacing-xl, 32px)',
    textAlign: 'center',
  };
  
  const contactSectionTitleStyle = {
     color: 'var(--text-color, #f5f5f7)', 
     fontSize: '1.75rem', 
     marginBottom: 'var(--spacing-lg, 24px)',
     textAlign: 'center',
     borderTop: '1px solid var(--border-color, #40434E)',
     paddingTop: 'var(--spacing-xl, 32px)',
  };

  const contactListStyle = {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', // Выравниваем элементы по левому краю
    gap: 'var(--spacing-lg, 24px)',
  };

  const contactItemStyle = {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.1rem',
    color: 'var(--text-color-secondary, #b0b8c4)',
  };

  const contactIconStyle = { // Обновленный стиль для SVG иконок
    marginRight: 'var(--spacing-md, 16px)',
    color: 'var(--secondary-color, #50e3c2)', // Цвет иконки
    // Размер будет задан в компоненте иконки
  };

  const contactLinkStyle = {
    color: 'var(--text-color, #f5f5f7)',
    textDecoration: 'none',
    fontWeight: 'var(--font-weight-medium, 500)',
    transition: 'color 0.2s ease',
  };
   
  return (
    <div className="page-container"> 
      <div style={contentCardStyle}>
        <header style={headerStyle}>
          <h1 style={h1Style}>Свяжитесь с нами</h1>
        </header>

        <section>
          <p style={introTextStyle}>
            Если у вас возникли вопросы, есть предложения по улучшению Prosum, 
            или вы просто хотите поделиться своим мнением — мы всегда рады вас выслушать!
            Пожалуйста, обращайтесь по указанным ниже контактам:
          </p>
        </section>

        <section>
          <h2 style={contactSectionTitleStyle}>Наши контакты</h2>
          <div style={contactListStyle}>
            <div style={contactItemStyle}>
              <span style={contactIconStyle}> {/* Обертка для SVG */}
                <EmailIcon size={22} /> {/* Используем SVG компонент */}
              </span>
              <strong>Email:</strong> 
              <a href="mailto:danikparfenyuk@gmail.com" style={contactLinkStyle}
                 onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-color)'}
                 onMouseLeave={e => e.currentTarget.style.color = 'var(--text-color)'}>
                danikparfenyuk@gmail.com
              </a>
            </div>
            <div style={contactItemStyle}>
              <span style={contactIconStyle}> {/* Обертка для SVG */}
                <PhoneIcon size={22} /> {/* Используем SVG компонент */}
              </span>
              <strong>Телефон:</strong> 
              <a href="tel:+375297550285" style={contactLinkStyle}
                 onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-color)'}
                 onMouseLeave={e => e.currentTarget.style.color = 'var(--text-color)'}>
                +375297550285
              </a>
            </div>
          </div>
          <p style={{marginTop: 'var(--spacing-xl, 32px)', fontSize: '1rem', fontStyle: 'italic', textAlign: 'center'}}>
            Мы стараемся отвечать на все обращения в кратчайшие сроки.
          </p>
        </section>
      </div>
    </div>
  );
}

export default  ContactPage; // Убедитесь, что имя файла ContactPage.js, если это страница контактов
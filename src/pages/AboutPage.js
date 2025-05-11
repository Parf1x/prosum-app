// src/pages/AboutPage.js
import React from 'react';

// --- SVG Иконки (можно вынести в отдельный файл или библиотеку) ---
const MissionIcon = ({ size = 28, color = 'currentColor' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path> {/* Щит */}
    <path d="m9 12 2 2 4-4"></path> {/* Галочка внутри */}
  </svg>
);

const WhyIcon = ({ size = 28, color = 'currentColor' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line> {/* Вопросительный знак */}
  </svg>
);

const FutureIcon = ({ size = 28, color = 'currentColor' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path> {/* Стрелка вправо */}
  </svg>
);
// --------------------------------------------------------------------

function AboutPage() {
  const contentCardStyle = {
    backgroundColor: 'var(--surface-color, #2c2f36)',
    padding: 'var(--spacing-xl, 32px) var(--spacing-lg, 24px)',
    borderRadius: 'var(--border-radius, 6px)',
    boxShadow: 'var(--box-shadow, 0 4px 12px rgba(0,0,0,0.2))',
    maxWidth: '900px',
    margin: 'var(--spacing-xl, 32px) auto',
    color: 'var(--text-color, #f5f5f7)',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: 'var(--spacing-xl, 32px)',
    paddingBottom: 'var(--spacing-lg, 24px)',
    borderBottom: '1px solid var(--border-color, #40434E)',
  };

  const h1Style = {
    color: 'var(--text-color, #f5f5f7)',
    fontSize: '2.5rem', // Крупный заголовок
    fontWeight: 'var(--font-weight-bold, 700)',
    textTransform: 'uppercase', // Заглавные буквы
    letterSpacing: '1px',
  };

  const sectionStyle = {
    marginBottom: 'var(--spacing-xl, 32px)',
    paddingBottom: 'var(--spacing-lg, 24px)',
    borderBottom: '1px solid var(--border-color-light, #5a627a)', // Более светлый разделитель
  };

  const lastSectionStyle = { ...sectionStyle, borderBottom: 'none', marginBottom: 0, paddingBottom: 0 };

  const sectionTitleStyle = {
    display: 'flex', // Для иконки и текста в ряд
    alignItems: 'center',
    color: 'var(--secondary-color, #50e3c2)', // Акцентный цвет (бирюзовый) для подзаголовков
    fontSize: '1.9rem', // Сделаем крупнее
    marginBottom: 'var(--spacing-lg, 24px)', // Больше отступ под заголовком секции
    fontWeight: 'var(--font-weight-semibold, 600)',
  };

  const iconStyle = {
    marginRight: 'var(--spacing-md, 16px)', // Отступ иконки от текста
  };

  const paragraphStyle = {
    color: 'var(--text-color-secondary, #b0b8c4)',
    lineHeight: 1.7,
    fontSize: '1.05rem', // Чуть крупнее текст параграфов
    marginBottom: 'var(--spacing-md, 16px)',
  };

  const listStyle = {
    listStyleType: 'none', // Убираем стандартные маркеры
    paddingLeft: 0,
  };

  const listItemStyle = {
    marginBottom: 'var(--spacing-md, 16px)', // Увеличим отступ между элементами списка
    paddingLeft: 'var(--spacing-lg, 24px)', // Отступ для кастомного маркера/иконки
    position: 'relative', // Для позиционирования псевдоэлемента-маркера
    lineHeight: 1.7,
  };

  // Стиль для псевдоэлемента-маркера списка (можно использовать SVG или символ)
  const listItemBeforeStyle = {
    content: '"✓"', // Галочка (можно заменить на SVG или другую иконку)
    position: 'absolute',
    left: '0',
    top: '4px', // Подберите позицию
    color: 'var(--success-color, #2ecc71)', // Зеленый маркер
    fontWeight: 'var(--font-weight-bold, 700)',
    fontSize: '1.1em',
  };
  // Если не хотите псевдоэлементы, можно просто добавить <li><span>✔ </span> Текст</li>

  const strongTextStyle = {
    color: 'var(--text-color, #f5f5f7)', // Выделенный текст делаем ярче
    fontWeight: 'var(--font-weight-semibold, 600)',
  };

  return (
    <div className="page-container"> 
      <div style={contentCardStyle}> 
        <header style={headerStyle}>
          <h1 style={h1Style}>О Prosum</h1>
        </header>

        <article>
          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}><span style={iconStyle}><MissionIcon color="var(--secondary-color)" /></span>Наша миссия</h2>
            <p style={paragraphStyle}>
              Prosum создан, чтобы предоставить вам интуитивно понятный и мощный инструмент 
              для планирования бюджета ваших проектов. Мы стремимся помочь фрилансерам, 
              небольшим командам и индивидуальным предпринимателям легко и эффективно 
              управлять финансовой стороной своей деятельности, избегая сложных таблиц 
              и запутанных расчетов.
            </p>
            <p style={paragraphStyle}>
              Наша цель — позволить вам сосредоточиться на творчестве и реализации ваших идей, 
              в то время как Prosum позаботится о точном планировании бюджета.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}><span style={iconStyle}><WhyIcon color="var(--secondary-color)" /></span>Почему Prosum?</h2>
            <ul style={listStyle}>
              <li style={listItemStyle}>
                {/* Можно добавить псевдоэлемент ::before к li для кастомных маркеров */}
                <span style={listItemBeforeStyle}></span> {/* Или так, если не хотите CSS псевдоэлемент */}
                <strong style={strongTextStyle}>Детальное планирование:</strong> Разбивайте проекты на этапы (виды работ), 
                назначайте участников, указывайте их плановые часы и индивидуальные ставки.
              </li>
              <li style={listItemStyle}>
                <span style={listItemBeforeStyle}></span>
                <strong style={strongTextStyle}>Прозрачный расчет:</strong> Автоматический подсчет стоимости каждого этапа 
                и общего бюджета проекта на основе введенных данных.
              </li>
              <li style={listItemStyle}>
                <span style={listItemBeforeStyle}></span>
                <strong style={strongTextStyle}>Контроль и гибкость:</strong> Легко редактируйте задачи, участников и их параметры 
                в любое время. Отслеживайте изменения и управляйте общим бюджетом.
              </li>
              <li style={listItemStyle}>
                <span style={listItemBeforeStyle}></span>
                <strong style={strongTextStyle}>Удобный интерфейс:</strong> Мы работаем над тем, чтобы интерфейс был максимально 
                понятным и не требовал долгого изучения.
              </li>
              <li style={listItemStyle}>
                <span style={listItemBeforeStyle}></span>
                <strong style={strongTextStyle}>Безопасность данных:</strong> Использование Firebase обеспечивает надежное хранение 
                и защиту вашей информации.
              </li>
            </ul>
          </section>

          <section style={lastSectionStyle}> 
            <h2 style={sectionTitleStyle}><span style={iconStyle}><FutureIcon color="var(--secondary-color)" /></span>Наши планы на будущее</h2>
            <p style={paragraphStyle}>
              Prosum находится в активной разработке. В будущем мы планируем добавить:
            </p>
            <ul style={listStyle}>
              <li style={listItemStyle}><span style={listItemBeforeStyle}></span>Более продвинутые отчеты и аналитику по проектам.</li>
              <li style={listItemStyle}><span style={listItemBeforeStyle}></span>Возможность отслеживания фактических затрат и сравнения с планом.</li>
              <li style={listItemStyle}><span style={listItemBeforeStyle}></span>Интеграции с другими сервисами.</li>
              <li style={listItemStyle}><span style={listItemBeforeStyle}></span>Функции для командной работы и распределения ролей.</li>
              <li style={listItemStyle}><span style={listItemBeforeStyle}></span>И многое другое, основываясь на ваших отзывах и пожеланиях!</li>
            </ul>
            <p style={{...paragraphStyle, marginTop: 'var(--spacing-lg)', textAlign: 'center', fontStyle: 'italic'}}>
              Спасибо, что выбрали Prosum! Мы всегда открыты для обратной связи.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}

export default AboutPage;
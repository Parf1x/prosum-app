// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './HomePage.module.css'; // Импортируем CSS модуль

// Если вы хотите импортировать изображение напрямую для использования в style,
// вам нужно будет настроить загрузчик файлов в Webpack (Create React App это делает для src).
// import heroImageFromFile from '../assets/images/hero-background.jpg'; 

function HomePage() {
  const { currentUser } = useAuth();

  return (
    <div className={styles.homePageContainer}>
      {/* Фоновое изображение будет задано через CSS для .backgroundImage */}
      <div className={styles.backgroundImage}></div>
      <div className={styles.heroOverlay}></div> {/* Оверлей для затемнения */}
      
      <div className={styles.heroContent}>
        <h1>Автоматизированное планирование бюджета проекта</h1>
        <div className={styles.featuresPreview}>
          <p>Экономия времени</p>
          <p>Контроль за бюджетом вашего проекта</p>
          <p>Удобное добавление сотрудников работающих над вашим проектом</p>
        </div>
        {/* Если у вас есть логотип PROSUM как отдельный SVG или изображение для вставки сюда: */}
        {/* <img src="/path/to/prosum-logo-small.svg" alt="Prosum" className={styles.inlineLogo} /> */}
        
        <Link 
          to={currentUser ? "/dashboard" : "/signup"} 
          className={styles.ctaButton}
        >
          Попробовать бесплатно
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
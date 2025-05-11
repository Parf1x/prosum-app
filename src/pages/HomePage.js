// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './HomePage.module.css'; // Ваш CSS модуль для основных стилей контейнеров и контента

function HomePage() {
  const { currentUser } = useAuth();

  // Определяем инлайновый стиль для div'а, который будет фоном
  const backgroundStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${process.env.PUBLIC_URL}/images/mainphoto.png)`, // <--- Используем PUBLIC_URL
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: 0, // Фон должен быть под оверлеем и контентом
  };

  return (
    // styles.homePageContainer должен иметь position: relative, 
    // чтобы .backgroundImage и .heroOverlay позиционировались относительно него.
    // Также он должен управлять размерами (min-height, display: flex и т.д.)
    <div className={styles.homePageContainer}> 
      <div style={backgroundStyle}></div> {/* Отдельный div для фонового изображения с инлайновым стилем */}
      
      <div className={styles.heroOverlay}></div> {/* Оверлей для затемнения из CSS модуля */}
      
      <div className={styles.heroContent}> {/* Контент поверх оверлея и фона, стили из CSS модуля */}
        <h1>Автоматизированное планирование бюджета проекта</h1>
        <div className={styles.featuresPreview}>
          <p>Экономия времени</p>
          <p>Контроль за бюджетом вашего проекта</p>
          <p>Удобное добавление сотрудников работающих над вашим проектом</p>
        </div>
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
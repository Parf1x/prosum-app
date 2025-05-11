// src/components/layout/Footer.js
import React from 'react';
import styles from './Footer.module.css'; // Импортируем CSS модуль

function Footer() {
  return (
    <footer className={styles.appFooter}> {/* Используем класс из модуля */}
      <div className={styles.footerContainer}> {/* Используем класс из модуля */}
        <p>© {new Date().getFullYear()} Prosum. Все права защищены.</p>
        <p>Сайт для планирования бюджета проекта.</p>
      </div>
    </footer>
  );
}

export default Footer;
// src/pages/CreateProjectPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { addProject } from '../firebase/services';

function CreateProjectPage() {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) {
      setError('Название проекта не может быть пустым.');
      return;
    }
    if (!currentUser) {
      setError('Вы должны быть авторизованы для создания проекта.');
      return;
    }
    setLoading(true); setError('');
    try {
      const projectData = {
        name: projectName.trim(),
        description: description.trim(),
      };
      await addProject(projectData, currentUser.uid);
      alert('Проект успешно создан!');
      navigate('/dashboard');
    } catch (err) {
      console.error("Ошибка при создании проекта:", err);
      setError('Не удалось создать проект. Пожалуйста, попробуйте еще раз.');
    }
    setLoading(false);
  };

  return (
    <div className="page-container"> {/* Используем общий контейнер */}
      <form onSubmit={handleSubmit} style={{maxWidth: '600px', margin: '0 auto', padding: '25px', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--box-shadow)'}}>
        <h2 style={{textAlign: 'center', marginBottom: '30px', color: 'var(--text-color)'}}>Создать новый проект</h2>
        
        {error && <p className="error-message" style={{color: 'var(--error-color)'}}>{error}</p>}
        
        <div className="form-group"> {/* Используем классы из index.css */}
          <label htmlFor="projectName" className="form-label">Название проекта:</label>
          <input
            type="text"
            id="projectName"
            className="form-control"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Например, 'Разработка сайта для кафе'"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description" className="form-label">Краткое описание (необязательно):</label>
          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            placeholder="Основные цели, задачи, ключевые особенности..."
          />
        </div>
        
        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '30px'}}>
          <button 
            type="button" 
            className="btn" // Базовый стиль кнопки
            onClick={() => navigate('/dashboard')} // Навигация на дашборд при отмене
            disabled={loading}
            style={{
              backgroundColor: 'var(--error-color)', // <--- ЗАДАЕМ КРАСНЫЙ ФОН
              color: 'white',                         // <--- ТЕКСТ ДЕЛАЕМ БЕЛЫМ для контраста
              borderColor: 'var(--error-color)'     // <--- Рамку тоже можно сделать красной
            }}
          >
            Отмена
          </button>
          <button 
            type="submit" 
            className="btn" // Базовый стиль кнопки
            disabled={loading}
            style={{backgroundColor: 'var(--success-color)', color: 'white'}} // Используем success-color для кнопки создания
          >
            {loading ? 'Создание...' : 'Создать проект'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateProjectPage;
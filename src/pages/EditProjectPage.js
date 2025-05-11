// src/pages/EditProjectPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProjectById, updateProject } from '../firebase/services';

function EditProjectPage() {
  const { projectId } = useParams();
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [originalProjectData, setOriginalProjectData] = useState(null);
  const [error, setError] = useState('');
  const [loadingData, setLoadingData] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const fetchProject = useCallback(async () => {
    if (!currentUser || !projectId) {
      setError('Не удалось загрузить данные: отсутствует пользователь или ID проекта.');
      setLoadingData(false);
      return;
    }
    setLoadingData(true); setError('');
    try {
      const projectSnap = await getProjectById(projectId);
      if (projectSnap.exists()) {
        const data = projectSnap.data();
        if (data.ownerId !== currentUser.uid) {
          setError("У вас нет прав для редактирования этого проекта.");
          setOriginalProjectData(null); 
        } else {
          setProjectName(data.name);
          setDescription(data.description || '');
          setOriginalProjectData(data);
        }
      } else {
        setError("Проект не найден.");
      }
    } catch (err) {
      console.error("Ошибка при загрузке проекта для редактирования:", err);
      setError("Не удалось загрузить данные проекта.");
    }
    setLoadingData(false);
  }, [projectId, currentUser]); // Убрал navigate, если он не используется для редиректа при ошибке загрузки

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) {
      setError('Название проекта не может быть пустым.');
      return;
    }
    if (!originalProjectData || originalProjectData.ownerId !== currentUser?.uid) {
        setError("У вас нет прав на сохранение изменений этого проекта.");
        return;
    }
    setUpdating(true); setError(''); // Сбрасываем ошибку перед отправкой
    try {
      await updateProject(projectId, {
        name: projectName.trim(),
        description: description.trim(),
      });
      alert('Проект успешно обновлен!');
      navigate(`/dashboard`);
    } catch (err) {
      console.error("Ошибка при обновлении проекта:", err);
      setError('Не удалось обновить проект. Пожалуйста, попробуйте еще раз.');
    }
    setUpdating(false);
  };

  if (loadingData) {
    return <p className="loading-message" style={{textAlign: 'center', padding: '20px'}}>Загрузка данных проекта для редактирования...</p>;
  }

  // Если есть ошибка, ИЛИ нет данных проекта (например, нет прав или проект не найден)
  // И форма не должна отображаться
  if (error || !originalProjectData || (originalProjectData && originalProjectData.ownerId !== currentUser?.uid)) {
      return (
          <div className="page-container" style={{textAlign: 'center'}}> {/* Добавил textAlign: 'center' для page-container */}
              <h2 style={{marginBottom: '25px'}}>Редактировать Проект</h2>
              <p className="error-message" style={{color: 'var(--error-color)'}}>{error || 'Данные проекта недоступны или у вас нет прав.'}</p>
              <button 
                className="btn" 
                onClick={() => navigate('/dashboard')} // Навигация на дашборд
                style={{marginTop: '20px', backgroundColor: 'var(--surface-color)', color: 'var(--text-color)'}}
              >
                На панель управления
              </button>
          </div>
      );
  }

  return (
    <div className="page-container">
      <form onSubmit={handleSubmit} style={{maxWidth: '600px', margin: '0 auto', padding: '25px', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--box-shadow)'}}>
        <h2 style={{textAlign: 'center', marginBottom: '30px', color: 'var(--text-color)'}}>Редактировать Проект</h2>
        {/* Ошибка валидации формы (если setError используется в handleSubmit для ошибок валидации) */}
        {error && !updating && <p className="error-message" style={{color: 'var(--error-color)'}}>{error}</p>}
        
        <div className="form-group">
          <label htmlFor="projectName" className="form-label">Название проекта:</label>
          <input
            type="text"
            id="projectName"
            className="form-control"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description" className="form-label">Описание проекта:</label>
          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
          />
        </div>
        
        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '30px'}}>
          <button 
            type="button" 
            className="btn"
            onClick={() => navigate(-1)} // Кнопка "Назад"
            disabled={updating}
            // Стили для кнопки "Отмена", можно использовать переменные или специфичный класс
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
            className="btn"
            disabled={updating}
            // Стили для основной кнопки действия
            style={{backgroundColor: 'var(--primary-color)', color: 'white'}} 
          >
            {updating ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProjectPage;
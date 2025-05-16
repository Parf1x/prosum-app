// src/pages/DashboardPage.js
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProjectsByOwner, deleteProjectAndTasks } from '../firebase/services';
import { format } from 'date-fns';

function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      setError('');
      getProjectsByOwner(currentUser.uid)
        .then((querySnapshot) => {
          const projectsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate ? format(doc.data().createdAt.toDate(), 'dd.MM.yyyy HH:mm') : 'N/A',
            updatedAt: doc.data().updatedAt?.toDate ? format(doc.data().updatedAt.toDate(), 'dd.MM.yyyy HH:mm') : 'N/A'
          }));
          setProjects(projectsData);
        })
        .catch(err => {
          console.error("Error fetching projects:", err);
          setError('Не удалось загрузить проекты.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setProjects([]);
      setLoading(false);
    }
  }, [currentUser]);

  const handleDeleteProject = async (projectId, projectName) => {
    if (window.confirm(`Вы уверены, что хотите удалить проект "${projectName}" и все связанные с ним задачи? Это действие необратимо.`)) {
      try {
        await deleteProjectAndTasks(projectId);
        setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
        alert('Проект и его задачи успешно удалены!');
      } catch (err) {
        console.error("Error deleting project and tasks:", err);
        alert('Ошибка при удалении проекта. Попробуйте еще раз.');
        setError('Ошибка при удалении проекта.');
      }
    }
  };

  const sortedAndFilteredProjects = useMemo(() => {
    let sortableItems = [...projects]; // Убрано подчеркивание
    if (sortConfig.key) {
         sortableItems.sort((a, b) => { // Убрано подчеркивание
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }
    return  sortableItems.filter(project => // Убрано подчеркивание
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };

  if (loading && projects.length === 0) return <p className="loading-message" style={{textAlign: 'center', padding: '20px'}}>Загрузка ваших проектов...</p>;
  if (error && projects.length === 0) return <p className="error-message" style={{ color: 'var(--error-color)', textAlign: 'center', padding: '20px' }}>{error}</p>;

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)' }}>
        <h1>Панель управления проектами</h1>
        <Link to="/project/new" className="btn" style={{backgroundColor: 'var(--success-color)', color: 'white', borderColor: 'var(--success-color)'}}>
          + Создать новый проект
        </Link>
      </div>

      <div style={{ marginBottom: '25px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Поиск по названию проекта..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
          style={{ flex: '1 1 300px', minWidth: '250px' }} 
        />
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span>Сортировать по:</span>
          <button className="btn btn-card" onClick={() => requestSort('name')}>
            Названию {getSortIndicator('name')}
          </button>
          <button className="btn btn-card" onClick={() => requestSort('createdAt')}>
            Дате создания {getSortIndicator('createdAt')}
          </button>
        </div>
      </div>
      
      {error && <p className="error-message" style={{ color: 'var(--error-color)', marginBottom: '15px' }}>{error}</p>}

      {sortedAndFilteredProjects.length === 0 ? (
        <p style={{textAlign: 'center', padding: '20px', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--border-radius)'}}>
            {projects.length > 0 ? "Проекты не найдены по вашему запросу." : "У вас пока нет проектов. Начните с создания нового!"}
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {sortedAndFilteredProjects.map(project => (
            <div key={project.id} className="card">
              <div className="cardHeader">
                <h3>
                  <Link to={`/project/${project.id}`}>{project.name}</Link>
                </h3>
              </div>
              <div className="cardBody">
                <p className="description">{project.description || 'Нет описания.'}</p>
                <p>Создан: {project.createdAt}</p>
                {project.updatedAt !== project.createdAt && <p>Обновлен: {project.updatedAt}</p>}
              </div>
              <div className="cardFooter">
                <Link 
                  to={`/project/${project.id}/edit`} 
                  className="btn btn-card" 
                  style={{backgroundColor: 'var(--secondary-color)', color: 'white', borderColor: 'var(--secondary-color)'}}
                >
                  Редактировать
                </Link>
                <button
                  onClick={() => handleDeleteProject(project.id, project.name)}
                  className="btn btn-card"
                  style={{backgroundColor: 'var(--error-color)', color: 'white', borderColor: 'var(--error-color)'}}
                  disabled={loading}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default DashboardPage;
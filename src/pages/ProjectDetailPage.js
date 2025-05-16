// src/pages/ProjectDetailPage.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  getProjectById,
  getTasksForProject,
  addTask,
  updateTask,
  deleteTask
} from '../firebase/services';
import { format } from 'date-fns';

//  стили будут браться из глобального index.css через классы

function ProjectDetailPage() {
  const { projectId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loadingProject, setLoadingProject] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [error, setError] = useState('');

  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newParticipants, setNewParticipants] = useState([{ fio: '', plannedHours: '', hourlyRate: '' }]);
  const [newLeadParticipantFIO, setNewLeadParticipantFIO] = useState('');
  const [addingTask, setAddingTask] = useState(false);
  const [addTaskError, setAddTaskError] = useState('');

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskName, setEditedTaskName] = useState('');
  const [editedParticipants, setEditedParticipants] = useState([]);
  const [editedLeadParticipantFIO, setEditedLeadParticipantFIO] = useState('');
  const [editingError, setEditingError] = useState('');
  const [isSavingTask, setIsSavingTask] = useState(false);

  const [expandedTaskParticipants, setExpandedTaskParticipants] = useState({});

  const isOwner = project && currentUser && project.ownerId === currentUser.uid;

  const fetchProjectData = useCallback(async () => {
    if (!currentUser) { setLoadingProject(false); return; }
    setLoadingProject(true); setError('');
    try {
      const projectSnap = await getProjectById(projectId);
      if (projectSnap.exists()) {
        const projectData = { id: projectSnap.id, ...projectSnap.data() };
        setProject(projectData);
        if (projectData.ownerId !== currentUser.uid) setError("У вас нет доступа к этому проекту.");
      } else { setError('Проект не найден.'); }
    } catch (err) { console.error("Ошибка при загрузке проекта:", err); setError('Не удалось загрузить данные проекта.'); }
    setLoadingProject(false);
  }, [projectId, currentUser]);

  const fetchTasks = useCallback(async () => {
    if (!project || !isOwner) { setLoadingTasks(false); return; }
    setLoadingTasks(true);
    try {
      const tasksSnapshot = await getTasksForProject(projectId);
      const tasksData = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksData);
      if (error.includes('Не удалось загрузить задачи')) setError('');
    } catch (err) {
      console.error("Ошибка при загрузке задач:", err);
      setError('Не удалось загрузить задачи. Проверьте консоль.');
    }
    setLoadingTasks(false);
  }, [projectId, project, isOwner, error]);

  useEffect(() => { fetchProjectData(); }, [fetchProjectData]);
  useEffect(() => { 
    if (project && isOwner) {
      fetchTasks(); 
    } else if (project && !isOwner) { 
      setTasks([]); 
      setLoadingTasks(false); 
    }
  }, [project, isOwner, fetchTasks]);

  const handleAddParticipantField = (type) => {
    if (type === 'new') {
      setNewParticipants(prev => [...prev, { fio: '', plannedHours: '', hourlyRate: '' }]);
    } else if (type === 'edit') {
      setEditedParticipants(prev => [...prev, { fio: '', plannedHours: '', hourlyRate: '' }]);
    }
  };

  const handleRemoveParticipantField = (index, type) => {
    if (type === 'new') {
      if (newParticipants.length <= 1) return;
      setNewParticipants(prev => prev.filter((_, i) => i !== index));
    } else if (type === 'edit') {
      if (editedParticipants.length <= 1) return;
      setEditedParticipants(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleParticipantChange = (index, field, value, type) => {
    if (type === 'new') {
      const updatedParticipants = newParticipants.map((participant, i) => 
        i === index ? { ...participant, [field]: value } : participant
      );
      setNewParticipants(updatedParticipants);
    } else if (type === 'edit') {
      const updatedParticipants = editedParticipants.map((participant, i) => 
        i === index ? { ...participant, [field]: value } : participant
      );
      setEditedParticipants(updatedParticipants);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskName.trim()) { setAddTaskError("Название задачи не может быть пустым."); return; }
    const validatedParticipants = newParticipants
      .map(p => ({ fio: p.fio.trim(), plannedHours: Number(p.plannedHours), hourlyRate: Number(p.hourlyRate) }))
      .filter(p => p.fio && p.plannedHours > 0 && p.hourlyRate >= 0);
    if (validatedParticipants.length === 0) { setAddTaskError("Добавьте хотя бы одного участника с корректными данными (ФИО, Часы > 0, Ставка >= 0)."); return; }
    
    let leadFIO = newLeadParticipantFIO.trim();
    if (leadFIO && !validatedParticipants.some(p => p.fio === leadFIO)) {
      setAddTaskError("Выбранный главный участник должен быть в списке участников задачи с корректными данными."); return;
    }
    
    
    if (!isOwner || !currentUser?.uid) { setAddTaskError(!isOwner ? "Нет прав." : "Ошибка пользователя."); return; }
    setAddingTask(true); setAddTaskError('');
    try {
      const taskData = { taskName: newTaskName.trim(), participants: validatedParticipants, leadParticipantFIO: leadFIO || null };
      await addTask(taskData, projectId, currentUser.uid);
      await fetchTasks();
      alert('Задача успешно добавлена!');
      setNewTaskName(''); setNewParticipants([{ fio: '', plannedHours: '', hourlyRate: '' }]); setNewLeadParticipantFIO(''); setShowAddTaskForm(false);
    } catch (err) { console.error("Ошибка при добавлении задачи:", err); setAddTaskError('Не удалось добавить задачу.'); }
    setAddingTask(false);
  };

  const handleDeleteTask = async (taskId, taskName) => {
    if (!isOwner) { alert("Нет прав."); return; }
    if (window.confirm(`Удалить задачу "${taskName}"?`)) {
      try { await deleteTask(taskId); await fetchTasks(); alert('Задача удалена!'); }
      catch (err) { console.error("Ошибка при удалении задачи:", err); alert('Не удалось удалить задачу.'); }
    }
  };

  const handleEditTaskClick = (task) => {
    setEditingTaskId(task.id);
    setEditedTaskName(task.taskName);
    setEditedParticipants(task.participants ? task.participants.map(p => ({ ...p })) : [{ fio: '', plannedHours: '', hourlyRate: '' }]);
    setEditedLeadParticipantFIO(task.leadParticipantFIO || '');
    setEditingError('');
  };

  const handleCancelEditTask = () => {
    setEditingTaskId(null);
    setEditedLeadParticipantFIO('');
  };

  const handleSaveTask = async (taskId) => {
    if (!editedTaskName.trim()) { setEditingError("Название задачи не может быть пустым."); return; }
    const validatedEditedParticipants = editedParticipants
        .map(p => ({ fio: p.fio.trim(), plannedHours: Number(p.plannedHours), hourlyRate: Number(p.hourlyRate) }))
        .filter(p => p.fio && p.plannedHours > 0 && p.hourlyRate >= 0);
    if (validatedEditedParticipants.length === 0) { setEditingError("Добавьте хотя бы одного участника с корректными данными для сохранения."); return; }
    
    let leadFIO = editedLeadParticipantFIO.trim();
    if (leadFIO && !validatedEditedParticipants.some(p => p.fio === leadFIO)) {
      setEditingError("Выбранный главный участник должен быть в списке участников задачи с корректными данными."); return;
    }
    
    
    if (!isOwner) { setEditingError("Нет прав."); return; }
    setIsSavingTask(true); setEditingError('');
    const updatedData = { taskName: editedTaskName.trim(), participants: validatedEditedParticipants, leadParticipantFIO: leadFIO || null };
    try {
      await updateTask(taskId, updatedData);
      setEditingTaskId(null); await fetchTasks(); alert('Задача успешно обновлена!');
    } catch (err) { console.error("Ошибка при обновлении задачи:", err); setEditingError('Не удалось обновить задачу.'); }
    setIsSavingTask(false);
  };

  const toggleParticipantsVisibility = (taskId) => {
    setExpandedTaskParticipants(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const totalProjectBudget = useMemo(() => {
    return tasks.reduce((projectAccumulator, task) => {
      const taskTotalForBudget = task.participants ? task.participants.reduce((taskAccumulator, participant) => {
        return taskAccumulator + ((Number(participant.plannedHours) || 0) * (Number(participant.hourlyRate) || 0));
      }, 0) : 0;
      return projectAccumulator + taskTotalForBudget;
    }, 0);
  }, [tasks]);

  const uniqueProjectParticipants = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];
    const allFIOs = new Set();
    tasks.forEach(task => {
      if (task.participants && task.participants.length > 0) {
        task.participants.forEach(p => { if (p.fio && p.fio.trim()) { allFIOs.add(p.fio.trim()); } });
      }
    });
    return Array.from(allFIOs);
  }, [tasks]);

  if (loadingProject) return <p className="loading-message">Загрузка данных проекта...</p>;
  if (error && !project && !error.includes('Не удалось загрузить задачи')) return <p className="error-message">{error}</p>;
  if (!project) return <p className="loading-message">Проект не найден или у вас нет к нему доступа.</p>;

  return (
    <div className="page-container">
      <header className="project-detail-header">
        <h1 className="project-detail-name">{project.name}</h1>
        {project.description && <p className="project-detail-description">{project.description}</p>}
        <p className="project-detail-meta">
          Создан: {project.createdAt?.toDate ? format(project.createdAt.toDate(), 'dd.MM.yyyy HH:mm') : 'N/A'}
          {project.updatedAt?.toDate && project.createdAt?.toDate && project.updatedAt.seconds !== project.createdAt.seconds ?
            ` (Обновлен: ${format(project.updatedAt.toDate(), 'dd.MM.yyyy HH:mm')})` : ''}
        </p>
        <p className="project-detail-meta">
          Всего работающих над проектом: {uniqueProjectParticipants.length}
        </p>
        {isOwner && (
          <Link to={`/project/${projectId}/edit`} className="btn btn-primary " style={{textDecoration: 'none'}}>
            Редактировать проект
          </Link>
        )}
      </header>

      {error && error.includes('Не удалось загрузить задачи') && <p className="error-message">{error}</p>}

      <section>
        <div className="tasks-section-header">
            <h2 className="tasks-section-title">Задачи по проекту</h2>
            {isOwner && (
                <button className="btn btn-success" onClick={() => setShowAddTaskForm(prev => !prev)}>
                    {showAddTaskForm ? 'Скрыть форму' : '+ Добавить задачу'}
                </button>
            )}
        </div>

        {isOwner && showAddTaskForm && (
          <form onSubmit={handleAddTask} className="form-card">
            <h3 className="form-title">Новая задача</h3>
            {addTaskError && <p className="error-message">{addTaskError}</p>}
            <div className="form-group">
              <label htmlFor="newTaskName" className="form-label">Название/Вид работ:</label>
              <input type="text" id="newTaskName" className="form-control" value={newTaskName} onChange={e => setNewTaskName(e.target.value)} required />
            </div>
            {newParticipants.map((participant, index) => (
              <div key={index} className="participant-form-block">
                <h5 className="participant-form-title">Участник #{index + 1}</h5>
                <div className="form-group"> <label htmlFor={`newParticipantFio-${index}`} className="form-label">ФИО:</label> <input type="text" id={`newParticipantFio-${index}`} className="form-control" value={participant.fio} onChange={(e) => handleParticipantChange(index, 'fio', e.target.value, 'new')} placeholder="ФИО участника" /> </div>
                <div className="flex-row-layout">
                  <div className="form-group flex-child-item"> <label htmlFor={`newParticipantHours-${index}`} className="form-label">Часы:</label> <input type="number" id={`newParticipantHours-${index}`} className="form-control" value={participant.plannedHours} onChange={(e) => handleParticipantChange(index, 'plannedHours', e.target.value, 'new')} min="0.1" step="0.1" placeholder="0"/> </div>
                  <div className="form-group flex-child-item"> <label htmlFor={`newParticipantRate-${index}`} className="form-label">Ставка:</label> <input type="number" id={`newParticipantRate-${index}`} className="form-control" value={participant.hourlyRate} onChange={(e) => handleParticipantChange(index, 'hourlyRate', e.target.value, 'new')} min="0" step="1" placeholder="0"/> </div>
                </div>
                {newParticipants.length > 1 && ( <button type="button" onClick={() => handleRemoveParticipantField(index, 'new')} className="btn btn-danger btn-remove-participant btn-sm"> Удалить участника </button> )}
              </div>
            ))}
            <button type="button" onClick={() => handleAddParticipantField('new')} className="btn btn-primary" style={{marginBottom: 'var(--spacing-md)'}}> + Добавить участника </button>
            {newParticipants.filter(p => p.fio && p.fio.trim()).length > 0 && (
              <div className="form-group"> <label htmlFor="newLeadParticipant" className="form-label">Главный исполнитель на задаче:</label> <select id="newLeadParticipant" className="form-control" value={newLeadParticipantFIO} onChange={(e) => setNewLeadParticipantFIO(e.target.value)}> <option value="">Не выбран</option> {newParticipants.filter(p => p.fio && p.fio.trim()).map((p, idx) => ( <option key={`new-lead-${idx}`} value={p.fio}>{p.fio}</option> ))} </select> </div>
            )}
            <hr/>
            <button type="submit" className="btn btn-success" disabled={addingTask}> {addingTask ? 'Добавление...' : 'Добавить задачу'} </button>
          </form>
        )}

        {isOwner && loadingTasks ? ( <p className="loading-message">Загрузка задач...</p> )
         : isOwner && tasks.length === 0 && !error.includes('Не удалось загрузить задачи') ? ( <div className="card" style={{textAlign: 'center'}}><p>По этому проекту еще нет задач.</p></div> )
         : !isOwner && project && project.ownerId !== currentUser?.uid && !error.includes("У вас нет доступа к этому проекту") ? ( <p className="error-message">У вас нет прав для просмотра задач этого проекта.</p> )
         : (isOwner && tasks.length > 0 && (
          <ul className="tasks-list">
            {tasks.map(task => {
              const taskTotalCost = task.participants ? task.participants.reduce((sum, p) => sum + ((Number(p.plannedHours) || 0) * (Number(p.hourlyRate) || 0)), 0) : 0;
              const areParticipantsVisible = !!expandedTaskParticipants[task.id];
              return (
                <li key={task.id} className="task-item">
                  {editingTaskId === task.id ? (
                    <div className="form-card-inner">
                      <h4 className="form-title">Редактирование: {editedTaskName}</h4>
                      {editingError && <p className="error-message">{editingError}</p>}
                      <div className="form-group"> <label htmlFor={`editTaskName-${task.id}`} className="form-label">Название задачи:</label> <input type="text" id={`editTaskName-${task.id}`} className="form-control" value={editedTaskName} onChange={(e) => setEditedTaskName(e.target.value)} /> </div>
                      {editedParticipants.map((participant, index) => (
                        <div key={index} className="participant-form-block">
                          <h5 className="participant-form-title">Участник #{index + 1}</h5>
                          <div className="form-group"> <label htmlFor={`editParticipantFio-${index}`} className="form-label">ФИО:</label> <input type="text" id={`editParticipantFio-${index}`} className="form-control" value={participant.fio} onChange={(e) => handleParticipantChange(index, 'fio', e.target.value, 'edit')} /> </div>
                          <div className="flex-row-layout">
                            <div className="form-group flex-child-item"> <label htmlFor={`editParticipantHours-${index}`} className="form-label">Часы:</label> <input type="number" id={`editParticipantHours-${index}`} className="form-control" value={participant.plannedHours} onChange={(e) => handleParticipantChange(index, 'plannedHours', e.target.value, 'edit')} min="0.1" step="0.1"/> </div>
                            <div className="form-group flex-child-item"> <label htmlFor={`editParticipantRate-${index}`} className="form-label">Ставка:</label> <input type="number" id={`editParticipantRate-${index}`} className="form-control" value={participant.hourlyRate} onChange={(e) => handleParticipantChange(index, 'hourlyRate', e.target.value, 'edit')} min="0" step="1"/> </div>
                          </div>
                          {editedParticipants.length > 1 && ( <button type="button" onClick={() => handleRemoveParticipantField(index, 'edit')} className="btn btn-danger btn-remove-participant btn-sm"> Удалить участника </button> )}
                        </div>
                      ))}
                      <button type="button" onClick={() => handleAddParticipantField('edit')} className="btn btn-primary" style={{marginBottom: 'var(--spacing-md)'}}> + Добавить участника </button>
                       {editedParticipants.filter(p => p.fio && p.fio.trim()).length > 0 && (
                        <div className="form-group"> <label htmlFor={`editLeadParticipant-${task.id}`} className="form-label">Главный исполнитель:</label> <select id={`editLeadParticipant-${task.id}`} className="form-control" value={editedLeadParticipantFIO} onChange={(e) => setEditedLeadParticipantFIO(e.target.value)}> <option value="">Не выбран</option> {editedParticipants.filter(p => p.fio && p.fio.trim()).map((p, idx) => ( <option key={`edit-lead-${idx}`} value={p.fio}>{p.fio}</option> ))} </select> </div>
                      )}
                      <hr/>
                      <div className="task-actions-footer"> <button className="btn btn-primary" onClick={() => handleSaveTask(task.id)} disabled={isSavingTask}> {isSavingTask ? 'Сохранение...' : 'Сохранить'} </button> <button className="btn btn-danger" onClick={handleCancelEditTask} disabled={isSavingTask}> Отмена </button> </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h3 className="task-item-title">{task.taskName}</h3>
                        {task.leadParticipantFIO && 
                         <p className="task-details-text" style={{ color: 'var(--text-color-secondary)' }}> 
                         <strong style={{ color: 'var(--text-color)', fontWeight: 'var(--font-weight-semibold)' }}>Главный:</strong> {task.leadParticipantFIO}
                       </p>
                        }
                        {task.participants && task.participants.length > 0 ? (
                          <>
                            <p className="task-details-text" style={{display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)'}}>
                              <strong style={{color: 'var(--text-color)'}}>Участники ({task.participants.length}) </strong>
                              <button onClick={() => toggleParticipantsVisibility(task.id)} className="btn btn-sm">
                                {areParticipantsVisible ? 'Скрыть' : 'Показать'}
                              </button>
                            </p>
                            {areParticipantsVisible && ( 
                              <ul style={{paddingLeft: '20px', listStyleType: 'disc', marginTop: '5px'}}>
                                {task.participants.map((p, idx) => (
                                  <li key={idx} style={{marginBottom: '3px', color: 'var(--text-color-secondary)'}}>
                                    {p.fio || 'Не указан'} (Часы: {p.plannedHours}, Ставка: {p.hourlyRate} руб./час)
                                  </li>
                                ))}
                              </ul>
                            )}
                          </>
                        ) : ( <p className="task-details-text">Участники не назначены</p> )}
                        <p className="task-details-text" style={{marginTop: '10px', fontSize: '1.05em'}}>
                            <strong style={{color: 'var(--text-color)'}}>Общая стоимость задачи:</strong> 
                            <span style={{color: 'var(--text-color-secondary)'}}> {taskTotalCost.toLocaleString('ru-RU', {style: 'currency', currency: 'BYN', minimumFractionDigits: 2})}</span>
                        </p>
                        <p className="task-date-info">Добавлена: {task.createdAt?.toDate ? format(task.createdAt.toDate(), 'dd.MM.yyyy HH:mm') : 'N/A'}</p>
                      </div>
                      {isOwner && (
                        <div className="task-actions-footer">
                          <button className="btn btn-primary" onClick={() => handleEditTaskClick(task)}> Редактировать </button>
                          <button className="btn btn-danger" onClick={() => handleDeleteTask(task.id, task.taskName )}> Удалить </button>
                        </div>
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        ))}
      </section>

      {isOwner && tasks.length > 0 && (
          <div className="budget-summary-block">
            Общий планируемый бюджет проекта: {totalProjectBudget.toLocaleString('ru-RU', {style: 'currency', currency: 'BYN', minimumFractionDigits: 2})}
          </div>
      )}
    </div>
  );
}

export default ProjectDetailPage;
// src/pages/UserProfilePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// --- SVG Иконки ---
const UserIcon = ({ size = 20, color = 'currentColor' }) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> );
const MailIcon = ({ size = 20, color = 'currentColor' }) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> );
const IdCardIcon = ({ size = 20, color = 'currentColor' }) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg> );
const EditIcon = ({ size = 16, color = 'currentColor'}) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg> );
const LockIcon = ({ size = 16, color = 'currentColor'}) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> );
const TrashIcon = ({ size = 16, color = 'currentColor'}) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg> );
// ------------------------------------

function UserProfilePage() {
  const { currentUser, updateUserDisplayName, updateUserPassword, deleteCurrentUserAccount } = useAuth();
  const navigate = useNavigate();

  const [isEditingName, setIsEditingName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(currentUser?.displayName || '');
  const [nameStatus, setNameStatus] = useState({ error: '', success: '', loading: false });

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState({ error: '', success: '', loading: false });

  useEffect(() => {
    if (currentUser) {
      setNewDisplayName(currentUser.displayName || '');
    }
  }, [currentUser]); // Зависимость только от currentUser, чтобы избежать лишних вызовов, если displayName не изменился

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    if (!newDisplayName.trim()) { setNameStatus({ error: "Имя не может быть пустым.", success: '', loading: false }); return; }
    if (newDisplayName.trim() === (currentUser?.displayName || '')) { setIsEditingName(false); return; }
    setNameStatus({ error: '', success: '', loading: true });
    try {
      await updateUserDisplayName(newDisplayName.trim());
      setNameStatus({ error: '', success: "Имя успешно обновлено!", loading: false });
      setIsEditingName(false);
      setTimeout(() => setNameStatus(prev => ({ ...prev, success: ''})), 3000);
    } catch (err) {
      setNameStatus({ error: "Не удалось обновить имя: " + err.message, success: '', loading: false });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) { setPasswordStatus({ error: "Пароль должен быть не менее 6 символов.", success: '', loading: false }); return; }
    if (newPassword !== confirmNewPassword) { setPasswordStatus({ error: "Пароли не совпадают.", success: '', loading: false }); return; }
    setPasswordStatus({ error: '', success: '', loading: true });
    try {
      await updateUserPassword(newPassword);
      setPasswordStatus({ error: '', success: "Пароль успешно изменен!", loading: false });
      setIsChangingPassword(false); setNewPassword(''); setConfirmNewPassword('');
      setTimeout(() => setPasswordStatus(prev => ({ ...prev, success: ''})), 3000);
    } catch (err) {
      let errMsg = "Не удалось изменить пароль.";
      if (err.code === 'auth/requires-recent-login') {
        errMsg = "Эта операция требует недавней аутентификации. Пожалуйста, выйдите и войдите снова, затем попробуйте еще раз.";
      } else if (err.message) {
        errMsg += " " + err.message;
      }
      setPasswordStatus({ error: errMsg, success: '', loading: false });
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо, и все ваши данные (включая проекты и задачи) будут потеряны.")) {
      if (window.confirm("ПОСЛЕДНЕЕ ПРЕДУПРЕЖДЕНИЕ: Точно удалить аккаунт?")) {
        try {
          await deleteCurrentUserAccount();
          alert("Аккаунт успешно удален. Вы будете перенаправлены на главную страницу.");
          navigate('/');
        } catch (error) {
          console.error("Ошибка удаления аккаунта на странице профиля:", error);
          let errMsg = "Не удалось удалить аккаунт.";
          if (error.code === 'auth/requires-recent-login') {
            errMsg = "Эта операция требует недавней аутентификации. Пожалуйста, выйдите и войдите снова, затем попробуйте еще раз.";
          } else if (error.message) {
            errMsg += " " + error.message;
          }
          alert(errMsg);
        }
      }
    }
  };

  if (!currentUser) {
    return <div className="page-container"><p className="loading-message">Загрузка данных пользователя...</p></div>;
  }

  let avatarText = '?';
  if (currentUser.displayName) {
    const names = currentUser.displayName.split(' ');
    avatarText = names[0][0].toUpperCase() + (names.length > 1 ? names[1][0].toUpperCase() : '');
  } else if (currentUser.email) {
    avatarText = currentUser.email.charAt(0).toUpperCase();
  }

  return (
    <div className="page-container">
      <div className="form-card" style={{maxWidth: '700px', margin: 'var(--spacing-xl) auto'}}> {/* Используем класс form-card */}
        <header style={{textAlign: 'center', marginBottom: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-lg)', borderBottom: '1px solid var(--border-color)'}}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'var(--text-on-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'var(--font-weight-bold)', margin: '0 auto var(--spacing-md)', border: '3px solid var(--surface-highlight-color)'}}>
              {avatarText}
          </div>
          {currentUser.displayName && (
             <h1 style={{fontSize: '2.2rem', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-color)', margin: '0 0 var(--spacing-sm) 0'}}>{currentUser.displayName}</h1>
          )} 
          <h2 style={{fontSize: '1.4rem', color: 'var(--text-color-secondary)', fontWeight: 'var(--font-weight-normal)', marginTop: currentUser.displayName ? 'var(--spacing-xs)' : 'var(--spacing-md)'}}>Профиль пользователя</h2>
        </header>

        <section style={{marginTop: 'var(--spacing-lg)'}}>
          {/* Редактирование имени */}
          {!isEditingName ? (
            <div className="form-group" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color-light)', paddingBottom: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)'}}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <span style={{marginRight: 'var(--spacing-md)', color: 'var(--text-color-secondary)'}}><UserIcon /></span>
                <div>
                  <span className="form-label" style={{marginBottom: 'var(--spacing-xs)', display: 'inline'}}>Имя в системе: </span>
                  <span style={{color: 'var(--text-color)', wordBreak: 'break-word'}}>{currentUser.displayName || <em style={{color: 'var(--text-color-secondary)'}}>Не указано</em>}</span>
                </div>
              </div>
              <button onClick={() => { setIsEditingName(true); setNameStatus({error: '', success: '', loading: false}); }} className="btn btn-sm btn-link-style" title="Редактировать имя">
                <EditIcon />
              </button>
            </div>
          ) : (
            <form onSubmit={handleNameSubmit} className="form-group" style={{borderBottom: '1px solid var(--border-color-light)', paddingBottom: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)'}}>
              <label htmlFor="newDisplayName" className="form-label">Новое имя:</label>
              <input type="text" id="newDisplayName" className="form-control" value={newDisplayName} onChange={(e) => setNewDisplayName(e.target.value)} autoFocus />
              {nameStatus.error && <p className="error-message" style={{marginTop: 'var(--spacing-sm)'}}>{nameStatus.error}</p>}
              {nameStatus.success && <p style={{color: 'var(--success-color)', marginTop: 'var(--spacing-sm)', textAlign:'center'}}>{nameStatus.success}</p>}
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)'}}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setIsEditingName(false); setNewDisplayName(currentUser.displayName || ''); setNameStatus({error: '', success: '', loading: false}); }}>Отмена</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={nameStatus.loading}>{nameStatus.loading ? "Сохранение..." : "Сохранить имя"}</button>
              </div>
            </form>
          )}

          <div className="form-group" style={{display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-color-light)', paddingBottom: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)'}}>
            <span style={{marginRight: 'var(--spacing-md)', color: 'var(--text-color-secondary)'}}><MailIcon /></span>
            <span className="form-label" style={{marginBottom: 0, marginRight: 'var(--spacing-sm)', minWidth: '112px'}}>Email:</span>
            <span style={{color: 'var(--text-color)', wordBreak: 'break-word'}}>{currentUser.email}</span>
          </div>
         
          <div className="form-group" style={{display: 'flex', alignItems: 'center', paddingTop: 'var(--spacing-sm)'}}> {/* Убрал нижнюю границу у последнего элемента */}
            <span style={{marginRight: 'var(--spacing-md)', color: 'var(--text-color-secondary)'}}><IdCardIcon /></span>
            <span className="form-label" style={{marginBottom: 0, marginRight: 'var(--spacing-sm)', minWidth: '112px'}}>User ID:</span>
            <span style={{color: 'var(--text-color)', wordBreak: 'break-word', fontSize: '0.9em'}}>{currentUser.uid}</span>
          </div>
        </section>

        {/* Секция смены пароля */}
        <section style={{marginTop: 'var(--spacing-xl)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--border-color)'}}>
            {!isChangingPassword ? (
                 <div style={{textAlign: 'center'}}>
                    <button className="btn btn-success" onClick={() => { setIsChangingPassword(true); setPasswordStatus({error: '', success: '', loading: false}); }}>
                        <LockIcon size={16} style={{marginRight: 'var(--spacing-sm)'}} /> Изменить пароль
                    </button>
                 </div>
            ) : (
                <form onSubmit={handlePasswordSubmit} className="form-card" style={{margin:'var(--spacing-md) 0 0 0', padding: 'var(--spacing-lg)', backgroundColor: 'var(--surface-highlight-color)'}}>
                    <h3 style={{fontSize: '1.3em', marginBottom: 'var(--spacing-lg)', textAlign: 'center', color: 'var(--text-color)'}}>Смена пароля</h3>
                    <div className="form-group">
                        <label htmlFor="newPassword" className="form-label">Новый пароль (мин. 6 символов):</label>
                        <input type="password" id="newPassword" className="form-control" value={newPassword} onChange={e => setNewPassword(e.target.value)} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmNewPassword" className="form-label">Подтвердите новый пароль:</label>
                        <input type="password" id="confirmNewPassword" className="form-control" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} required/>
                    </div>
                    {passwordStatus.error && <p className="error-message">{passwordStatus.error}</p>}
                    {passwordStatus.success && <p style={{color: 'var(--success-color)', textAlign:'center'}}>{passwordStatus.success}</p>}
                    <div style={{display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)'}}>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => { setIsChangingPassword(false); setPasswordStatus({error: '', success: '', loading: false}); setNewPassword(''); setConfirmNewPassword(''); }}>Отмена</button>
                        <button type="submit" className="btn btn-primary btn-sm" disabled={passwordStatus.loading}>{passwordStatus.loading ? "Сохранение..." : "Сохранить пароль"}</button>
                    </div>
                </form>
            )}
        </section>
        
        {/* Секция удаления аккаунта */}
        <section style={{marginTop: 'var(--spacing-xl)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--border-color)', textAlign: 'center'}}>
            {/* УДАЛЕН ЗАГОЛОВОК H3 "УДАЛЕНИЕ АККАУНТА" */}
            <p style={{fontSize: '0.9em', marginBottom: 'var(--spacing-md)', color: 'var(--text-color-secondary)'}}>
                Внимание! Это действие необратимо и приведет к удалению всех ваших данных.
            </p>
            <button 
              className="btn btn-danger" 
              onClick={handleDeleteAccount}
              style={{marginTop: 'var(--spacing-sm)'}}
            >
                <TrashIcon size={16} style={{marginRight: 'var(--spacing-sm)'}} /> Удалить мой аккаунт
            </button>
        </section>
      </div>
    </div>
  );
}

export default UserProfilePage;
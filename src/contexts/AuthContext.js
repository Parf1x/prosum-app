// src/contexts/AuthContext.js
import React, { useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config'; // Путь к вашей конфигурации
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,        // Для смены пароля
  deleteUser,            // <--- ДЛЯ УДАЛЕНИЯ ПОЛЬЗОВАТЕЛЯ
  // reauthenticateWithCredential, // Может понадобиться для deleteUser или updatePassword
  // EmailAuthProvider,            // Для reauthenticateWithCredential
} from 'firebase/auth';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function signup(email, password, displayName) {
    return createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        if (userCredential.user) {
          return updateProfile(userCredential.user, {
            displayName: displayName || "User"
          });
        }
      });
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  async function updateUserDisplayName(name) {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: name
      });
      setCurrentUser(prevUser => ({ ...prevUser, displayName: name }));
      return auth.currentUser;
    } else {
      throw new Error("Нет активного пользователя для обновления имени.");
    }
  }

  async function updateUserPassword(newPassword) {
    if (auth.currentUser) {
      // ВАЖНО: Firebase может потребовать недавнюю аутентификацию для этой операции.
      // Если возникает ошибка auth/requires-recent-login, нужно будет реализовать
      // reauthenticateWithCredential(currentUser, EmailAuthProvider.credential(currentUser.email, currentPassword))
      // перед вызовом updatePassword.
      await updatePassword(auth.currentUser, newPassword);
      return auth.currentUser;
    } else {
      throw new Error("Нет активного пользователя для смены пароля.");
    }
  }

  // --- НОВАЯ ФУНКЦИЯ ДЛЯ УДАЛЕНИЯ АККАУНТА ---
  async function deleteCurrentUserAccount() {
    if (auth.currentUser) {
      // ВАЖНО: Эта операция также является чувствительной и может потребовать
      // недавней аутентификации (reauthentication), как и смена пароля.
      // Если возникает ошибка auth/requires-recent-login, потребуется reauthentication.
      try {
        await deleteUser(auth.currentUser);
        // После успешного удаления, currentUser станет null через onAuthStateChanged,
        // и приложение должно будет перенаправить пользователя (например, на страницу входа или главную).
        console.log("Аккаунт пользователя успешно удален.");
      } catch (error) {
        console.error("Ошибка при удалении аккаунта:", error);
        throw error; // Перебрасываем ошибку для обработки в компоненте
      }
    } else {
      throw new Error("Нет активного пользователя для удаления аккаунта.");
    }
  }
  // ----------------------------------------------

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    setCurrentUser, // Оставим, если используется для обновления аватара на клиенте
    loading,
    signup,
    login,
    logout,
    updateUserDisplayName,
    updateUserPassword,
    deleteCurrentUserAccount, // <--- ДОБАВЛЯЕМ В КОНТЕКСТ
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
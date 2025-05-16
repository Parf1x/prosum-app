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
  deleteUser,            // ДЛЯ УДАЛЕНИЯ ПОЛЬЗОВАТЕЛЯ
  
  
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
      
      await updatePassword(auth.currentUser, newPassword);
      return auth.currentUser;
    } else {
      throw new Error("Нет активного пользователя для смены пароля.");
    }
  }

  // --- НОВАЯ ФУНКЦИЯ ДЛЯ УДАЛЕНИЯ АККАУНТА ---
  async function deleteCurrentUserAccount() {
    if (auth.currentUser) {
      
      try {
        await deleteUser(auth.currentUser);
       
        console.log("Аккаунт пользователя успешно удален.");
      } catch (error) {
        console.error("Ошибка при удалении аккаунта:", error);
        throw error; // Перебрасываем ошибку для обработки в компоненте
      }
    } else {
      throw new Error("Нет активного пользователя для удаления аккаунта.");
    }
  }
 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    setCurrentUser, 
    loading,
    signup,
    login,
    logout,
    updateUserDisplayName,
    updateUserPassword,
    deleteCurrentUserAccount, 
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
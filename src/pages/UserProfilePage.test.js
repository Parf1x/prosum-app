// src/pages/UserProfilePage.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react'; // Добавил fireEvent для будущих тестов кнопок
import '@testing-library/jest-dom';
import UserProfilePage from './UserProfilePage';
import { AuthContext } from '../contexts/AuthContext';

// --- МОК ДЛЯ REACT-ROUTER-DOM ---
const mockNavigate = jest.fn(); // Создаем мок-функцию для useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Импортируем и используем все из реального модуля...
  useNavigate: () => mockNavigate,          // ...но useNavigate заменяем на наш мок
  // Link: ({ children, to }) => <a href={to}>{children}</a>, // Если бы Link использовался напрямую в UserProfilePage
}));
// --------------------------------

describe('UserProfilePage Component', () => {
  const mockCurrentUser = {
    uid: 'test-uid-123',
    email: 'test@example.com',
    displayName: 'Тестовый Пользователь',
  };

  const mockAuthContextValue = (currentUser = mockCurrentUser) => ({ // Сделаем функцией для гибкости
    currentUser: currentUser,
    updateUserDisplayName: jest.fn(() => Promise.resolve()),
    updateUserPassword: jest.fn(() => Promise.resolve()),
    deleteCurrentUserAccount: jest.fn(() => Promise.resolve()),
    loading: false,
    setCurrentUser: jest.fn(), // Добавим, если вдруг используется
  });

  beforeEach(() => {
    // Сбрасываем вызовы моков перед каждым тестом
    mockNavigate.mockClear();
    // Если у вас моки для функций AuthContext, их тоже можно сбрасывать здесь
    // mockAuthContextValue().updateUserDisplayName.mockClear(); // и т.д.
  });

  test('renders user information when user is logged in', () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue()}>
        <UserProfilePage />
      </AuthContext.Provider>
    );

    if (mockCurrentUser.displayName) {
      expect(screen.getByRole('heading', { name: mockCurrentUser.displayName, level: 1 })).toBeInTheDocument();
    }
    expect(screen.getByRole('heading', { name: /Профиль пользователя/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByText(mockCurrentUser.email)).toBeInTheDocument();
  });

  test('renders loading message when currentUser is null', () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue(null)}> {/* Передаем null как currentUser */}
        <UserProfilePage />
      </AuthContext.Provider>
    );
    expect(screen.getByText(/Загрузка данных пользователя.../i)).toBeInTheDocument();
  });

  test('renders "Не указано" if displayName is null or empty', () => {
    const userWithoutDisplayName = { ...mockCurrentUser, displayName: '' };
    render(
      <AuthContext.Provider value={mockAuthContextValue(userWithoutDisplayName)}>
        <UserProfilePage />
      </AuthContext.Provider>
    );
    // Ищем по тексту, так как это часть параграфа
    expect(screen.getByText((content, element) => content.startsWith('Имя в системе:') && content.includes('Не указано'))).toBeInTheDocument();
  });

  // Добавим тест для кнопки удаления, чтобы проверить вызов navigate
  // Этот тест будет более сложным, так как требует имитации window.confirm
  // и асинхронных операций. Пока оставим его для следующего шага, если захотите.
});
// src/firebase/services.js
import { db } from './config'; // Ваш файл конфигурации Firebase, где экспортируется db
import {
  collection,   // Для ссылки на коллекцию
  addDoc,       // Для добавления нового документа (Create)
  getDocs,      // Для получения нескольких документов (Read)
  getDoc,       // Для получения одного документа (Read)
  doc,          // Для ссылки на конкретный документ
  updateDoc,    // Для обновления документа (Update)
  deleteDoc,    // Для удаления документа (Delete)
  query,        // Для создания запросов
  where,        // Для фильтрации (условие "где")
  orderBy,      // Для сортировки
  serverTimestamp, // Для автоматической установки времени сервера на Firestore
  writeBatch    // Для выполнения нескольких операций как одной атомарной
} from 'firebase/firestore';

// --- Коллекция Projects ---
const projectsCollectionRef = collection(db, 'projects');

export const addProject = (projectData, userId) => {
  return addDoc(projectsCollectionRef, {
    ...projectData,
    ownerId: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const getProjectsByOwner = (userId) => {
  const q = query(projectsCollectionRef, where('ownerId', '==', userId), orderBy('createdAt', 'desc'));
  return getDocs(q);
};

export const getProjectById = (projectId) => {
  const projectDocRef = doc(db, 'projects', projectId);
  return getDoc(projectDocRef);
};

export const updateProject = (projectId, updatedData) => {
  const projectDocRef = doc(db, 'projects', projectId);
  return updateDoc(projectDocRef, {
    ...updatedData,
    updatedAt: serverTimestamp()
  });
};

export const deleteProjectAndTasks = async (projectId) => {
    const projectDocRef = doc(db, 'projects', projectId);
    const tasksQuery = query(collection(db, 'tasks'), where('projectId', '==', projectId));
    const batch = writeBatch(db);
    try {
        const tasksSnapshot = await getDocs(tasksQuery);
        tasksSnapshot.forEach(taskDoc => {
            batch.delete(doc(db, 'tasks', taskDoc.id));
        });
        batch.delete(projectDocRef);
        await batch.commit();
        console.log(`Проект ${projectId} и все его задачи успешно удалены.`);
    } catch (error) {
        console.error("Ошибка при удалении проекта и задач: ", error);
        throw error;
    }
};

// --- Функции для коллекции Tasks --- (ВОТ СЮДА ВСТАВЛЯЕМ НОВЫЙ КОД)
const tasksCollectionRef = collection(db, 'tasks'); // Ссылка на коллекцию 'tasks'

/**
 * Добавляет новую задачу к проекту.
 * @param {object} taskData - Данные задачи (например, { taskName, assigneeFIO, plannedHours, hourlyRate }).
 * @param {string} projectId - ID проекта, к которому относится задача.
 * @param {string} projectOwnerId - UID владельца проекта (для проверки прав в правилах Firestore).
 * @returns {Promise<DocumentReference>} Промис с ссылкой на созданный документ задачи.
 */
export const addTask = (taskData, projectId, projectOwnerId) => {
  return addDoc(tasksCollectionRef, {
    ...taskData,
    projectId: projectId,
    projectOwnerId: projectOwnerId, // Сохраняем для упрощения проверки прав на задачи
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

/**
 * Получает все задачи для конкретного проекта, отсортированные по дате создания.
 * @param {string} projectId - ID проекта.
 * @returns {Promise<QuerySnapshot>} Промис со снэпшотом документов задач.
 */
export const getTasksForProject = (projectId) => {
  const q = query(tasksCollectionRef, where('projectId', '==', projectId), orderBy('createdAt', 'asc'));
  return getDocs(q);
};

/**
 * Обновляет данные существующей задачи.
 * @param {string} taskId - ID задачи для обновления.
 * @param {object} updatedData - Объект с обновляемыми полями.
 * @returns {Promise<void>}
 */
export const updateTask = (taskId, updatedData) => {
  const taskDocRef = doc(db, 'tasks', taskId);
  return updateDoc(taskDocRef, {
    ...updatedData,
    updatedAt: serverTimestamp()
  });
};

/**
 * Удаляет задачу.
 * @param {string} taskId - ID задачи для удаления.
 * @returns {Promise<void>}
 */
export const deleteTask = (taskId) => {
  const taskDocRef = doc(db, 'tasks', taskId);
  return deleteDoc(taskDocRef);
};
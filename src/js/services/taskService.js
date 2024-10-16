import { Task } from '../models/task.js';
import { IdGenerator } from '../../utils/IdGenerator.js';

class TaskService {
    static baseUrl = 'http://localhost:3000';

    static async getTasks() {
        const response = await fetch(`${this.baseUrl}/tasks`);
        const data = await response.json();
        return data.map(Task.fromJSON);
    }

    static async createTask(taskData) {
        const id = IdGenerator.generate();
        const task = new Task({
            id, // Utiliza o ID gerado
            title: taskData.title,
            status: taskData.status,
            description: taskData.description,
            deadline_date: taskData.deadline_date,
            created_date: new Date().toISOString(),
            last_status_update_date: new Date().toISOString()
        });
        const response = await fetch(`${this.baseUrl}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task.toJSON()),
        });
        const data = await response.json();
        return Task.fromJSON(data);
    }

    static async updateTask(taskId, updatedData) {
        try {
            const task = new Task({ id: taskId, ...updatedData });
            const response = await fetch(`${this.baseUrl}/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task.toJSON()),
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const data = await response.json();
            return Task.fromJSON(data);
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
            throw error;
        }
    }

    static async deleteTask(taskId) {
        const response = await fetch(`${this.baseUrl}/tasks/${taskId}`, {
            method: 'DELETE',
        });
        return response.json();
    }
}

export default TaskService;

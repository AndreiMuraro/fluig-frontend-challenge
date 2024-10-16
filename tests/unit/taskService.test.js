import TaskService from '../../src/js/services/taskService.js';
import { Task } from '../../src/js/models/task.js';

global.fetch = jest.fn();

describe('TaskService', () => {
    afterEach(() => {
        fetch.mockClear();
    });

    test('deve obter tarefas corretamente', async () => {
        const mockTasks = [
            {
                id: 'task-1',
                title: 'Tarefa 1',
                status: 0,
                description: '',
                created_date: new Date().toISOString(),
                deadline_date: null,
                last_status_update_date: new Date().toISOString(),
            },
        ];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockTasks,
        });

        const tasks = await TaskService.getTasks();
        expect(fetch).toHaveBeenCalledWith('http://localhost:3000/tasks');
        expect(tasks).toHaveLength(1);
        expect(tasks[0]).toBeInstanceOf(Task);
        expect(tasks[0].id).toBe('task-1');
    });

    test('deve criar uma tarefa corretamente', async () => {
        const taskData = {
            title: 'Nova Tarefa',
            status: 0,
            description: 'Descrição',
            deadline_date: null,
        };

        const createdTask = {
            ...taskData,
            id: 'new-id',
            created_date: new Date().toISOString(),
            last_status_update_date: new Date().toISOString(),
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => createdTask,
        });

        const task = await TaskService.createTask(taskData);
        expect(fetch).toHaveBeenCalledWith('http://localhost:3000/tasks', expect.any(Object));
        expect(task).toBeInstanceOf(Task);
        expect(task.id).toBe('new-id');
        expect(task.title).toBe('Nova Tarefa');
    });

    test('deve atualizar uma tarefa corretamente', async () => {
        const taskId = 'task-1';
        const updatedData = {
            title: 'Tarefa Atualizada',
            status: 1,
            description: 'Descrição atualizada',
        };

        const updatedTask = {
            ...updatedData,
            id: taskId,
            created_date: new Date().toISOString(),
            last_status_update_date: new Date().toISOString(),
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => updatedTask,
        });

        const task = await TaskService.updateTask(taskId, updatedData);
        expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/tasks/${taskId}`, expect.any(Object));
        expect(task).toBeInstanceOf(Task);
        expect(task.title).toBe('Tarefa Atualizada');
    });

    test('deve deletar uma tarefa corretamente', async () => {
        const taskId = 'task-1';

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        });

        const response = await TaskService.deleteTask(taskId);
        expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/tasks/${taskId}`, {
            method: 'DELETE',
        });
        expect(response).toEqual({});
    });
});

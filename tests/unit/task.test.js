import { Task } from '../../src/js/models/task.js';

describe('Task', () => {
    test('deve criar uma nova tarefa com valores padrão', () => {
        const taskData = {
            id: 'test-id',
            title: 'Nova Tarefa',
        };
        const task = new Task(taskData);

        expect(task.id).toBe('test-id');
        expect(task.title).toBe('Nova Tarefa');
        expect(task.status).toBe(0);
        expect(task.description).toBe('');
        expect(task.deadline_date).toBeNull();
        expect(task.created_date).toBeDefined();
        expect(task.last_status_update_date).toBeDefined();
    });

    test('deve atualizar o status e a data de última atualização', () => {
        jest.useFakeTimers('modern');
        const initialDate = new Date('2023-01-01T00:00:00Z');
        jest.setSystemTime(initialDate);

        const task = new Task({
            id: 'test-id',
            title: 'Nova Tarefa',
        });

        const oldDate = task.last_status_update_date;
        expect(oldDate).toBe('2023-01-01T00:00:00.000Z');

        // Avançar o tempo em 1 segundo
        jest.advanceTimersByTime(1000);

        task.status = 1;

        expect(task.status).toBe(1);
        expect(task.last_status_update_date).not.toBe(oldDate);
        expect(task.last_status_update_date).toBe('2023-01-01T00:00:01.000Z');

        jest.useRealTimers();
    });

    test('deve converter para JSON corretamente', () => {
        const task = new Task({
            id: 'test-id',
            title: 'Nova Tarefa',
            description: 'Descrição da tarefa',
        });
        const json = task.toJSON();

        expect(json).toEqual({
            id: 'test-id',
            title: 'Nova Tarefa',
            status: 0,
            description: 'Descrição da tarefa',
            created_date: task.created_date,
            deadline_date: null,
            last_status_update_date: task.last_status_update_date,
        });
    });

    test('deve criar uma instância a partir de JSON', () => {
        const json = {
            id: 'test-id',
            title: 'Nova Tarefa',
            status: 0,
            description: 'Descrição da tarefa',
            created_date: new Date().toISOString(),
            deadline_date: null,
            last_status_update_date: new Date().toISOString(),
        };
        const task = Task.fromJSON(json);

        expect(task).toBeInstanceOf(Task);
        expect(task.id).toBe(json.id);
        expect(task.title).toBe(json.title);
    });
});

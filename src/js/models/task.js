export class Task {
    constructor({
        id,
        title,
        status = 0,
        description = '',
        created_date = new Date().toISOString(),
        deadline_date = null,
        last_status_update_date = new Date().toISOString()
    }) {
        this.id = id;
        this.title = title;
        this._status = status;
        this.description = description;
        this.created_date = created_date;
        this.deadline_date = deadline_date;
        this.last_status_update_date = last_status_update_date;
    }

    static fromJSON(json) {
        return new Task(json);
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            status: this.status,
            description: this.description,
            created_date: this.created_date,
            deadline_date: this.deadline_date,
            last_status_update_date: this.last_status_update_date
        };
    }

    get status() {
        return this._status;
    }

    set status(newStatus) {
        this._status = newStatus;
        this.last_status_update_date = new Date().toISOString();
    }
}
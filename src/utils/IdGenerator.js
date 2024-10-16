export class IdGenerator {
    static generate() {
        const timestamp = Date.now().toString(36).slice(-4);
        const randomPart = Math.random().toString(36).substr(2, 4);
        return `${timestamp}-${randomPart}`;
    }
}

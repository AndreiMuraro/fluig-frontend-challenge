export class DateUtils {
    static formatDateToISO(date) {
        return new Date(date).toISOString();
    }

    static getDaysBetweenDates(date1, date2) {
        const diffTime = Math.abs(date2 - date1);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}

export class DateUtils {
    static formatDateToISO(date) {
        const validDate = date instanceof Date ? date : new Date(date);
        return validDate.toISOString();
    }

    static getDaysBetweenDates(date1, date2) {
        const startDate = date1 instanceof Date ? date1 : new Date(date1);
        const endDate = date2 instanceof Date ? date2 : new Date(date2);
        const diffTime = Math.abs(endDate - startDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}

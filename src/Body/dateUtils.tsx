export const dateUtils = {
    
    // Get a nicely formatted string from a Date object
    formatDate: (date: Date) => {
        var milliseconds = Date.now() - date.getTime();
        var seconds = milliseconds / 1000;
        var minutes = seconds / 60;
        var hours = minutes / 60;
        var days = hours / 24;
        var weeks = days / 7;
        var years = days / 365;

        if (seconds < 30) {
            return 'Just now';
        } else if (seconds < 60) {
            return `${Math.round(seconds)}s`;
        } else if (minutes < 60) {
            return `${Math.round(minutes)}m`;
        } else if (hours < 24) {
            return `${Math.round(hours)}h`;
        } else if (days < 7) {
            return `${Math.round(days)}d`;
        } else if (weeks < 60) {
            return `${Math.round(weeks)}w`;
        } else {
            return `${Math.round(years)}y`;
        }
    }
}
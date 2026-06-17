export function getTimeAgo(isoString: string) {
    const now = new Date(); // Current time
    const pastTime = new Date(isoString); // Time from ISO string

    const timeDiffMilliseconds = now.getTime() - pastTime.getTime();
    const timeDiffSeconds = Math.floor(timeDiffMilliseconds / 1000);

    // Calculate the time difference in seconds, minutes, hours, days, months, or years
    if (timeDiffSeconds < 60) {
        return timeDiffSeconds + " seconds";
    } else if (timeDiffSeconds < 3600) {
        const minutes = Math.floor(timeDiffSeconds / 60);
        return minutes + (minutes === 1 ? " minute" : " minutes");
    } else if (timeDiffSeconds < 86400) {
        const hours = Math.floor(timeDiffSeconds / 3600);
        return hours + (hours === 1 ? " hour" : " hours");
    } else if (timeDiffSeconds < 2592000) {
        const days = Math.floor(timeDiffSeconds / 86400);
        return days + (days === 1 ? " day" : " days");
    } else if (timeDiffSeconds < 31536000) {
        const months = Math.floor(timeDiffSeconds / 2592000);
        return months + (months === 1 ? " month" : " months");
    } else {
        const years = Math.floor(timeDiffSeconds / 31536000);
        return years + (years === 1 ? " year" : " years");
    }
}

export function getDeltaTime(startIsoString: string, endIsoString: string) {
    // calculate the time difference
    const startTime = new Date(startIsoString);
    const endTime = new Date(endIsoString);
    const timeDiffMilliseconds = endTime.getTime() - startTime.getTime();
    const timeDiffSeconds = Math.floor(timeDiffMilliseconds / 1000);

    // Calculate the time difference in seconds, minutes, hours, days, months, or years
    if (timeDiffSeconds < 60) {
        return timeDiffSeconds + " seconds";
    } else if (timeDiffSeconds < 3600) {
        const minutes = Math.floor(timeDiffSeconds / 60);
        return minutes + (minutes === 1 ? " minute" : " minutes");
    } else if (timeDiffSeconds < 86400) {
        const hours = Math.floor(timeDiffSeconds / 3600);
        return hours + (hours === 1 ? " hour" : " hours");
    } else if (timeDiffSeconds < 2592000) {
        const days = Math.floor(timeDiffSeconds / 86400);
        return days + (days === 1 ? " day" : " days");
    } else if (timeDiffSeconds < 31536000) {
        const months = Math.floor(timeDiffSeconds / 2592000);
        return months + (months === 1 ? " month" : " months");
    } else {
        const years = Math.floor(timeDiffSeconds / 31536000);
        return years + (years === 1 ? " year" : " years");
    }
}

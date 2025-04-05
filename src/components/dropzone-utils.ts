export const DELIMITERS = [",", ";", "\t", "¦"];

// Excel date starts from 1900-01-01, minus 1 because Excel considers 1900 as leap year
const EXCEL_DATE_OFFSET = 25569;
const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

/** Format a date as DD-MM-YYYY */
export const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

/** Convert Excel serial number to JS Date */
const excelSerialToDate = (serial: number): Date => {
    // Adjust for Excel's date system and convert to milliseconds
    const utcDays = serial - EXCEL_DATE_OFFSET;
    const utcValue = utcDays * MILLISECONDS_IN_DAY;
    const date = new Date(utcValue);
    return date;
};

/** Convert JS Date to Excel serial number */
export const dateToExcelSerial = (date: Date): number => {
    const timestamp = date.getTime();
    const utcDays = timestamp / MILLISECONDS_IN_DAY;
    return Math.round((utcDays + EXCEL_DATE_OFFSET) * 1000000) / 1000000;
};

/** Check if a number could be an Excel date serial */
const isExcelDateSerial = (num: number): boolean => {
    // Excel dates are always positive and typically > 25569 (1900-01-01)
    // We'll consider numbers up to year 2100 as potential dates
    return (
        num > EXCEL_DATE_OFFSET &&
        num < 73050 && // 73050 is roughly year 2100
        Number.isFinite(num)
    );
};

export const transformValue = <T>(value: T): T => {
    // Handle Excel Date objects
    if (value instanceof Date) {
        return formatDate(value) as T;
    }

    if (typeof value === "string") {
        const trimmed = value.trim();

        // Check if string starts and ends with quotes
        const hasQuotes = trimmed.startsWith('"') && trimmed.endsWith('"');
        const cleaned = hasQuotes ? trimmed.slice(1, -1) : trimmed;

        // Replace multiple spaces with a single space
        // Remove leading and trailing spaces
        return cleaned.replace(/\s+/g, " ").trim() as T;
    }

    return value;
};

/** Handles string cleaning and Excel date conversion */
export const transformValueExcel = <T>(value: T): T => {
    // Preserve Date objects
    if (value instanceof Date) {
        return value;
    }

    // Handle Excel serial dates
    if (typeof value === "number" && isExcelDateSerial(value)) {
        return excelSerialToDate(value) as T;
    }

    if (typeof value === "string") {
        const trimmed = value.trim();

        // Check if string starts and ends with quotes
        const hasQuotes = trimmed.startsWith('"') && trimmed.endsWith('"');
        const cleaned = hasQuotes ? trimmed.slice(1, -1) : trimmed;

        // Replace multiple spaces with a single space
        // Remove leading and trailing spaces
        return cleaned.replace(/\s+/g, " ").trim() as T;
    }

    return value;
};

/** Naive: Counts occurrences of each delimiter */
export const detectDelimiter = (contents = ""): string => {
    const lines = contents.split("\n")[0] ?? "";

    const counts = DELIMITERS.map((delimiter) => ({
        delimiter,
        count: (lines.match(new RegExp(delimiter, "g")) || []).length,
    }));

    // Get the delimiter with the highest count
    const mostLikely = counts.reduce((max, current) => (current.count > max.count ? current : max));

    return mostLikely.delimiter;
};

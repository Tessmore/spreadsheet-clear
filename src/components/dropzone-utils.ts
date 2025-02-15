export const DELIMITERS = [",", ";", "\t", "¦"];

export const transformValue = <T>(value: T): T => {
    // Handle Excel Date objects
    if (value instanceof Date) {
        return value.toISOString().split("T")[0] as T;
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

/** Only edits string columns */
export const transformValueExcel = <T>(value: T): T => {
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

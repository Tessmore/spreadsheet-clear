import { describe, it, expect } from "vitest";
import { detectDelimiter, transformValue, transformValueExcel, formatDate, dateToExcelSerial } from "./dropzone-utils";

describe("transformValue", () => {
    it("handles empty string", () => {
        expect(transformValue("")).toBe("");
    });

    it("handles string with only spaces", () => {
        expect(transformValue("   ")).toBe("");
    });

    it("removes multiple spaces from strings", () => {
        expect(transformValue("hello   world")).toBe("hello world");
    });

    it("trims leading and trailing spaces", () => {
        expect(transformValue("  hello world  ")).toBe("hello world");
    });

    it("handles combination of multiple spaces and trimming", () => {
        expect(transformValue("  hello   world  ")).toBe("hello world");
    });

    it("handles trimming within quotes", () => {
        expect(transformValue('" 2023-09-30"')).toBe("2023-09-30");
    });

    it("handles Excel serial date numbers", () => {
        // Excel serial number for 2025-04-04
        const excelDate = 45751.791666666664;
        expect(transformValue(excelDate)).toBe(excelDate);
    });

    it("returns non-string values unchanged", () => {
        expect(transformValue(123)).toBe(123);
        expect(transformValue(true)).toBe(true);
        expect(transformValue(null)).toBe(null);
    });

    it("formats Date objects in DD-MM-YYYY format", () => {
        const date = new Date("2024-03-15");
        expect(transformValue(date)).toBe("15-03-2024");
    });
});

describe("transformValueExcel", () => {
    it("handles empty string", () => {
        expect(transformValueExcel("")).toBe("");
    });

    it("handles string with only spaces", () => {
        expect(transformValueExcel("   ")).toBe("");
    });

    it("removes multiple spaces from strings", () => {
        expect(transformValueExcel("hello   world")).toBe("hello world");
    });

    it("handles trimming within quotes", () => {
        expect(transformValueExcel('" 2023-09-30"')).toBe("2023-09-30");
    });

    it("preserves Date objects", () => {
        const date = new Date("2024-03-15");
        expect(transformValueExcel(date)).toBe(date);
    });

    it("converts Excel serial dates to proper dates", () => {
        // Excel serial number for 2025-04-04
        const excelDate = 45751.791666666664;
        const result = transformValueExcel<Date | number>(excelDate);
        expect(result instanceof Date).toBe(true);
        expect((result as Date).toISOString().split("T")[0]).toBe("2025-04-04");
    });

    it("handles Excel dates with different time components", () => {
        // Excel serial dates with different times
        const dates = [
            { serial: 45751.0, expected: "2025-04-04" }, // Midnight
            { serial: 45751.5, expected: "2025-04-04" }, // Noon
            { serial: 45751.99999, expected: "2025-04-04" }, // End of day
        ];

        dates.forEach(({ serial, expected }) => {
            const result = transformValueExcel<Date | number>(serial);
            expect(result instanceof Date).toBe(true);
            expect((result as Date).toISOString().split("T")[0]).toBe(expected);
        });
    });

    it("returns non-date numbers unchanged", () => {
        const numbers = [123, 0.5, -1];
        numbers.forEach((num) => {
            expect(transformValueExcel(num)).toBe(num);
        });
    });

    it("returns non-string values unchanged", () => {
        expect(transformValueExcel(123)).toBe(123);
        expect(transformValueExcel(true)).toBe(true);
        expect(transformValueExcel(null)).toBe(null);
    });
});

describe("detectDelimiter", () => {
    it("should handle empty content", () => {
        const csvContent = "  \n  \n  \n";
        expect(detectDelimiter(csvContent)).toBe(",");
    });

    it("should detect comma as delimiter", () => {
        const csvContent = "name,age,city\nJohn,25,New York";
        expect(detectDelimiter(csvContent)).toBe(",");
    });

    it("should detect semicolon as delimiter", () => {
        const csvContent = "name;age;city\nJohn;25;New York";
        expect(detectDelimiter(csvContent)).toBe(";");
    });

    it("should detect tab as delimiter", () => {
        const csvContent = "name\tage\tcity\nJohn\t25\tNew York";
        expect(detectDelimiter(csvContent)).toBe("\t");
    });

    it("should return most frequent delimiter when multiple exist", () => {
        const csvContent = "name,age|city,country,state";
        expect(detectDelimiter(csvContent)).toBe(",");
    });
});

describe("date formatting", () => {
    it("formats dates in DD-MM-YYYY format", () => {
        const date = new Date("2024-03-15");
        expect(formatDate(date)).toBe("15-03-2024");
    });

    it("pads single digit days and months", () => {
        const date = new Date("2024-04-05");
        expect(formatDate(date)).toBe("05-04-2024");
    });
});

describe("Excel date conversion", () => {
    it("converts dates to Excel serial numbers", () => {
        const date = new Date("2025-04-04");
        const serial = dateToExcelSerial(date);
        expect(serial).toBeCloseTo(45751, 0); // We only care about the integer part for this test
    });

    it("roundtrips dates through Excel serial numbers", () => {
        const originalDate = new Date("2025-04-04");
        const serial = dateToExcelSerial(originalDate);
        const result = transformValueExcel<Date | number>(serial);
        expect(result instanceof Date).toBe(true);
        expect(formatDate(result as Date)).toBe("04-04-2025");
    });
});

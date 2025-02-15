import { describe, it, expect } from "vitest";
import { detectDelimiter } from "./dropzone-utils";
import { transformValue } from "./dropzone-utils";

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

    it("returns non-string values unchanged", () => {
        expect(transformValue(123)).toBe(123);
        expect(transformValue(true)).toBe(true);
        expect(transformValue(null)).toBe(null);
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

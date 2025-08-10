export class TestUtils {
  static validateDate(date: any) {
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

    expect(typeof date).toBe("string");
    expect(new Date(date).toString()).not.toBe("Invalid Date");
    expect(date).toMatch(iso8601Regex);
  }
}

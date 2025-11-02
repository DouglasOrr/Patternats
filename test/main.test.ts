import { message } from "../src/main";

test("message function returns correct string", () => {
  expect(message()).toBe("Hello from main.ts!");
});

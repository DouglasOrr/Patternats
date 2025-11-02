export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  rootDir: "../",
  roots: ["src", "test"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { diagnostics: { ignoreCodes: [151001] } }],
  },
};

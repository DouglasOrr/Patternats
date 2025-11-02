export function message(): string {
  return "Hello from main.ts!";
}

window.onload = () => {
  console.log(message());
};

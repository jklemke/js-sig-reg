
import { greeting } from '../lib/hello.mjs';

const btn = document.getElementById("greetingBtn");
btn.addEventListener('click', (ev,) => {
  const userName = document.getElementById("usernameTextbox").value;
  console.log(greeting(userName));
});

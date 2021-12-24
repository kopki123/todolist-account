const emailInput = document.querySelector(".email-input");
const passwordInput = document.querySelector(".password-input");
const submitBtn = document.querySelector(".submit-btn");

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const res = await axios.post("/user/register", {
    email: emailInput.value,
    password: passwordInput.value,
  });
  document.cookie = `token=${res.data.accessToken}; Max-Age=1200; Secure`;

  localStorage.setItem("login", true);

  setTimeout(() => {
    window.location.replace("/index.html");
  }, 1000);
});

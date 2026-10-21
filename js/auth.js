
/* =========================================
   SHEDWORKS AUTH — FUNCTIONALITY
========================================= */

document.addEventListener("DOMContentLoaded", function () {
  const root = document.documentElement;

  /* ---------- DARK MODE ---------- */

  const themeToggle = document.getElementById("sw-theme-toggle");
  const themeIcon = document.getElementById("sw-theme-icon");

  function applyTheme(theme) {
    const isDark = theme === "dark";

    root.classList.toggle("dark-mode", isDark);

    if (themeIcon) {
      themeIcon.className = isDark
        ? "fa-solid fa-sun"
        : "fa-solid fa-moon";
    }

    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
      );
      themeToggle.setAttribute(
        "title",
        isDark ? "Switch to light mode" : "Switch to dark mode"
      );
      themeToggle.setAttribute("aria-pressed", String(isDark));
    }
  }

  let savedTheme = "light";

  try {
    savedTheme = localStorage.getItem("shedworks-theme") ||
      localStorage.getItem("shedworks-auth-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  } catch (error) {
    savedTheme = "light";
  }

  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const nextTheme = root.classList.contains("dark-mode")
        ? "light"
        : "dark";

      applyTheme(nextTheme);

      try {
        localStorage.setItem("shedworks-theme", nextTheme);
      } catch (error) {
        // Theme still works for the current page.
      }
    });
  }

  /* ---------- RTL TOGGLE ---------- */

  const rtlToggle = document.getElementById("sw-rtl-toggle");

  let savedDirection = "ltr";

  try {
    savedDirection =
      localStorage.getItem("shedworks-direction") ||
      localStorage.getItem("shedworks-auth-direction") || "ltr";
  } catch (error) {
    savedDirection = "ltr";
  }

  function applyDirection(direction) {
    root.setAttribute("dir", direction);
    root.classList.toggle("rtl-mode", direction === "rtl");

    if (rtlToggle) {
      rtlToggle.setAttribute(
        "aria-label",
        direction === "rtl"
          ? "Switch to left-to-right layout"
          : "Switch to right-to-left layout"
      );

      rtlToggle.setAttribute(
        "title",
        direction === "rtl" ? "Switch to LTR" : "Switch to RTL"
      );
      rtlToggle.setAttribute("aria-pressed", String(direction === "rtl"));
    }
  }

  applyDirection(savedDirection);

  if (rtlToggle) {
    rtlToggle.addEventListener("click", function () {
      const nextDirection =
        root.getAttribute("dir") === "rtl" ? "ltr" : "rtl";

      applyDirection(nextDirection);

      try {
        localStorage.setItem("shedworks-direction", nextDirection);
      } catch (error) {
        // Direction still works for the current page.
      }
    });
  }

  /* ---------- SHOW / HIDE PASSWORD ---------- */

  document.querySelectorAll("[data-password-toggle]").forEach(function (button) {
    button.addEventListener("click", function () {
      const inputId = button.getAttribute("data-password-toggle");
      const passwordInput = document.getElementById(inputId);
      const icon = button.querySelector("i");

      if (!passwordInput || !icon) return;

      const showPassword = passwordInput.type === "password";

      passwordInput.type = showPassword ? "text" : "password";

      icon.className = showPassword
        ? "fa-regular fa-eye-slash"
        : "fa-regular fa-eye";

      button.setAttribute(
        "aria-label",
        showPassword ? "Hide password" : "Show password"
      );
    });
  });

  /* ---------- CURRENT YEAR ---------- */

  document.querySelectorAll("[data-current-year]").forEach(function (element) {
    element.textContent = new Date().getFullYear();
  });

  /* ---------- FORM FEEDBACK ---------- */

  function showFeedback(element, message) {
    if (!element) return;

    element.textContent = message;
    element.classList.add("is-visible");
  }

  /* ---------- LOGIN FORM ---------- */

  const loginForm = document.getElementById("sw-login-form");

  if (loginForm) {
    const feedback = document.getElementById("sw-login-feedback");

    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!loginForm.checkValidity()) {
        loginForm.reportValidity();
        return;
      }

      const email = document.getElementById("sw-login-email").value.trim();
      const remember = document.getElementById("sw-remember").checked;

      if (remember) {
        try {
          localStorage.setItem("shedworks-remember-email", email);
        } catch (error) {
          // Remember preference cannot be saved in this browser.
        }
      } else {
        try {
          localStorage.removeItem("shedworks-remember-email");
        } catch (error) {
          // Ignore storage restrictions.
        }
      }

      showFeedback(
        feedback,
        "Form validated successfully. Connect your authentication backend to sign in."
      );
    });

    const emailInput = document.getElementById("sw-login-email");
    const rememberCheckbox = document.getElementById("sw-remember");

    try {
      const rememberedEmail = localStorage.getItem("shedworks-remember-email");

      if (rememberedEmail && emailInput && rememberCheckbox) {
        emailInput.value = rememberedEmail;
        rememberCheckbox.checked = true;
      }
    } catch (error) {
      // Remember-me feature remains optional.
    }
  }

  /* ---------- REGISTER FORM ---------- */

  const registerForm = document.getElementById("sw-register-form");

  if (registerForm) {
    const feedback = document.getElementById("sw-register-feedback");

    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!registerForm.checkValidity()) {
        registerForm.reportValidity();
        return;
      }

      const password = document.getElementById("sw-register-password").value;
      const confirmPassword = document.getElementById("sw-register-confirm").value;

      if (password !== confirmPassword) {
        showFeedback(feedback, "Passwords do not match. Please check again.");
        document.getElementById("sw-register-confirm").focus();
        return;
      }

      showFeedback(
        feedback,
        "Form validated successfully. Connect your registration backend to create an account."
      );
    });
  }

  /* ---------- SOCIAL LOGIN BUTTONS ---------- */

  document.querySelectorAll("[data-social]").forEach(function (button) {
    button.addEventListener("click", function () {
      const provider = button.getAttribute("data-social");

      alert(
        provider +
          " sign-in needs OAuth configuration. Connect the provider to enable authentication."
      );
    });
  });
});

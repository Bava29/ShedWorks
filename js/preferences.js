/* Apply saved display preferences before page styles are rendered. */
(() => {
    const root = document.documentElement;
    let theme = null;
    let direction = null;

    try {
        theme = localStorage.getItem("shedworks-theme");
        direction = localStorage.getItem("shedworks-direction");
        if (theme === null) {
            theme = localStorage.getItem("shedworks-auth-theme");
            if (theme !== null) localStorage.setItem("shedworks-theme", theme);
        }
        if (direction === null) {
            direction = localStorage.getItem("shedworks-auth-direction");
            if (direction !== null) localStorage.setItem("shedworks-direction", direction);
        }
    } catch (error) {
        // Use the current page normally if browser storage is unavailable.
    }

    if (theme === null) {
        theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }
    root.classList.toggle("dark-mode", theme === "dark");
    root.setAttribute("dir", direction === "rtl" ? "rtl" : "ltr");
    root.classList.toggle("rtl-mode", direction === "rtl");
})();

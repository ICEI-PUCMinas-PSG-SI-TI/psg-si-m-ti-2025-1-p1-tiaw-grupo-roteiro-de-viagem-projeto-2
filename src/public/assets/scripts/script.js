        document.addEventListener("DOMContentLoaded", () => {
            const toggleCheckbox = document.getElementById("darkModeToggle");
            const userId = 1;

            function applyTheme(theme) {
                document.body.classList.remove("light", "dark");
                document.body.classList.add(theme);
                toggleCheckbox.checked = theme === "dark";
            }

            fetch(`http://localhost:3000/userPreferences/${userId}`)
                .then(res => res.json())
                .then(data => {
                    applyTheme(data.theme || "light");
                })
                .catch(err => {
                    console.error("Erro ao carregar tema:", err);
                    applyTheme("light");
                });

            toggleCheckbox.addEventListener("change", () => {
                const newTheme = toggleCheckbox.checked ? "dark" : "light";
                applyTheme(newTheme);

                fetch(`http://localhost:3000/userPreferences/${userId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ theme: newTheme })
                });
            });
        });
  
document.addEventListener("DOMContentLoaded", () => {
    const tabButton = document.getElementById("tabButton");
    const tabContainer = document.getElementById("tabContainer");

    tabButton.addEventListener("click", () => {
        const isOpen = tabContainer.classList.toggle("open");
        document.body.classList.toggle("tab-open", isOpen);
    });
});

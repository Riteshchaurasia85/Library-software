 // Swiper
    var swiper = new Swiper(".mySwiper", {

        loop: true,

        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },

        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },

    });

    // Contact Form
    console.log("Contact Page Controller Initialized");

    const form = document.querySelector("form");
    const submitBtn = form.querySelector("button[type='submit']");
    const originalBtnText = submitBtn.innerHTML;

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        submitBtn.disabled = true;

        submitBtn.innerHTML =
        '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';

        const formData = new FormData(form);

        const params = new URLSearchParams(formData);

        try {

            const response = await fetch("/send", {

                method: "POST",

                headers: {
                    "Content-Type":
                    "application/x-www-form-urlencoded"
                },

                body: params.toString()

            });

            const result = await response.json();

            if (response.ok && result.success) {

                if (result.partial) {

                    showToast(result.message, "warning");

                } else {

                    showToast(result.message, "success");

                }

                form.reset();

            } else {

                showToast(
                    result.message ||
                    "Failed to send message.",
                    "error"
                );
            }

        } catch (err) {

            console.error(err);

            showToast(
                "Network error.",
                "error"
            );

        } finally {

            submitBtn.disabled = false;

            submitBtn.innerHTML = originalBtnText;

        }

    });

    // Toast
    function showToast(message, type = "success") {

        let container =
        document.getElementById("toast-container");

        if (!container) {

            container = document.createElement("div");

            container.id = "toast-container";

            document.body.appendChild(container);
        }

        const toast = document.createElement("div");

        toast.className = `toast ${type}`;

        let icon = "fa-check-circle";

        if (type === "error") {
            icon = "fa-circle-xmark";
        }

        if (type === "warning") {
            icon = "fa-triangle-exclamation";
        }

        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fa-solid ${icon}"></i>
            </div>

            <div class="toast-content">
                ${message}
            </div>

            <button
            type="button"
            class="toast-close">

            &times;

            </button>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add("show");
        }, 10);

        const timeout = setTimeout(() => {
            removeToast(toast);
        }, 7000);

        toast.querySelector(".toast-close")
        .addEventListener("click", () => {

            clearTimeout(timeout);

            removeToast(toast);

        });
    }

    function removeToast(toast) {

        toast.classList.remove("show");

        toast.classList.add("hide");

        toast.addEventListener("transitionend", () => {
            toast.remove();
        });

    }

// Contact Form Asynchronous Handling
console.log("Contact Page Controller Initialized");

// Select the Form and Submit Button
const form = document.querySelector("form");
const submitBtn = form.querySelector("button[type='submit']");
const originalBtnText = submitBtn.innerHTML;

// Submit Event Listener
form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Change button to loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';

    // Collect Form Data
    const formData = new FormData(form);
    const params = new URLSearchParams(formData);

    try {
        const response = await fetch("/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: params.toString()
        });

        const result = await response.json();

        if (response.ok && result.success) {
            if (result.partial) {
                // Database save succeeded, but email failed (e.g., SMTP credential issues)
                showToast(result.message, "warning");
            } else {
                // Everything succeeded
                showToast(result.message, "success");
            }
            form.reset(); // Clear the form fields on success
        } else {
            // Server error / validation error
            showToast(result.message || "Failed to send message. Please try again.", "error");
        }
    } catch (err) {
        console.error("Submission Error:", err);
        showToast("Network error. Please check your internet connection and try again.", "error");
    } finally {
        // Restore button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
});

// Beautiful Modern Toast Notification System
function showToast(message, type = "success") {
    // Check if container exists, else create it
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }
    
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    // Choose appropriate icon
    let icon = "fa-check-circle";
    if (type === "error") {
        icon = "fa-circle-xmark";
    } else if (type === "warning") {
        icon = "fa-triangle-exclamation";
    } else if (type === "info") {
        icon = "fa-circle-info";
    }
    
    toast.innerHTML = `
        <div class="toast-icon"><i class="fa-solid ${icon}"></i></div>
        <div class="toast-content">${message}</div>
        <button type="button" class="toast-close">&times;</button>
    `;
    
    container.appendChild(toast);
    
    // Trigger transition
    setTimeout(() => {
        toast.classList.add("show");
    }, 10);
    
    // Auto-remove after 7 seconds
    const timeout = setTimeout(() => {
        removeToast(toast);
    }, 7000);
    
    // Close button click listener
    toast.querySelector(".toast-close").addEventListener("click", () => {
        clearTimeout(timeout);
        removeToast(toast);
    });
}

function removeToast(toast) {
    toast.classList.remove("show");
    toast.classList.add("hide");
    
    // Remove element after transition finishes
    toast.addEventListener("transitionend", () => {
        toast.remove();
    });
}
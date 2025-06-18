/* ===== SHOW MENU ===== */
const navMenu = document.getElementById("nav-menu");
const navToggle = document.getElementById("nav-toggle");
const navClose = document.getElementById("nav-close");

/* Menu show */
if (navToggle) {
    navToggle.addEventListener("click", () => {
        navMenu.classList.add("show-menu");
    });
}

/* Menu hidden */
if (navClose) {
    navClose.addEventListener("click", () => {
        navMenu.classList.remove("show-menu");
    });
}

/* ===== REMOVE MENU MOBILE ===== */
const navLinks = document.querySelectorAll(".nav__link");

function linkAction() {
    const navMenu = document.getElementById("nav-menu");
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove("show-menu");
}
navLinks.forEach(n => n.addEventListener("click", linkAction));

/* ===== CHANGE BACKGROUND HEADER ===== */
function scrollHeader() {
    const header = document.getElementById("header");
    // When the scroll is greater than 50 viewport height, add the scroll-header class to the header tag
    if (this.scrollY >= 50) header.classList.add("scroll-header"); else header.classList.remove("scroll-header");
}
window.addEventListener("scroll", scrollHeader);

/* ===== SCROLL SECTIONS ACTIVE LINK ===== */
const sections = document.querySelectorAll("section[id]");

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 58; // Adjust based on header height
        const sectionId = current.getAttribute("id");

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector(".nav__menu a[href*=" + sectionId + "]").classList.add("active-link");
        } else {
            document.querySelector(".nav__menu a[href*=" + sectionId + "]").classList.remove("active-link");
        }
    });
}
window.addEventListener("scroll", scrollActive);

/* ===== SHOW SCROLL UP ===== */
function scrollUp() {
    const scrollUp = document.getElementById("scroll-top");
    // When the scroll is higher than 350 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if (this.scrollY >= 350) scrollUp.classList.add("show"); else scrollUp.classList.remove("show");
}
window.addEventListener("scroll", scrollUp);

// Scroll to top functionality
const scrollTopButton = document.getElementById("scroll-top");
if (scrollTopButton) {
    scrollTopButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

/* ===== PROJECT FILTERING ===== */
const filterButtons = document.querySelectorAll(".filter__btn");
const projectCards = document.querySelectorAll(".project__card");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove("filter__btn--active"));
        // Add active class to the clicked button
        button.classList.add("filter__btn--active");

        const filterValue = button.getAttribute("data-filter");

        projectCards.forEach(card => {
            if (filterValue === "all" || card.getAttribute("data-category") === filterValue) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
});

/* ===== CONTACT FORM VALIDATION ===== */
const contactForm = document.getElementById("contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent default form submission
        
        // Basic validation (can be expanded)
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (name === "" || email === "" || message === "") {
            alert("Vennligst fyll ut alle obligatoriske felt (*).");
            return;
        }

        // Simple email format check
        const emailPattern = /^[^"]+@[^"]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            alert("Vennligst oppgi en gyldig e-postadresse.");
            return;
        }

        // If validation passes, you can submit the form data here
        // For this template, we just show a success message
        alert("Melding sendt! Vi kontakter deg snart.");
        contactForm.reset(); // Clear the form
    });
}

/* ===== SCROLL REVEAL ANIMATION ===== */
const sr = ScrollReveal({
    origin: "top",
    distance: "60px",
    duration: 2500,
    delay: 400,
    // reset: true // Uncomment to repeat animation on scroll
});

sr.reveal(`.hero__content, .about__image, .contact__info`, { origin: "left" });
sr.reveal(`.hero__image, .about__content, .contact__form`, { origin: "right" });
sr.reveal(`.section__header, .footer__content`, { interval: 100 });
sr.reveal(`.hero__stats, .service__card, .project__card, .testimonial__card`, { interval: 100 });

// Ensure ScrollReveal is loaded before using it
document.addEventListener("DOMContentLoaded", () => {
    // Check if ScrollReveal is defined
    if (typeof ScrollReveal !== "undefined") {
        // Initialize ScrollReveal here if needed
    } else {
        console.error("ScrollReveal is not loaded. Make sure the library is included.");
    }
});

// Note: ScrollReveal library needs to be included in the HTML for the animations to work.
// Add this line before the closing </body> tag in index.html:
// <script src="https://unpkg.com/scrollreveal"></script>



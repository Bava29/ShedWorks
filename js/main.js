
/* =========================================
   SHEDWORKS HEADER FUNCTIONALITY
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const html = document.documentElement;

    const menuToggle = document.querySelector(".sw-menu-toggle");
    const mobileMenu = document.querySelector(".sw-mobile-menu");

    const desktopHome = document.querySelector(".sw-home-item");
    const desktopHomeTrigger = document.querySelector(
        ".sw-home-trigger"
    );

    const mobileHome = document.querySelector(".sw-mobile-home");
    const mobileHomeTrigger = document.querySelector(
        ".sw-mobile-home-trigger"
    );

    const themeButtons = document.querySelectorAll(
        ".sw-theme-toggle"
    );

    const rtlButtons = document.querySelectorAll(
        ".sw-rtl-toggle"
    );

    function readPreference(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function savePreference(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            // Keep the selected preference for the current page.
        }
    }

    const mobileNavLinks = document.querySelectorAll(
        ".sw-mobile-nav a"
    );

    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navigationLinks = document.querySelectorAll(
        ".sw-desktop-nav a, .sw-mobile-nav a"
    );

    navigationLinks.forEach((link) => {
        const linkPage = link.getAttribute("href").split("/").pop();

        if (linkPage === currentPage) {
            link.setAttribute("aria-current", "page");
        }
    });

    if (currentPage === "index.html" || currentPage === "home-2.html") {
        [desktopHomeTrigger, mobileHomeTrigger].forEach((trigger) => {
            if (trigger) trigger.setAttribute("aria-current", "page");
        });
    }

    /* =====================================
       DARK MODE
    ===================================== */

    function applyTheme(isDark) {
        html.classList.toggle("dark-mode", isDark);

        themeButtons.forEach((button) => {
            const icon = button.querySelector("i");
            const label = button.querySelector("span");

            if (icon) {
                icon.classList.toggle("fa-moon", !isDark);
                icon.classList.toggle("fa-sun", isDark);
            }

            button.setAttribute(
                "aria-label",
                isDark ? "Enable light mode" : "Enable dark mode"
            );
            button.setAttribute("aria-pressed", String(isDark));

            if (label && label.classList.contains("sw-theme-label")) {
                label.textContent = isDark ? "Light Mode" : "Dark Mode";
            }
        });
    }

    const savedTheme = readPreference("shedworks-theme");

    applyTheme(
        savedTheme
            ? savedTheme === "dark"
            : window.matchMedia("(prefers-color-scheme: dark)").matches
    );

    themeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const isDark = !html.classList.contains("dark-mode");

            applyTheme(isDark);

            savePreference("shedworks-theme", isDark ? "dark" : "light");
        });
    });

    /* =====================================
       RTL MODE
    ===================================== */

    function applyDirection(isRTL) {
        html.setAttribute("dir", isRTL ? "rtl" : "ltr");
        html.classList.toggle("rtl-mode", isRTL);

        rtlButtons.forEach((button) => {
            button.setAttribute("aria-pressed", String(isRTL));
            button.setAttribute(
                "aria-label",
                isRTL ? "Switch to LTR layout" : "Switch to RTL layout"
            );

            const label = button.querySelector(".sw-rtl-label");

            if (label) {
                label.textContent = button.closest(".sw-mobile-actions")
                    ? (isRTL ? "LTR Mode" : "RTL Mode")
                    : (isRTL ? "LTR" : "RTL");
            }
        });
    }

    const savedDirection = readPreference("shedworks-direction");

    applyDirection(savedDirection === "rtl");

    rtlButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const isRTL = html.getAttribute("dir") !== "rtl";

            applyDirection(isRTL);

            savePreference("shedworks-direction", isRTL ? "rtl" : "ltr");
        });
    });

    /* =====================================
       RESPONSIVE MENU OPEN / CLOSE
    ===================================== */

    function closeMobileMenu() {
        if (!menuToggle || !mobileMenu) return;

        menuToggle.classList.remove("is-open");
        mobileMenu.classList.remove("is-open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

        mobileMenu.setAttribute("aria-hidden", "true");

        document.body.classList.remove("sw-menu-open");
    }

    function openMobileMenu() {
        if (!menuToggle || !mobileMenu) return;

        menuToggle.classList.add("is-open");
        mobileMenu.classList.add("is-open");

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute(
            "aria-label",
            "Close navigation menu"
        );

        mobileMenu.setAttribute("aria-hidden", "false");

        document.body.classList.add("sw-menu-open");
    }

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", () => {
            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        /* Close menu after selecting a page */

        mobileNavLinks.forEach((link) => {
            link.addEventListener("click", closeMobileMenu);
        });

        /* Close menu when clicking outside */

        document.addEventListener("click", (event) => {
            if (
                !menuToggle.contains(event.target) &&
                !mobileMenu.contains(event.target)
            ) {
                closeMobileMenu();
            }
        });

        /* Close menu with Escape */

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMobileMenu();
                closeDesktopDropdown();
                closeMobileDropdown();
                menuToggle.focus();
            }
        });

        /* Close responsive menu when returning to desktop */

        window.addEventListener("resize", () => {
            if (window.innerWidth > 1024) {
                closeMobileMenu();
                closeMobileDropdown();
            }
        });
    }

    /* =====================================
       DESKTOP HOME DROPDOWN
    ===================================== */

    function closeDesktopDropdown() {
        if (!desktopHome || !desktopHomeTrigger) return;

        desktopHome.classList.remove("is-dropdown-open");

        desktopHomeTrigger.setAttribute(
            "aria-expanded",
            "false"
        );
    }

    if (desktopHome && desktopHomeTrigger) {
        desktopHomeTrigger.addEventListener("click", (event) => {
            event.stopPropagation();

            const isOpen =
                desktopHome.classList.contains("is-dropdown-open");

            closeDesktopDropdown();

            if (!isOpen) {
                desktopHome.classList.add("is-dropdown-open");

                desktopHomeTrigger.setAttribute(
                    "aria-expanded",
                    "true"
                );
            }
        });

        document.addEventListener("click", (event) => {
            if (!desktopHome.contains(event.target)) {
                closeDesktopDropdown();
            }
        });
    }

    /* =====================================
       MOBILE HOME DROPDOWN
    ===================================== */

    function closeMobileDropdown() {
        if (!mobileHome || !mobileHomeTrigger) return;

        mobileHome.classList.remove("is-dropdown-open");

        mobileHomeTrigger.setAttribute(
            "aria-expanded",
            "false"
        );
    }

    if (mobileHome && mobileHomeTrigger) {
        mobileHomeTrigger.addEventListener("click", () => {
            const isOpen =
                mobileHome.classList.contains("is-dropdown-open");

            mobileHome.classList.toggle(
                "is-dropdown-open",
                !isOpen
            );

            mobileHomeTrigger.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );
        });
    }

});


/* =========================================
   SHEDWORKS FOOTER FUNCTIONALITY
========================================= */

// Automatic Copyright Year
const swCopyrightYear = document.getElementById("swCopyrightYear");

if (swCopyrightYear) {
    swCopyrightYear.textContent = new Date().getFullYear();
}

// Newsletter - Frontend Demo Only
const swNewsletterForm = document.getElementById("swNewsletterForm");
const swNewsletterMessage = document.getElementById("swNewsletterMessage");

if (swNewsletterForm && swNewsletterMessage) {
    swNewsletterForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!swNewsletterForm.checkValidity()) {
            swNewsletterForm.reportValidity();
            return;
        }

        swNewsletterMessage.textContent =
            "Newsletter signup is not connected yet. Please connect a backend to receive subscriptions.";
    });
}


/* =========================================
   SHEDWORKS HERO - THREE SLIDE CAROUSEL
========================================= */

(() => {
    const hero = document.querySelector("#homeHero");

    if (!hero || hero.dataset.sliderInitialized === "true") {
        return;
    }

    const image = hero.querySelector(".sw-hero-image");
    const eyebrow = hero.querySelector(".sw-hero-eyebrow");
    const heading = hero.querySelector(".sw-hero-title");
    const description = hero.querySelector(".sw-hero-description");

    const slideButtons = hero.querySelectorAll(
        ".sw-hero-slide-number"
    );

    const previousButton = hero.querySelector(
        '[data-direction="prev"]'
    );

    const nextButton = hero.querySelector(
        '[data-direction="next"]'
    );

    if (
        !image ||
        !eyebrow ||
        !heading ||
        !description ||
        slideButtons.length !== 3 ||
        !previousButton ||
        !nextButton
    ) {
        return;
    }

    hero.dataset.sliderInitialized = "true";

    /* Slide Content */

    const slides = [
        {
            image: "images/hero-shed.jpg",
            eyebrow: "OUTDOOR BUILDINGS MADE BETTER",
            heading: "More Space<br>for What<br>Matters",
            description:
                "Durable storage sheds and outdoor buildings designed for your home, garden or business."
        },
        {
            image: "images/hero-shed.jpg",
            eyebrow: "YOUR SPACE, YOUR WAY",
            heading: "Make Room<br>for More<br>Possibilities",
            description:
                "Discover practical garden sheds with customizable styles, sizes and storage solutions."
        },
        {
            image: "images/hero-shed.jpg",
            eyebrow: "BUILT STRONG. BUILT FOR YOU.",
            heading: "Strength<br>That Works<br>for You",
            description:
                "Explore dependable garages and outdoor buildings designed for tools, vehicles and everyday needs."
        }
    ];

    let currentSlide = 0;
    let autoplayTimer = null;

    const autoplayDelay = 5000;

    /* Display Selected Slide */

    function showSlide(index) {
        currentSlide =
            (index + slides.length) % slides.length;

        const slide = slides[currentSlide];

        image.style.backgroundImage =
            `url("${slide.image}"), linear-gradient(135deg, #607487 0%, #344D63 45%, #102B43 100%)`;

        eyebrow.textContent = slide.eyebrow;
        heading.innerHTML = slide.heading;
        description.textContent = slide.description;

        slideButtons.forEach((button, buttonIndex) => {
            const isActive = buttonIndex === currentSlide;

            button.classList.toggle("is-active", isActive);

            if (isActive) {
                button.setAttribute("aria-current", "true");
            } else {
                button.removeAttribute("aria-current");
            }
        });
    }

    /* Previous and Next */

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function previousSlide() {
        showSlide(currentSlide - 1);
    }

    /* Automatic Slideshow */

    function stopAutoplay() {
        if (autoplayTimer !== null) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    function startAutoplay() {
        stopAutoplay();

        if (window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches) {
            return;
        }

        autoplayTimer = setInterval(() => {
            nextSlide();
        }, autoplayDelay);
    }

    /* Number Buttons */

    slideButtons.forEach((button) => {
        button.addEventListener("click", () => {
            showSlide(Number(button.dataset.slide));
            startAutoplay();
        });
    });

    /* Arrow Buttons */

    previousButton.addEventListener("click", () => {
        previousSlide();
        startAutoplay();
    });

    nextButton.addEventListener("click", () => {
        nextSlide();
        startAutoplay();
    });

    /* Pause While Hovering */

    hero.addEventListener("mouseenter", stopAutoplay);
    hero.addEventListener("mouseleave", startAutoplay);

    /* Pause While Keyboard-Focused */

    hero.addEventListener("focusin", stopAutoplay);

    hero.addEventListener("focusout", (event) => {
        if (!hero.contains(event.relatedTarget)) {
            startAutoplay();
        }
    });

    /* Pause When Tab Is Hidden */

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    });

    /* Initialize */

    showSlide(0);
    startAutoplay();

})();


/* =========================================
   SHEDWORKS — SCROLL TO TOP
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    const scrollTopButton = document.getElementById("swScrollTop");

    if (!scrollTopButton) return;

    function toggleScrollTopButton() {
        if (window.scrollY > 300) {
            scrollTopButton.classList.add("is-visible");
        } else {
            scrollTopButton.classList.remove("is-visible");
        }
    }

    window.addEventListener("scroll", toggleScrollTopButton, {
        passive: true
    });

    scrollTopButton.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    toggleScrollTopButton();
});


/* =========================================
   SHEDWORKS - INTERACTIVE CUSTOMIZATION
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    const studio = document.querySelector("#customization-studio");

    if (!studio) return;

    const steps = Array.from(studio.querySelectorAll(".sw-studio-step"));
    const backButton = studio.querySelector("#swStudioBack");
    const nextButton = studio.querySelector("#swStudioNext");
    const progressBar = studio.querySelector("#swStudioProgressBar");
    const progressText = studio.querySelector("#swStudioProgressText");
    const submitButton = studio.querySelector("#swStudioSubmit");
    const resetButton = studio.querySelector("#swStudioReset");

    let currentStep = 1;
    const totalSteps = steps.length;

    const getValue = (name) => {
        const selected = studio.querySelector(
            `input[name="${name}"]:checked`
        );
        return selected ? selected.value : "";
    };

    const getSelectValue = (id) => {
        const field = studio.querySelector(`#${id}`);
        return field ? field.value : "";
    };

    const getAddons = () => {
        return Array.from(
            studio.querySelectorAll('input[name="swStudioAddon"]:checked')
        ).map((item) => item.value);
    };

    function updateSummary() {
        const size = getValue("swStudioSize") || "Not selected";
        const colour = getValue("swStudioColour") || "Not selected";
        const door = getSelectValue("swStudioDoor") || "Not selected";
        const window = getValue("swStudioWindow") || "Not selected";
        const purpose = getSelectValue("swStudioPurpose") || "Not selected";
        const addons = getAddons();

        studio.querySelector("#swSummarySize").textContent = size;
        studio.querySelector("#swSummaryColour").textContent = colour;
        studio.querySelector("#swSummaryDoor").textContent = door;
        studio.querySelector("#swSummaryWindow").textContent = window;
        studio.querySelector("#swSummaryPurpose").textContent = purpose;
        studio.querySelector("#swSummaryAddons").textContent =
            addons.length ? addons.join(", ") : "None selected";
    }

    function showStep(stepNumber) {
        currentStep = Math.max(1, Math.min(stepNumber, totalSteps));

        steps.forEach((step) => {
            const isActive = Number(step.dataset.step) === currentStep;
            step.classList.toggle("is-active", isActive);
            step.setAttribute("aria-hidden", String(!isActive));
        });

        progressBar.style.width =
            `${(currentStep / totalSteps) * 100}%`;

        progressText.textContent =
            `Step ${currentStep} of ${totalSteps}`;

        backButton.disabled = currentStep === 1;

        nextButton.innerHTML =
            currentStep === totalSteps
                ? 'Review Your Choices <i class="fa-solid fa-check" aria-hidden="true"></i>'
                : 'Continue <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';

        updateSummary();
    }

    // Update the summary whenever an option changes.
    studio.addEventListener("change", updateSummary);

    backButton.addEventListener("click", function () {
        showStep(currentStep - 1);
    });

    nextButton.addEventListener("click", function () {
        if (currentStep < totalSteps) {
            showStep(currentStep + 1);
            return;
        }

        updateSummary();

        studio.querySelector(".sw-studio-preview").scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    });

    // Send the selected preferences to the contact page.
    submitButton.addEventListener("click", function () {
        const preferences = {
            size: getValue("swStudioSize"),
            colour: getValue("swStudioColour"),
            door: getSelectValue("swStudioDoor"),
            windows: getValue("swStudioWindow"),
            purpose: getSelectValue("swStudioPurpose"),
            features: getAddons()
        };

        const params = new URLSearchParams();
        params.set("source", "customization");
        params.set("preferences", JSON.stringify(preferences));

        window.location.href = `contact.html?${params.toString()}`;
    });

    // Restore the default choices.
    resetButton.addEventListener("click", function () {
        const defaultSize = studio.querySelector(
            'input[name="swStudioSize"][value="Small"]'
        );
        const defaultColour = studio.querySelector(
            'input[name="swStudioColour"][value="Navy"]'
        );
        const defaultWindow = studio.querySelector(
            'input[name="swStudioWindow"][value="No"]'
        );

        if (defaultSize) defaultSize.checked = true;
        if (defaultColour) defaultColour.checked = true;
        if (defaultWindow) defaultWindow.checked = true;

        studio.querySelector("#swStudioDoor").selectedIndex = 0;
        studio.querySelector("#swStudioPurpose").selectedIndex = 0;

        studio.querySelectorAll('input[name="swStudioAddon"]').forEach((item) => {
            item.checked = false;
        });

        showStep(1);
    });

    showStep(1);
});


/* =========================================
   SHEDWORKS - MATERIAL COMPARISON INTERACTION
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector(".sw-material-tool");
    if (!section) return;

    const materials = {
        wood: {
            title: "Wood",
            eyebrow: "NATURAL CHARACTER",
            label: "MATERIAL 01",
            image: "images/customize-material-wood.jpg",
            alt: "Wooden outdoor storage shed",
            description:
                "A traditional appearance with flexibility for different exterior styles. Maintenance and finish requirements depend on the specific wood and product.",
            highlights: [
                "Natural look",
                "Style flexibility",
                "Finish considerations"
            ]
        },
        metal: {
            title: "Metal",
            eyebrow: "PRACTICAL CONSTRUCTION",
            label: "MATERIAL 02",
            image: "images/customize-material-metal.jpg",
            alt: "Metal outdoor storage shed",
            description:
                "A practical option for many storage needs. Compare the coating, corrosion protection, ventilation and condensation guidance for each product.",
            highlights: [
                "Practical construction",
                "Coating considerations",
                "Ventilation matters"
            ]
        },
        resin: {
            title: "Resin / Plastic",
            eyebrow: "EASY-CARE DESIGN",
            label: "MATERIAL 03",
            image: "images/customize-material-resin.jpg",
            alt: "Resin outdoor storage shed",
            description:
                "A moulded-material option that can be straightforward to clean. Check UV resistance, assembly requirements and product-specific load limits.",
            highlights: [
                "Simple cleaning",
                "Moulded finishes",
                "Check load limits"
            ]
        }
    };

    const priorities = {
        maintenance: {
            title: "Compare upkeep requirements",
            text:
                "Check cleaning instructions, repainting or treatment needs, coating care and the manufacturer's maintenance schedule.",
            row: "maintenance"
        },
        appearance: {
            title: "Compare the finished look",
            text:
                "Review real product photos, available colours, surface textures and finish options to find a style that suits your property.",
            row: "appearance"
        },
        durability: {
            title: "Check product-specific durability",
            text:
                "Ask about weather exposure, corrosion or UV resistance, moisture protection, warranty terms and expected service conditions.",
            row: "durability"
        },
        usage: {
            title: "Match the material to your use",
            text:
                "Confirm the building's dimensions, structural suitability, access, ventilation and load limits for the items or activities you have planned.",
            row: "usage"
        }
    };

    const tabs = Array.from(section.querySelectorAll(".sw-material-tab"));
    const image = section.querySelector("#swMaterialImage");
    const imageLabel = section.querySelector("#swMaterialImageLabel");
    const title = section.querySelector("#swMaterialTitle");
    const eyebrow = section.querySelector("#swMaterialEyebrow");
    const description = section.querySelector("#swMaterialDescription");
    const highlights = section.querySelector("#swMaterialHighlights");
    const insightTitle = section.querySelector("#swMaterialInsightTitle");
    const insightText = section.querySelector("#swMaterialInsightText");
    const comparison = section.querySelector("#sw-material-comparison");
    const compareButton = section.querySelector("#swMaterialCompare");

    function selectMaterial(key) {
        const material = materials[key];
        if (!material) return;

        tabs.forEach((tab) => {
            const active = tab.dataset.material === key;
            tab.classList.toggle("is-active", active);
            tab.setAttribute("aria-pressed", String(active));
        });

        image.src = material.image;
        image.alt = material.alt;
        imageLabel.textContent = material.label;
        title.textContent = material.title;
        eyebrow.textContent = material.eyebrow;
        description.textContent = material.description;

        highlights.replaceChildren();

        material.highlights.forEach((item) => {
            const span = document.createElement("span");
            const icon = document.createElement("i");

            icon.className = "fa-solid fa-check";
            icon.setAttribute("aria-hidden", "true");

            span.append(icon, document.createTextNode(" " + item));
            highlights.appendChild(span);
        });
    }

    function updatePriority() {
        const selected = section.querySelector(
            'input[name="swMaterialPriority"]:checked'
        );

        if (!selected) return;

        const priority = priorities[selected.value];
        if (!priority) return;

        insightTitle.textContent = priority.title;
        insightText.textContent = priority.text;

        section.querySelectorAll(".sw-material-table tbody tr").forEach((row) => {
            row.classList.toggle(
                "is-priority",
                row.dataset.compare === priority.row
            );
        });
    }

    tabs.forEach((tab) => {
        tab.addEventListener("click", function () {
            selectMaterial(tab.dataset.material);
        });
    });

    section.querySelectorAll('input[name="swMaterialPriority"]').forEach((input) => {
        input.addEventListener("change", updatePriority);
    });

    compareButton.addEventListener("click", function () {
        comparison.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    selectMaterial("wood");
    updatePriority();
});


/* =========================================
   SHEDWORKS - SPACE PLANNER LOGIC
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector(".sw-space-planner");
    if (!section) return;

    const fields = {
        availableWidth: section.querySelector("#swAvailableWidth"),
        availableLength: section.querySelector("#swAvailableLength"),
        shedWidth: section.querySelector("#swShedWidth"),
        shedLength: section.querySelector("#swShedLength"),
        rotate: section.querySelector("#swShedRotate")
    };

    const error = section.querySelector("#swSpaceError");
    const footprint = section.querySelector("#swSpaceFootprint");

    const outputs = {
        availableWidth: section.querySelector("#swSpaceAvailableWidthLabel"),
        availableLength: section.querySelector("#swSpaceAvailableLengthLabel"),
        shedDimensions: section.querySelector("#swSpaceShedDimensions"),
        availableArea: section.querySelector("#swSpaceAvailableArea"),
        shedArea: section.querySelector("#swSpaceShedArea"),
        remainingArea: section.querySelector("#swSpaceRemainingArea"),
        resultTitle: section.querySelector("#swSpaceResultTitle"),
        resultText: section.querySelector("#swSpaceResultText")
    };

    let currentUnit = "ft";

    function getNumber(input) {
        const value = Number(input.value);
        return Number.isFinite(value) && value > 0 ? value : NaN;
    }

    function formatNumber(value) {
        return new Intl.NumberFormat(undefined, {
            maximumFractionDigits: 2
        }).format(value);
    }

    function formatDimension(value) {
        return `${formatNumber(value)} ${currentUnit}`;
    }

    function formatArea(value) {
        const unit = currentUnit === "ft" ? "sq ft" : "m²";
        return `${formatNumber(value)} ${unit}`;
    }

    function setError(message) {
        error.textContent = message;
        error.hidden = !message;
    }

    function updatePlanner() {
        const availableWidth = getNumber(fields.availableWidth);
        const availableLength = getNumber(fields.availableLength);
        const enteredShedWidth = getNumber(fields.shedWidth);
        const enteredShedLength = getNumber(fields.shedLength);

        const inputs = [
            fields.availableWidth,
            fields.availableLength,
            fields.shedWidth,
            fields.shedLength
        ];

        const invalid = inputs.some((input) => {
            const value = Number(input.value);
            return input.value.trim() === "" ||
                !Number.isFinite(value) ||
                value <= 0 ||
                value > 10000;
        });

        if (invalid) {
            setError("Enter a positive measurement for each field. Values must be 10,000 or less.");
            outputs.resultTitle.textContent = "Check your measurements";
            outputs.resultText.textContent =
                "Use the same unit for all dimensions and enter valid positive numbers.";
            return;
        }

        setError("");

        const shedWidth = fields.rotate.checked
            ? enteredShedLength
            : enteredShedWidth;

        const shedLength = fields.rotate.checked
            ? enteredShedWidth
            : enteredShedLength;

        const availableArea = availableWidth * availableLength;
        const shedArea = shedWidth * shedLength;
        const remainingArea = availableArea - shedArea;

        outputs.availableWidth.textContent = formatDimension(availableWidth);
        outputs.availableLength.textContent = formatDimension(availableLength);
        outputs.shedDimensions.textContent =
            `${formatNumber(shedWidth)} × ${formatNumber(shedLength)} ${currentUnit}`;

        outputs.availableArea.textContent = formatArea(availableArea);
        outputs.shedArea.textContent = formatArea(shedArea);
        outputs.remainingArea.textContent = formatArea(remainingArea);

        // Keep the footprint proportional to the available area's shape.
        const widthRatio = shedWidth / availableWidth;
        const lengthRatio = shedLength / availableLength;

        const fitsInCurrentOrientation =
            widthRatio <= 1 && lengthRatio <= 1;

        const alternateWidthRatio = enteredShedLength / availableWidth;
        const alternateLengthRatio = enteredShedWidth / availableLength;

        const fitsInAlternateOrientation =
            alternateWidthRatio <= 1 && alternateLengthRatio <= 1;

        const fits = fitsInCurrentOrientation;
        const canRotateToFit = !fits && fitsInAlternateOrientation;

        // Preserve aspect ratio while keeping the visual inside the diagram.
        const visualWidth = Math.min(widthRatio * 100, 100);
        const visualHeight = Math.min(lengthRatio * 100, 100);

        footprint.style.width = `${visualWidth}%`;
        footprint.style.height = `${visualHeight}%`;

        if (fits) {
            outputs.resultTitle.textContent = "Footprint fits within the entered dimensions";
            outputs.resultText.textContent =
                "The shed's rectangular footprint is within your stated width and length. Check access, required clearances, ground conditions and local rules before choosing a location.";
        } else if (canRotateToFit) {
            outputs.resultTitle.textContent = "Try rotating the shed";
            outputs.resultText.textContent =
                "The current orientation exceeds one dimension, but swapping the width and length fits the basic rectangular measurements. Required clearances still need to be checked.";
        } else {
            outputs.resultTitle.textContent = "The footprint exceeds your available area";
            outputs.resultText.textContent =
                "This shed exceeds at least one of your entered dimensions in either orientation. Try a smaller shed or recheck your measurements.";
        }

        footprint.setAttribute(
            "aria-label",
            `Shed footprint ${formatNumber(shedWidth)} by ${formatNumber(shedLength)} ${currentUnit}`
        );
    }

    function convertUnit(nextUnit) {
        if (nextUnit === currentUnit) return;

        const factor = currentUnit === "ft" ? 0.3048 : 1 / 0.3048;

        [
            fields.availableWidth,
            fields.availableLength,
            fields.shedWidth,
            fields.shedLength
        ].forEach((input) => {
            const current = Number(input.value);
            if (Number.isFinite(current) && current > 0) {
                input.value = String(
                    Math.round(current * factor * 100) / 100
                );
            }
        });

        currentUnit = nextUnit;

        section.querySelectorAll(".sw-space-unit-label").forEach((label) => {
            label.textContent = currentUnit;
        });

        updatePlanner();
    }

    section.querySelectorAll('input[name="swSpaceUnit"]').forEach((radio) => {
        radio.addEventListener("change", function () {
            if (radio.checked) convertUnit(radio.value);
        });
    });

    Object.values(fields).forEach((input) => {
        input.addEventListener("input", updatePlanner);
        input.addEventListener("change", updatePlanner);
    });

    section.querySelector("#swSpaceReset").addEventListener("click", function () {
        currentUnit = "ft";

        fields.availableWidth.value = "20";
        fields.availableLength.value = "25";
        fields.shedWidth.value = "10";
        fields.shedLength.value = "12";
        fields.rotate.checked = false;

        const feetOption = section.querySelector(
            'input[name="swSpaceUnit"][value="ft"]'
        );
        if (feetOption) feetOption.checked = true;

        section.querySelectorAll(".sw-space-unit-label").forEach((label) => {
            label.textContent = "ft";
        });

        updatePlanner();
    });

    updatePlanner();
});


// ==========================================
// SHEDWORKS - SHED FEATURE EXPLORER
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector("#shed-feature-explorer");

    if (!section) return;

    const options = section.querySelectorAll(".sw-feature-option");
    const image = section.querySelector("#swFeatureImage");
    const tag = section.querySelector("#swFeatureTag");
    const count = section.querySelector("#swFeatureCount");
    const kicker = section.querySelector("#swFeatureKicker");
    const title = section.querySelector("#swFeatureTitle");
    const icon = section.querySelector("#swFeatureIcon");
    const description = section.querySelector("#swFeatureDescription");
    const benefits = section.querySelector("#swFeatureBenefits");
    const tip = section.querySelector("#swFeatureTip");

    const featureData = {
        doors: {
            image: "images/feature-doors.jpg",
            alt: "Outdoor storage shed with wide double doors",
            tag: "ACCESS & ENTRY",
            number: "01",
            kicker: "EASY EVERYDAY ACCESS",
            title: "Make room for easier access.",
            icon: "fa-solid fa-door-open",
            description:
                "Think about what you plan to store and how often you will need to move items in and out. The right door arrangement can make everyday use more convenient.",
            benefits: [
                "Width of your largest stored items",
                "Space needed to open the doors",
                "Clear access around the shed entrance"
            ],
            tip:
                "Measure your largest equipment before choosing a door setup."
        },

        windows: {
            image: "images/feature-windows.jpg",
            alt: "Outdoor shed with windows bringing in natural daylight",
            tag: "LIGHT & VISIBILITY",
            number: "02",
            kicker: "MAKE THE MOST OF DAYLIGHT",
            title: "Bring natural light into your shed.",
            icon: "fa-regular fa-sun",
            description:
                "Windows can make a shed feel brighter and help you see stored items more easily. Think about where the sunlight falls and how much wall space you need for storage.",
            benefits: [
                "Window position and daylight direction",
                "Privacy and visibility requirements",
                "Wall space needed for shelving"
            ],
            tip:
                "Plan window placement alongside your storage layout."
        },

        storage: {
            image: "images/feature-storage.jpg",
            alt: "Organized shed interior with shelves and garden tools",
            tag: "SMART STORAGE",
            number: "03",
            kicker: "A PLACE FOR EVERYTHING",
            title: "Turn unused space into useful storage.",
            icon: "fa-solid fa-boxes-stacked",
            description:
                "A well-planned storage arrangement can help keep tools, garden supplies and everyday essentials organized. Consider what needs shelves, hooks or open floor space.",
            benefits: [
                "Wall space for shelves and hooks",
                "Floor area for larger equipment",
                "Easy access to frequently used items"
            ],
            tip:
                "Keep frequently used items accessible and leave room for larger equipment."
        },

        ventilation: {
            image: "images/feature-ventilation.jpg",
            alt: "Ventilation detail on an outdoor storage shed",
            tag: "AIRFLOW & COMFORT",
            number: "04",
            kicker: "THINK ABOUT AIR CIRCULATION",
            title: "Plan for suitable airflow.",
            icon: "fa-solid fa-wind",
            description:
                "Airflow requirements depend on what you store and the local climate. Discuss suitable ventilation options if the shed will hold moisture-sensitive items or be used as a workspace.",
            benefits: [
                "What you intend to store inside",
                "Local humidity and weather conditions",
                "Vent placement and available options"
            ],
            tip:
                "Ask which ventilation features are suitable for your intended use."
        },

        roof: {
            image: "images/feature-roof.jpg",
            alt: "Close-up of an outdoor shed roof and protective roofing details",
            tag: "ROOF & WEATHER",
            number: "05",
            kicker: "PLAN FOR LOCAL CONDITIONS",
            title: "Choose protection that suits your setting.",
            icon: "fa-solid fa-house",
            description:
                "Roof design and protective features should suit your local weather and the shed model. Check the available roofing options and installation requirements before making a decision.",
            benefits: [
                "Typical rainfall and wind conditions",
                "Roofing material and drainage options",
                "Manufacturer installation requirements"
            ],
            tip:
                "Confirm the model's weather ratings and site preparation requirements."
        }
    };

    function selectFeature(featureKey) {
        const feature = featureData[featureKey];

        if (!feature) return;

        options.forEach(function (option) {
            const isActive = option.dataset.feature === featureKey;

            option.classList.toggle("is-active", isActive);
            option.setAttribute("aria-pressed", String(isActive));
        });

        image.style.opacity = "0";

        window.setTimeout(function () {
            image.src = feature.image;
            image.alt = feature.alt;
            image.onload = function () {
                image.style.opacity = "1";
            };

            image.onerror = function () {
                image.style.opacity = "1";
            };

            tag.textContent = feature.tag;
            count.textContent = "FEATURE " + feature.number + " / 05";
            kicker.textContent = feature.kicker;
            title.textContent = feature.title;
            description.textContent = feature.description;
            tip.textContent = feature.tip;

            icon.innerHTML =
                '<i class="' + feature.icon + '" aria-hidden="true"></i>';

            benefits.replaceChildren();

            feature.benefits.forEach(function (item) {
                const listItem = document.createElement("li");
                listItem.textContent = item;
                benefits.appendChild(listItem);
            });
        }, 120);
    }

    options.forEach(function (option) {
        option.addEventListener("click", function () {
            selectFeature(option.dataset.feature);
        });
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector("#sw-site-preparation");

    if (!section) return;

    const checkboxes = section.querySelectorAll(
        '.sw-siteprep-check-item input[type="checkbox"]'
    );

    const count = section.querySelector("#swSitePrepCount");
    const progress = section.querySelector("#swSitePrepProgress");
    const fill = section.querySelector("#swSitePrepProgressFill");
    const label = section.querySelector("#swSitePrepProgressLabel");
    const status = section.querySelector("#swSitePrepStatus");
    const resetButton = section.querySelector("#swSitePrepReset");

    function updateProgress() {
        const total = checkboxes.length;

        const completed = Array.from(checkboxes).filter(function (checkbox) {
            return checkbox.checked;
        }).length;

        const percentage = total > 0
            ? Math.round((completed / total) * 100)
            : 0;

        count.textContent = completed + " / " + total;
        fill.style.width = percentage + "%";
        progress.setAttribute("aria-valuenow", percentage);

        if (completed === 0) {
            label.textContent = "Start by checking each preparation step.";
            status.textContent =
                "Your checklist progress will appear here as you complete tasks.";
        } else if (completed < total) {
            label.textContent =
                percentage + "% reviewed — keep working through your checklist.";

            status.textContent =
                completed + " of " + total +
                " items checked. Review the remaining requirements.";
        } else {
            label.textContent =
                "All checklist items reviewed. Confirm the details with your supplier.";

            status.textContent =
                "Checklist reviewed! Confirm your site specifications and arrangements before delivery.";
        }
    }

    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener("change", updateProgress);
    });

    resetButton.addEventListener("click", function () {
        checkboxes.forEach(function (checkbox) {
            checkbox.checked = false;
        });

        updateProgress();
    });

    updateProgress();
});


/* ==========================================
   SHEDWORKS - DELIVERY PLANNER INTERACTIONS
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector("#delivery-planner");
    if (!section) return;

    const form = section.querySelector("#swDeliveryPlannerForm");
    const shed = section.querySelector("#swPlannerShed");
    const date = section.querySelector("#swPlannerDate");
    const access = section.querySelector("#swPlannerAccess");
    const base = section.querySelector("#swPlannerBase");
    const installation = section.querySelector("#swPlannerInstall");
    const notes = section.querySelector("#swPlannerNotes");

    const percent = section.querySelector("#swPlannerPercent");
    const progress = section.querySelector("#swPlannerProgress");
    const progressFill = section.querySelector("#swPlannerProgressFill");
    const progressText = section.querySelector("#swPlannerProgressText");

    const summaryShed = section.querySelector("#swPlannerSummaryShed");
    const summaryDate = section.querySelector("#swPlannerSummaryDate");
    const summaryAccess = section.querySelector("#swPlannerSummaryAccess");
    const summaryInstall = section.querySelector("#swPlannerSummaryInstall");

    const nextStep = section.querySelector("#swPlannerNextStep");
    const copyButton = section.querySelector("#swPlannerCopy");
    const submitButton = form.querySelector('[type="submit"]');

    let planGenerated = false;

    // Prevent choosing a date in the past.
    // Uses the user's local calendar date.
    const today = new Date();
    const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    date.min = localToday;

    function selectedText(field, fallback) {
        if (!field.value) return fallback;

        if (field.tagName === "SELECT") {
            return field.options[field.selectedIndex].text;
        }

        return field.value;
    }

    function updateSummary() {
        const requiredFields = [shed, access, base, installation];

        const completed = requiredFields.filter(function (field) {
            return field.value.trim() !== "";
        }).length;

        const percentage = Math.round(
            (completed / requiredFields.length) * 100
        );

        percent.textContent = percentage + "%";
        progressFill.style.width = percentage + "%";
        progress.setAttribute("aria-valuenow", percentage);

        summaryShed.textContent = selectedText(shed, "Not selected");
        summaryAccess.textContent = selectedText(access, "Not assessed");
        summaryInstall.textContent = selectedText(installation, "Not decided");

        if (date.value) {
            const parsedDate = new Date(date.value + "T12:00:00");
            summaryDate.textContent = parsedDate.toLocaleDateString(
                undefined,
                { day: "numeric", month: "short", year: "numeric" }
            );
        } else {
            summaryDate.textContent = "Not selected";
        }

        if (completed === 0) {
            progressText.textContent =
                "Fill in the required fields to get started.";
        } else if (completed < requiredFields.length) {
            progressText.textContent =
                completed + " of " + requiredFields.length +
                " required details completed.";
        } else {
            progressText.textContent =
                "All required planning details have been selected.";
        }

        // Show the most relevant next step.
        let message =
            "Start with your shed type and site preparation details.";

        if (access.value === "Restricted access") {
            message =
                "Discuss vehicle access and unloading restrictions with your supplier.";
        } else if (access.value === "Narrow access") {
            message =
                "Measure the narrowest access point and confirm delivery requirements.";
        } else if (
            base.value === "Not started" ||
            base.value === "In progress"
        ) {
            message =
                "Confirm the required base specifications before arranging installation.";
        } else if (base.value === "Need guidance") {
            message =
                "Ask your supplier about suitable foundation and site preparation requirements.";
        } else if (
            installation.value === "Need installation information" ||
            installation.value === "Not decided"
        ) {
            message =
                "Confirm available installation services and what the service includes.";
        } else if (completed === requiredFields.length) {
            message =
                "Review your preferred date and confirm all arrangements with your supplier.";
        }

        const messageElement = nextStep.querySelector("p");
        messageElement.textContent = message;

        // Changes after generating the plan require regeneration.
        planGenerated = false;
        copyButton.disabled = true;
    }

    [shed, date, access, base, installation, notes].forEach(function (field) {
        field.addEventListener("input", updateSummary);
        field.addEventListener("change", updateSummary);
    });

    function buildPlanText() {
        return [
            "SHEDWORKS - DELIVERY & INSTALLATION PLAN",
            "",
            "Shed type: " + selectedText(shed, "Not selected"),
            "Preferred delivery date: " +
            (date.value
                ? summaryDate.textContent
                : "Not selected"),
            "Site access: " + selectedText(access, "Not assessed"),
            "Site base: " + selectedText(base, "Not assessed"),
            "Installation arrangement: " +
            selectedText(installation, "Not decided"),
            "Additional details: " +
            (notes.value.trim() || "None provided"),
            "",
            "Note: This is a planning summary, not a confirmed booking. " +
            "Please confirm dates, access, site suitability and services with the supplier."
        ].join("\n");
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!form.reportValidity()) return;

        if (date.value && date.value < localToday) {
            date.setCustomValidity("Please select today or a future date.");
            date.reportValidity();
            date.setCustomValidity("");
            return;
        }

        planGenerated = true;
        copyButton.disabled = false;

        progressText.textContent =
            "Your planning summary is ready to review.";

        nextStep.querySelector("p").textContent =
            "Your plan is prepared. Copy the summary or discuss these details with the ShedWorks team.";

        submitButton.innerHTML =
            'Plan Updated <i class="fa-solid fa-check" aria-hidden="true"></i>';

        // Bring the generated summary into view.
        nextStep.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    });

    copyButton.addEventListener("click", async function () {
        if (!planGenerated) return;

        const textToCopy = buildPlanText();

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(textToCopy);
            } else {
                const temporary = document.createElement("textarea");
                temporary.value = textToCopy;
                temporary.setAttribute("readonly", "");
                temporary.style.position = "fixed";
                temporary.style.opacity = "0";
                section.appendChild(temporary);
                temporary.select();

                const copied = document.execCommand("copy");
                temporary.remove();

                if (!copied) throw new Error("Copy unavailable");
            }

            copyButton.innerHTML =
                '<i class="fa-solid fa-check" aria-hidden="true"></i> Summary Copied';

        } catch (error) {
            // Offer the summary visibly if clipboard access is unavailable.
            const summaryWindow = window.open("", "_blank");

            if (summaryWindow) {
                const heading = summaryWindow.document.createElement("h2");
                heading.textContent = "Your ShedWorks Planning Summary";

                const content = summaryWindow.document.createElement("pre");
                content.textContent = textToCopy;

                summaryWindow.document.body.append(heading, content);
            } else {
                window.alert(
                    "Clipboard access is unavailable. Please try again in a supported browser."
                );
            }
        }
    });

    updateSummary();
});


/* Delivery FAQ: keep only one answer open at a time */
document.addEventListener("DOMContentLoaded", function () {
    const faqItems = document.querySelectorAll(
        "#delivery-faq .sw-deliveryfaq-item"
    );

    faqItems.forEach(function (item) {
        item.addEventListener("toggle", function () {
            if (!item.open) return;

            faqItems.forEach(function (otherItem) {
                if (otherItem !== item) {
                    otherItem.open = false;
                }
            });
        });
    });
});


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
        savedTheme = localStorage.getItem("shedworks-theme") || "light";
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
            localStorage.getItem("shedworks-direction") || "ltr";
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

// ---------------------------------------------
// Procedural artwork (fallback images)
// ---------------------------------------------

function rng(seed) {
    return () => (seed = (seed * 16807) % 2147483647) / 2147483647;
}

function art(type, seed, hue) {
    const random = rng(seed * 997 + 13);
    const width = 800;
    const height = 600;
    const h = hue;
    const color = (dh, saturation, lightness) =>
        `hsl(${(h + dh) % 360} ${saturation}% ${lightness}%)`;

    let artwork = `
        <defs>
            <linearGradient id="s" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="${color(0, 38, type === "city" ? 16 : 66)}"/>
                <stop offset="1" stop-color="${color(30, 42, type === "city" ? 36 : 80)}"/>
            </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#s)"/>
    `;

    artwork += `
        <circle
            cx="${150 + random() * 500}"
            cy="${120 + random() * 100}"
            r="${type === "city" ? 50 : 70}"
            fill="${color(60, 95, type === "city" ? 88 : 92)}"
            opacity=".9"
        />
    `;

    if (type === "city") {
        for (let i = 0; i < 3; i++) {
            let x = -20;
            const lightness = 22 - i * 5;

            while (x < 820) {
                const buildingWidth = 40 + random() * 70;
                const buildingHeight = 120 + random() * (260 - i * 50);

                artwork += `
                    <rect
                        x="${x}"
                        y="${600 - buildingHeight - i * 20}"
                        width="${buildingWidth}"
                        height="${buildingHeight + i * 20}"
                        fill="${color(-20, 40, lightness)}"
                    />
                `;

                if (i === 0) {
                    for (let k = 0; k < 14; k++) {
                        if (random() > 0.55) {
                            artwork += `
                                <rect
                                    x="${x + 6 + random() * (buildingWidth - 16)}"
                                    y="${600 - buildingHeight + random() * (buildingHeight - 20)}"
                                    width="6"
                                    height="8"
                                    fill="hsl(48 100% 70%)"
                                    opacity=".85"
                                />
                            `;
                        }
                    }
                }

                x += buildingWidth + 4;
            }
        }
    } else if (type === "nature") {
        for (let i = 0; i < 4; i++) {
            let points = "0,600";
            let x = 0;

            while (x <= 800) {
                points += ` ${x},${330 + i * 60 - random() * (150 - i * 20)}`;
                x += 70 + random() * 60;
            }

            artwork += `
                <polygon
                    points="${points} 800,600"
                    fill="${color(i * 12, 45, 48 - i * 10)}"
                />
            `;
        }

        for (let i = 0; i < 16; i++) {
            const x = random() * 800;
            const y = 470 + random() * 110;
            const scale = 0.6 + random() * 0.9;

            artwork += `
                <polygon
                    points="${x},${y - 70 * scale} ${x - 24 * scale},${y} ${x + 24 * scale},${y}"
                    fill="${color(110, 50, 14)}"
                />
            `;
        }
    } else {
        for (let i = 0; i < 5; i++) {
            let points = "0,600";

            for (let x = 0; x <= 800; x += 20) {
                points += ` ${x},${380 + i * 45 + Math.sin(x / 70 + i * 2 + seed) * 14}`;
            }

            artwork += `
                <polygon
                    points="${points} 800,600"
                    fill="${color(-30 + i * 8, 60, 58 - i * 9)}"
                    opacity=".92"
                />
            `;
        }

        const boatX = 200 + random() * 400;

        artwork += `
            <polygon
                points="${boatX},330 ${boatX},410 ${boatX + 60},410"
                fill="#fff"
            />
            <polygon
                points="${boatX - 8},418 ${boatX + 70},418 ${boatX + 52},440 ${boatX + 6},440"
                fill="${color(0, 60, 22)}"
            />
        `;
    }

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
            ${artwork}
        </svg>
    `;

    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

// ---------------------------------------------
// Photo data
// ---------------------------------------------

const PHOTO_DATA = [
    ["Alpine Dawn", "nature", 200, "r1", "Left the hut at 5. My fingers hurt for an hour."],
    ["Neon Skyline", "city", 265, "r3", "Got lost twice. The noodles afterwards were good."],
    ["Coastal Drift", "travel", 190, "r4", "Late ferry. Nobody seemed bothered."],
    ["Misty Forest", "nature", 150, "r2", "It rained the whole walk and I didn't mind."],
    ["Glass District", "city", 215, "r1", "Shot from a rooftop a stranger told me about."],
    ["Harbor Light", "travel", 20, "r3", "Last evening of the trip."],
    ["Golden Ridge", "nature", 35, "r4", "My mum likes this one. Says it looks like home."],
    ["Midnight Tower", "city", 300, "r2", "Couldn't sleep, so I walked."],
    ["Sunset Sail", "travel", 340, "r4", "A fisherman waved. I waved back."],
    ["Valley Haze", "nature", 120, "r3", "Farmer said the fog lifts by nine."],
    ["Metro Pulse", "city", 190, "r1", "Rush hour, oddly quiet."],
    ["Island Hop", "travel", 170, "r2", "Third of five islands. The one I'd go back to."]
];

const IMAGE_IDS = [1018, 1011, 1015, 1020, 1031, 1036, 1043, 1050, 1060, 10, 1039, 1016];

const PHOTO_DIMENSIONS = {
    r1: "800/1000",
    r2: "900/900",
    r3: "900/600",
    r4: "800/600"
};

const DATA = PHOTO_DATA.map((photo, index) => {
    const [title, category, hue, className, note] = photo;

    return {
        title,
        cat: category,
        cls: className,
        note,
        art: art(category, index + 3, hue),
        src: `https://picsum.photos/id/${IMAGE_IDS[index]}/${PHOTO_DIMENSIONS[className]}`
    };
});

const LABELS = {
    all: "All",
    nature: "Outdoors",
    city: "City",
    travel: "Travel"
};

// ---------------------------------------------
// App state and DOM elements
// ---------------------------------------------

const grid = document.getElementById("grid");
const filters = document.getElementById("filters");
const lightbox = document.getElementById("lb");
const viewer = document.getElementById("view");

const counter = document.getElementById("cn");
const captionTitle = document.getElementById("ct");
const captionNote = document.getElementById("cc");

const closeButton = document.getElementById("cl");
const previousButton = document.getElementById("pv");
const nextButton = document.getElementById("nx");

const savedPhotos = new Set();

let currentFilter = "all";
let visiblePhotos = [...DATA];
let currentIndex = 0;
let touchStartX = null;

// ---------------------------------------------
// Create photo cards
// ---------------------------------------------

DATA.forEach((photo, index) => {
    const figure = document.createElement("figure");
    photo.el = figure;

    figure.innerHTML = `
        <a
            class="ph ${photo.cls}"
            href="#"
            aria-label="Open ${photo.title}"
        >
            <img
                src="${photo.src}"
                alt="${photo.title}"
                loading="lazy"
                onerror="this.onerror=null;this.src=DATA[${index}].art"
            >
        </a>

        <figcaption>
            <span class="n">${String(index + 1).padStart(2, "0")}</span>
            <span class="t">${photo.title}</span>
            <button class="sv" type="button">Save</button>
            <span class="nt">${photo.note}</span>
        </figcaption>
    `;

    const photoLink = figure.querySelector(".ph");
    const saveButton = figure.querySelector(".sv");

    photoLink.addEventListener("click", (event) => {
        event.preventDefault();
        openPhoto(photo);
    });

    saveButton.addEventListener("click", () => {
        if (savedPhotos.has(index)) {
            savedPhotos.delete(index);
        } else {
            savedPhotos.add(index);
        }

        const isSaved = savedPhotos.has(index);

        saveButton.classList.toggle("on", isSaved);
        saveButton.textContent = isSaved ? "Saved" : "Save";
    });

    grid.appendChild(figure);
});

// ---------------------------------------------
// Create filter buttons
// ---------------------------------------------

Object.keys(LABELS).forEach((category) => {
    const button = document.createElement("button");

    button.className = "fb" + (category === "all" ? " active" : "");
    button.dataset.f = category;
    button.type = "button";

    const count = category === "all"
        ? DATA.length
        : DATA.filter((photo) => photo.cat === category).length;

    button.innerHTML = `${LABELS[category]}<sup>${count}</sup>`;
    button.addEventListener("click", () => filterPhotos(category));

    filters.appendChild(button);
});

// ---------------------------------------------
// Photo filtering and reveal animations
// ---------------------------------------------

function revealPhotos(photos) {
    photos.forEach((photo, index) => {
        photo.el.classList.remove("out", "in");

        setTimeout(() => {
            photo.el.classList.add("in");
        }, 40 + index * 50);
    });
}

function filterPhotos(category) {
    if (category === currentFilter) {
        return;
    }

    currentFilter = category;

    filters.querySelectorAll(".fb").forEach((button) => {
        button.classList.toggle("active", button.dataset.f === category);
    });

    DATA.forEach((photo) => {
        photo.el.classList.add("out");
    });

    setTimeout(() => {
        DATA.forEach((photo) => {
            const shouldHide = !(category === "all" || photo.cat === category);
            photo.el.classList.toggle("hidden", shouldHide);
        });

        visiblePhotos = DATA.filter(
            (photo) => !photo.el.classList.contains("hidden")
        );

        revealPhotos(visiblePhotos);
    }, 210);
}

const intersectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add("in");
                }, 40);

                intersectionObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.1
    }
);

DATA.forEach((photo) => {
    intersectionObserver.observe(photo.el);
});

// ---------------------------------------------
// Lightbox / image viewer
// ---------------------------------------------

function showPhoto() {
    const photo = visiblePhotos[currentIndex];

    viewer.innerHTML = "";

    const image = new Image();
    image.alt = photo.title;

    image.onerror = () => {
        image.onerror = null;
        image.src = photo.art;
    };

    image.src = photo.src;
    viewer.appendChild(image);

    captionTitle.textContent = photo.title;
    captionNote.textContent = photo.note;
    counter.textContent = `${currentIndex + 1} of ${visiblePhotos.length}`;
}

function openPhoto(photo) {
    currentIndex = visiblePhotos.indexOf(photo);

    if (currentIndex < 0) {
        currentIndex = 0;
    }

    showPhoto();
    lightbox.classList.add("on");
    document.body.style.overflow = "hidden";
    closeButton.focus();
}

function movePhoto(direction) {
    currentIndex = (
        currentIndex + direction + visiblePhotos.length
    ) % visiblePhotos.length;

    showPhoto();
}

function closeViewer() {
    lightbox.classList.remove("on");
    document.body.style.overflow = "";
}

closeButton.addEventListener("click", closeViewer);

nextButton.addEventListener("click", () => {
    movePhoto(1);
});

previousButton.addEventListener("click", () => {
    movePhoto(-1);
});

// ---------------------------------------------
// Keyboard navigation
// ---------------------------------------------

window.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("on")) {
        return;
    }

    if (event.key === "Escape") {
        closeViewer();
    }

    if (event.key === "ArrowRight") {
        movePhoto(1);
    }

    if (event.key === "ArrowLeft") {
        movePhoto(-1);
    }
});

// ---------------------------------------------
// Swipe navigation for touch devices
// ---------------------------------------------

viewer.addEventListener("pointerdown", (event) => {
    touchStartX = event.clientX;
});

viewer.addEventListener("pointerup", (event) => {
    if (touchStartX === null) {
        return;
    }

    const differenceX = event.clientX - touchStartX;
    touchStartX = null;

    if (Math.abs(differenceX) > 50) {
        movePhoto(differenceX < 0 ? 1 : -1);
    }
});

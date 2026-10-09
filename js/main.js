
/* =================================
   DecoSwipe - Main JavaScript
   ================================= */

let furniture = [];
let currentIndex = 0;
let likedFurniture = [];

/* ===== HTML Elements ===== */

const furnitureName = document.getElementById("furnitureName");
const furnitureStyle = document.getElementById("furnitureStyle");
const furniturePrice = document.querySelector(".furniture-price");
const furnitureCategory = document.querySelector(".furniture-category");
const furnitureImage = document.querySelector(".furniture-image");

const likeButton = document.getElementById("likeBtn");
const dislikeButton = document.getElementById("dislikeBtn");

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

const roomImageInput = document.getElementById("roomImageInput");
const roomCanvas = document.getElementById("roomCanvas");
const roomFurnitureSelect = document.getElementById("roomFurnitureSelect");
const addFurnitureBtn = document.getElementById("addFurnitureBtn");

/* ===== Load Furniture ===== */

fetch("./furniture.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Could not load furniture.json");
        }
        return response.json();
    })
    .then(data => {
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("No furniture items found.");
        }

        furniture = data;
        currentIndex = 0;
        showFurniture();
    })
    .catch(error => {
        console.error("Furniture loading error:", error);

        if (furnitureImage) {
            furnitureImage.textContent =
                "Furniture could not load. Please refresh the page.";
        }
    });

/* ===== Display Furniture ===== */

function showFurniture() {
    if (!furniture.length) return;

    const item = furniture[currentIndex];
    if (!item) return;

    if (furnitureName) furnitureName.textContent = item.name || "";
    if (furnitureStyle) furnitureStyle.textContent = item.style || "";
    if (furniturePrice) furniturePrice.textContent = item.price || "";
    if (furnitureCategory) furnitureCategory.textContent = item.category || "";

    if (furnitureImage) {
        furnitureImage.innerHTML = "";

        const image = document.createElement("img");
        image.src = item.image;
        image.alt = item.name || "Furniture";
        image.onerror = function () {
            console.error("Could not load furniture image:", item.image);
        };

        furnitureImage.appendChild(image);
    }
}

/* ===== Like and Dislike ===== */

if (likeButton) {
    likeButton.addEventListener("click", function () {
        const item = furniture[currentIndex];
        if (!item) return;

        likedFurniture.push(item);

        renderWishlist();
        getRecommendation();
        animateCard("right");
    });
}

if (dislikeButton) {
    dislikeButton.addEventListener("click", function () {
        if (!furniture[currentIndex]) return;
        animateCard("left");
    });
}

/* ===== Swipe Animation ===== */

function animateCard(direction) {
    const card = document.querySelector(".furniture-card");

    if (!card) {
        nextFurniture();
        return;
    }

    card.classList.remove("swipe-left", "swipe-right");
    card.classList.add(
        direction === "left" ? "swipe-left" : "swipe-right"
    );

    setTimeout(function () {
        card.classList.remove("swipe-left", "swipe-right");
        nextFurniture();
    }, 400);
}

function nextFurniture() {
    if (!furniture.length) return;

    currentIndex = (currentIndex + 1) % furniture.length;
    showFurniture();
}

/* ===== Style Recommendation ===== */

async function getRecommendation() {
    const output = document.getElementById("recommendedStyle");

    if (!output || likedFurniture.length === 0) return;

    const styleCounts = {};

    likedFurniture.forEach(item => {
        const style = item.style || "Modern";
        styleCounts[style] = (styleCounts[style] || 0) + 1;
    });

    const preferredStyle = Object.keys(styleCounts).reduce(
        (best, style) =>
            styleCounts[style] > styleCounts[best] ? style : best
    );

    // Show a recommendation immediately.
    output.textContent = preferredStyle + " ✨";

    // Try to get an updated recommendation from Flask.
    try {
        const response = await fetch(
            "http://127.0.0.1:5000/recommendation",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    liked_furniture: likedFurniture
                })
            }
        );

        if (!response.ok) {
            throw new Error("Backend returned " + response.status);
        }

        const data = await response.json();

        if (data.preferred_style) {
            output.textContent = data.preferred_style + " ✨";
        }
    } catch (error) {
        // The built-in recommendation remains visible.
        console.log(
            "Using built-in recommendation:",
            preferredStyle
        );
    }
}

/* ===== Furniture Search ===== */

function searchFurniture() {
    if (!searchInput) return;

    const query = searchInput.value.trim().toLowerCase();
    const message = document.getElementById("searchMessage");

    if (message) message.textContent = "";

    if (!query) {
        if (message) {
            message.textContent =
                "Enter a furniture name or style to explore.";
        }
        return;
    }

    const foundIndex = furniture.findIndex(item =>
        (item.name || "").toLowerCase().includes(query) ||
        (item.category || "").toLowerCase().includes(query) ||
        (item.style || "").toLowerCase().includes(query)
    );

    if (foundIndex === -1) {
        if (message) {
            message.textContent =
                'No pieces found for "' + searchInput.value.trim() +
                '". Try sofa, chair, table, or lamp.';
        }
        return;
    }

    currentIndex = foundIndex;
    showFurniture();

    if (message) message.textContent = "Found your piece ✨";
}

if (searchButton) {
    searchButton.addEventListener("click", searchFurniture);
}

if (searchInput) {
    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            searchFurniture();
        }
    });
}

/* ===== Wishlist ===== */

function renderWishlist() {
    const wishlist = document.getElementById("wishlistItems");
    const count = document.getElementById("wishlistCount");

    if (count) count.textContent = likedFurniture.length;

    if (wishlist) {
        wishlist.innerHTML = "";

        if (likedFurniture.length === 0) {
            wishlist.innerHTML =
                '<p class="wishlist-empty">' +
                'Your wishlist is waiting for its first favourite 🤎' +
                '</p>';
        } else {
            likedFurniture.forEach(item => {
                const card = document.createElement("article");
                card.className = "wishlist-card";

                const image = document.createElement("img");
                image.src = item.image;
                image.alt = item.name || "Furniture";

                const info = document.createElement("div");
                info.className = "wishlist-card-info";

                const category = document.createElement("span");
                category.className = "wishlist-category";
                category.textContent = item.category || "";

                const name = document.createElement("h3");
                name.textContent = item.name || "";

                const style = document.createElement("p");
                style.textContent = item.style || "";

                const price = document.createElement("p");
                price.className = "wishlist-price";
                price.textContent = item.price || "";

                const removeButton = document.createElement("button");
                removeButton.type = "button";
                removeButton.textContent = "Remove from wishlist";
                removeButton.className = "wishlist-remove";

                removeButton.addEventListener("click", function () {
                    likedFurniture = likedFurniture.filter(
                        likedItem => likedItem !== item
                    );

                    renderWishlist();
                });

                info.append(
                    category,
                    name,
                    style,
                    price,
                    removeButton
                );

                card.append(image, info);
                wishlist.appendChild(card);
            });
        }
    }

    updateRoomFurnitureOptions();
}

const clearWishlistButton = document.getElementById("clearWishlist");

if (clearWishlistButton) {
    clearWishlistButton.addEventListener("click", function () {
        likedFurniture = [];
        renderWishlist();

        const output = document.getElementById("recommendedStyle");
        if (output) output.textContent = "Like furniture to discover your style ✨";
    });
}

/* ===== Room Photo Upload ===== */

if (roomImageInput && roomCanvas) {
    roomImageInput.addEventListener("change", function () {
        const file = roomImageInput.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please choose an image file.");
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {
            const roomImage = document.createElement("img");
            roomImage.src = event.target.result;
            roomImage.alt = "Your room preview";
            roomImage.className = "room-background";

            // Uploading a new room clears previous furniture placements.
            roomCanvas.replaceChildren(roomImage);
        };

        reader.onerror = function () {
            alert("Could not load the photo. Please try another image.");
        };

        reader.readAsDataURL(file);
    });
}

/* ===== Update Room Furniture Dropdown ===== */

function updateRoomFurnitureOptions() {
    if (!roomFurnitureSelect) return;

    const previousValue = roomFurnitureSelect.value;

    roomFurnitureSelect.innerHTML =
        '<option value="">Choose furniture...</option>';

    likedFurniture.forEach((item, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = item.name || "Furniture";
        roomFurnitureSelect.appendChild(option);
    });

    if (
        previousValue !== "" &&
        Number(previousValue) < likedFurniture.length
    ) {
        roomFurnitureSelect.value = previousValue;
    }
}

/* ===== Add Furniture to Room ===== */

if (addFurnitureBtn && roomFurnitureSelect && roomCanvas) {
    addFurnitureBtn.addEventListener("click", function () {
        const selectedIndex = roomFurnitureSelect.value;

        if (selectedIndex === "") {
            alert("Please choose a furniture piece first.");
            return;
        }

        const roomBackground = roomCanvas.querySelector(".room-background");

        if (!roomBackground) {
            alert("Please upload your room photo first.");
            return;
        }

        const item = likedFurniture[Number(selectedIndex)];

        if (!item) {
            alert("Please choose a valid furniture piece.");
            return;
        }

        const furnitureImage = document.createElement("img");
        furnitureImage.src = item.image;
        furnitureImage.alt = item.name || "Furniture";
        furnitureImage.className = "placed-furniture";
        furnitureImage.style.width = "160px";
        furnitureImage.draggable = false;
        furnitureImage.title = item.name || "Furniture";

        const resizeControls = document.createElement("div");
        resizeControls.className = "furniture-resize-controls";

        /* Rotation controls */

        let furnitureRotation = 0;

        const rotateLeftBtn = document.createElement("button");
        rotateLeftBtn.type = "button";
        rotateLeftBtn.textContent = "↶";
        rotateLeftBtn.title = "Rotate furniture left";
        rotateLeftBtn.className = "rotate-furniture-btn";

        rotateLeftBtn.addEventListener("click", function () {
            furnitureRotation -= 15;
            furnitureImage.style.transform =
                "rotate(" + furnitureRotation + "deg)";
        });

        const rotateRightBtn = document.createElement("button");
        rotateRightBtn.type = "button";
        rotateRightBtn.textContent = "↷";
        rotateRightBtn.title = "Rotate furniture right";
        rotateRightBtn.className = "rotate-furniture-btn";

        rotateRightBtn.addEventListener("click", function () {
            furnitureRotation += 15;
            furnitureImage.style.transform =
                "rotate(" + furnitureRotation + "deg)";
        });

        /* Resize controls */

        let furnitureScale = 1;

        const smallerBtn = document.createElement("button");
        smallerBtn.type = "button";
        smallerBtn.textContent = "−";
        smallerBtn.title = "Make furniture smaller";

        const sizeLabel = document.createElement("span");
        sizeLabel.textContent = "100%";

        const largerBtn = document.createElement("button");
        largerBtn.type = "button";
        largerBtn.textContent = "+";
        largerBtn.title = "Make furniture bigger";

        smallerBtn.addEventListener("click", function () {
            furnitureScale = Math.max(0.4, furnitureScale - 0.1);
            furnitureImage.style.width = (160 * furnitureScale) + "px";
            sizeLabel.textContent =
                Math.round(furnitureScale * 100) + "%";
            positionControls();
        });

        largerBtn.addEventListener("click", function () {
            furnitureScale = Math.min(2, furnitureScale + 0.1);
            furnitureImage.style.width = (160 * furnitureScale) + "px";
            sizeLabel.textContent =
                Math.round(furnitureScale * 100) + "%";
            positionControls();
        });

        /* Remove control */

        const removeFurnitureBtn = document.createElement("button");
        removeFurnitureBtn.type = "button";
        removeFurnitureBtn.textContent = "×";
        removeFurnitureBtn.title = "Remove furniture from room";
        removeFurnitureBtn.className = "remove-placed-furniture";

        removeFurnitureBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            furnitureImage.remove();
            resizeControls.remove();
        });

        resizeControls.append(
            rotateLeftBtn,
            smallerBtn,
            sizeLabel,
            largerBtn,
            rotateRightBtn,
            removeFurnitureBtn
        );

        /* Add elements to the room */

        roomCanvas.appendChild(furnitureImage);
        roomCanvas.appendChild(resizeControls);

        function positionControls() {
            const left = parseFloat(furnitureImage.style.left) ||
                roomCanvas.clientWidth * 0.35;
            const top = parseFloat(furnitureImage.style.top) ||
                roomCanvas.clientHeight * 0.35;

            resizeControls.style.left = left + "px";
            resizeControls.style.top = Math.max(0, top - 45) + "px";
        }

        // Start at a convenient location inside the room.
        furnitureImage.style.left =
            Math.max(0, roomCanvas.clientWidth * 0.35) + "px";
        furnitureImage.style.top =
            Math.max(0, roomCanvas.clientHeight * 0.35) + "px";

        positionControls();

        /* Drag furniture around the room */

        furnitureImage.addEventListener("pointerdown", function (event) {
            event.preventDefault();

            const canvasRect = roomCanvas.getBoundingClientRect();
            const imageRect = furnitureImage.getBoundingClientRect();

            const offsetX = event.clientX - imageRect.left;
            const offsetY = event.clientY - imageRect.top;

            furnitureImage.setPointerCapture(event.pointerId);

            function moveFurniture(moveEvent) {
                const left =
                    moveEvent.clientX - canvasRect.left - offsetX;
                const top =
                    moveEvent.clientY - canvasRect.top - offsetY;

                const maxLeft = Math.max(
                    0,
                    roomCanvas.clientWidth - furnitureImage.offsetWidth
                );

                const maxTop = Math.max(
                    0,
                    roomCanvas.clientHeight - furnitureImage.offsetHeight
                );

                furnitureImage.style.left =
                    Math.max(0, Math.min(left, maxLeft)) + "px";

                furnitureImage.style.top =
                    Math.max(0, Math.min(top, maxTop)) + "px";

                positionControls();
            }

            function stopMoving() {
                furnitureImage.removeEventListener(
                    "pointermove",
                    moveFurniture
                );
                furnitureImage.removeEventListener(
                    "pointerup",
                    stopMoving
                );
                furnitureImage.removeEventListener(
                    "pointercancel",
                    stopMoving
                );
            }

            furnitureImage.addEventListener("pointermove", moveFurniture);
            furnitureImage.addEventListener("pointerup", stopMoving);
            furnitureImage.addEventListener("pointercancel", stopMoving);
        });
    });
}

/* ===== Initial Setup ===== */

renderWishlist();


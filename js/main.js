// ================================
// DecoSwipe Furniture Swipe Logic
// ================================

const furniture = [

    {
        name: "Modern Comfort Sofa",
        category: "SOFA",
        style: "Modern • Minimalist",
        price: "₹24,999",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc"
    },

    {
        name: "Luxury Velvet Sofa",
        category: "SOFA",
        style: "Luxury • Elegant",
        price: "₹32,999",
        image: "https://images.unsplash.com/photo-1550254478-ead40cc54513"
    },

    {
        name: "Scandinavian Lounge Chair",
        category: "CHAIR",
        style: "Scandinavian • Cozy",
        price: "₹12,499",
        image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c"
    },

    {
        name: "Minimal Coffee Table",
        category: "TABLE",
        style: "Minimalist • Modern",
        price: "₹8,999",
        image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d"
    },

    {
        name: "Modern Floor Lamp",
        category: "LIGHTING",
        style: "Modern • Warm",
        price: "₹5,499",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c"
    }

    
];


// Current furniture
let currentIndex = 0;


// Liked furniture
let likedFurniture = [];


// Get HTML elements
const furnitureName = document.getElementById("furnitureName");
const furnitureStyle = document.getElementById("furnitureStyle");
const furniturePrice = document.querySelector(".furniture-price");
const furnitureCategory = document.querySelector(".furniture-category");
const furnitureImage = document.querySelector(".furniture-image");

const likeButton = document.getElementById("likeBtn");
const dislikeButton = document.getElementById("dislikeBtn");


// Display furniture
function showFurniture() {

    const item = furniture[currentIndex];

    furnitureName.textContent = item.name;

    furnitureStyle.textContent = item.style;

    furniturePrice.textContent = item.price;

    furnitureCategory.textContent = item.category;

    furnitureImage.innerHTML = `
    <img src="${item.image}" alt="${item.name}">
`;

}


// Like button
likeButton.addEventListener("click", function() {

    const item = furniture[currentIndex];

    likedFurniture.push(item);

    console.log("Liked:", item.name);

    animateCard("right");

});


// Dislike button
dislikeButton.addEventListener("click", function() {

    const item = furniture[currentIndex];

    console.log("Disliked:", item.name);

    animateCard("left");

});

// Animate furniture card
function animateCard(direction) {

    const card = document.querySelector(".furniture-card");

    if (direction === "left") {

        card.classList.add("swipe-left");

    } else {

        card.classList.add("swipe-right");

    }

    setTimeout(function() {

        card.classList.remove("swipe-left");
        card.classList.remove("swipe-right");

        nextFurniture();

    }, 400);

}
// Show next furniture
function nextFurniture() {

    currentIndex++;

    if (currentIndex >= furniture.length) {

        currentIndex = 0;

    }

    showFurniture();

}


// Start with first furniture
showFurniture();

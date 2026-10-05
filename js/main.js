// ================================
// DecoSwipe Furniture Swipe Logic
// ================================

const furniture = [

    {
        name: "Modern Comfort Sofa",
        category: "SOFA",
        style: "Modern • Minimalist",
        price: "₹24,999",
        emoji: "🛋️"
    },

    {
        name: "Luxury Velvet Sofa",
        category: "SOFA",
        style: "Luxury • Elegant",
        price: "₹32,999",
        emoji: "🛋️"
    },

    {
        name: "Scandinavian Lounge Chair",
        category: "CHAIR",
        style: "Scandinavian • Cozy",
        price: "₹12,499",
        emoji: "🪑"
    },

    {
        name: "Minimal Coffee Table",
        category: "TABLE",
        style: "Minimalist • Modern",
        price: "₹8,999",
        emoji: "🪵"
    },

    {
        name: "Modern Floor Lamp",
        category: "LIGHTING",
        style: "Modern • Warm",
        price: "₹5,499",
        emoji: "💡"
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

    furnitureImage.textContent = item.emoji;

}


// Like button
likeButton.addEventListener("click", function() {

    const item = furniture[currentIndex];

    likedFurniture.push(item);

    console.log("Liked:", item.name);

    nextFurniture();

});


// Dislike button
dislikeButton.addEventListener("click", function() {

    const item = furniture[currentIndex];

    console.log("Disliked:", item.name);

    nextFurniture();

});


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

// Store data in localStorage
const STORAGE_KEYS = {
    FLAT: 'currentFlat',
    TOYS: 'toys'
};

// Initialize toys array in localStorage if it doesn't exist
if (!localStorage.getItem(STORAGE_KEYS.TOYS)) {
    localStorage.setItem(STORAGE_KEYS.TOYS, JSON.stringify([]));
}

// Page Navigation with Animation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
        page.classList.remove('fade-in');
    });
    const newPage = document.getElementById(pageId);
    newPage.classList.remove('hidden');
    // Force reflow to ensure animation plays
    void newPage.offsetWidth;
    newPage.classList.add('fade-in');
}

// Login Functions
function login() {
    const flatNumber = document.getElementById('flatNumber').value.trim();
    if (!flatNumber) {
        return;
    }
    
    localStorage.setItem(STORAGE_KEYS.FLAT, flatNumber);
    document.getElementById('currentFlat').textContent = flatNumber;
    showPage('toyDashboard');
    displayMyToys();
}

function logout() {
    localStorage.removeItem(STORAGE_KEYS.FLAT);
    showPage('loginPage');
}

// Check if user is logged in
function checkAuth() {
    const currentFlat = localStorage.getItem(STORAGE_KEYS.FLAT);
    if (currentFlat) {
        document.getElementById('currentFlat').textContent = currentFlat;
        showPage('toyDashboard');
        displayMyToys();
    } else {
        showPage('loginPage');
    }
}

// Toy Management
function uploadToy() {
    const toyName = document.getElementById('toyName').value.trim();
    const description = document.getElementById('toyDescription').value.trim();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const imageFile = document.getElementById('toyImage').files[0];

    if (!toyName || !description || !startDate || !endDate) {
        return;
    }

    const toy = {
        id: Date.now(),
        name: toyName,
        description,
        startDate,
        endDate,
        owner: localStorage.getItem(STORAGE_KEYS.FLAT),
        status: 'available',
        requestedBy: null,
        image: imageFile ? URL.createObjectURL(imageFile) : null
    };

    const toys = JSON.parse(localStorage.getItem(STORAGE_KEYS.TOYS));
    toys.push(toy);
    localStorage.setItem(STORAGE_KEYS.TOYS, JSON.stringify(toys));

    // Reset form
    document.getElementById('toyName').value = '';
    document.getElementById('toyDescription').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('toyImage').value = '';

    displayMyToys();
    showNotification('Toy shared successfully!', 'success');
}

function displayMyToys() {
    const currentFlat = localStorage.getItem(STORAGE_KEYS.FLAT);
    const toys = JSON.parse(localStorage.getItem(STORAGE_KEYS.TOYS));
    const myToys = toys.filter(toy => toy.owner === currentFlat);

    const myToysList = document.getElementById('myToysList');
    myToysList.innerHTML = myToys.map(toy => `
        <div class="toy-card slide-up">
            ${toy.image ? `<img src="${toy.image}" alt="${toy.name}">` : ''}
            <div class="toy-card-content">
                <h3>${toy.name}</h3>
                <p>${toy.description}</p>
                <p>Available: ${formatDate(toy.startDate)} to ${formatDate(toy.endDate)}</p>
                <div class="toy-status ${toy.status !== 'available' ? 'requested' : ''}">
                    Status: ${toy.status === 'available' ? 'Available' : `Requested by Flat ${toy.requestedBy}`}
                </div>
                ${toy.status !== 'available' ? `
                    <button onclick="returnToy(${toy.id})" class="primary-btn">Mark as Returned</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function displayAllToys() {
    const currentFlat = localStorage.getItem(STORAGE_KEYS.FLAT);
    const toys = JSON.parse(localStorage.getItem(STORAGE_KEYS.TOYS));
    const otherToys = toys.filter(toy => toy.owner !== currentFlat);

    const toysList = document.getElementById('toysList');
    toysList.innerHTML = otherToys.map(toy => `
        <div class="toy-card slide-up">
            ${toy.image ? `<img src="${toy.image}" alt="${toy.name}">` : ''}
            <div class="toy-card-content">
                <h3>${toy.name}</h3>
                <p>${toy.description}</p>
                <p>Owner: Flat ${toy.owner}</p>
                <p>Available: ${formatDate(toy.startDate)} to ${formatDate(toy.endDate)}</p>
                <div class="toy-status ${toy.status !== 'available' ? 'requested' : ''}">
                    Status: ${toy.status === 'available' ? 'Available' : `Requested by Flat ${toy.requestedBy}`}
                </div>
                ${toy.status === 'available' ? `
                    <button onclick="requestToy(${toy.id})" class="primary-btn">Request Toy</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function requestToy(toyId) {
    const currentFlat = localStorage.getItem(STORAGE_KEYS.FLAT);
    const toys = JSON.parse(localStorage.getItem(STORAGE_KEYS.TOYS));
    const toyIndex = toys.findIndex(toy => toy.id === toyId);

    if (toyIndex !== -1) {
        toys[toyIndex].status = 'requested';
        toys[toyIndex].requestedBy = currentFlat;
        localStorage.setItem(STORAGE_KEYS.TOYS, JSON.stringify(toys));
        displayAllToys();
    }
}

function returnToy(toyId) {
    const toys = JSON.parse(localStorage.getItem(STORAGE_KEYS.TOYS));
    const toyIndex = toys.findIndex(toy => toy.id === toyId);

    if (toyIndex !== -1) {
        toys[toyIndex].status = 'available';
        toys[toyIndex].requestedBy = null;
        localStorage.setItem(STORAGE_KEYS.TOYS, JSON.stringify(toys));
        displayMyToys();
        displayAllToys();
    }
}

function searchToys() {
    const searchTerm = document.getElementById('searchToys').value.toLowerCase();
    const currentFlat = localStorage.getItem(STORAGE_KEYS.FLAT);
    const toys = JSON.parse(localStorage.getItem(STORAGE_KEYS.TOYS));
    const otherToys = toys.filter(toy => 
        toy.owner !== currentFlat && 
        (toy.name.toLowerCase().includes(searchTerm) || 
         toy.description.toLowerCase().includes(searchTerm))
    );

    const toysList = document.getElementById('toysList');
    toysList.innerHTML = otherToys.map(toy => `
        <div class="toy-card slide-up">
            ${toy.image ? `<img src="${toy.image}" alt="${toy.name}">` : ''}
            <div class="toy-card-content">
                <h3>${toy.name}</h3>
                <p>${toy.description}</p>
                <p>Owner: Flat ${toy.owner}</p>
                <p>Available: ${formatDate(toy.startDate)} to ${formatDate(toy.endDate)}</p>
                <div class="toy-status ${toy.status !== 'available' ? 'requested' : ''}">
                    Status: ${toy.status === 'available' ? 'Available' : `Requested by Flat ${toy.requestedBy}`}
                </div>
                ${toy.status === 'available' ? `
                    <button onclick="requestToy(${toy.id})" class="primary-btn">Request Toy</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Helper Functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Navigation Functions
function showBrowsePage() {
    showPage('browsePage');
    displayAllToys();
}

function showDashboard() {
    showPage('toyDashboard');
    displayMyToys();
}

// Initialize app
window.onload = checkAuth;
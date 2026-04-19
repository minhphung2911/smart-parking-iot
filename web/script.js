// Smart Parking Web Interface

const slots = document.querySelectorAll('.slot');
const availableSpan = document.getElementById('available');
const occupiedSpan = document.getElementById('occupied');

// Mock data - replace with real API calls
function updateStatus() {
    const mockData = [0, 1, 0]; // 0=available, 1=occupied
    let available = 0, occupied = 0;
    
    slots.forEach((slot, index) => {
        if (mockData[index] === 1) {
            slot.classList.add('occupied');
            occupied++;
        } else {
            slot.classList.remove('occupied');
            available++;
        }
    });
    
    availableSpan.textContent = available;
    occupiedSpan.textContent = occupied;
}

// Update every 2 seconds
setInterval(updateStatus, 2000);
updateStatus();

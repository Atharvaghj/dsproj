const socket = new WebSocket('ws://localhost:3000');

socket.onopen = () => {
    console.log('Connected to server');
};

socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === 'move' || message.type === 'reset') {
        // Handle move/reset messages from the server
        // Update game interface accordingly
    }
};

socket.onerror = (error) => {
    console.error('WebSocket error:', error);
};

// Function to handle player clicks on cells
function handleCellClick(cellIndex) {
    // Send move information to the server
    const moveMessage = { type: 'move', index: cellIndex };
    socket.send(JSON.stringify(moveMessage));
}

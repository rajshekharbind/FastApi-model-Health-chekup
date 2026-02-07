/**
 * WebSocket Real-Time Updates
 * Optional feature for real-time insurance premium predictions
 * Enable by uncommenting the socketio import in index.html
 */

// Configuration
const SOCKET_URL = 'http://127.0.0.1:8000';
const RECONNECT_ATTEMPTS = 5;
let reconnectAttempt = 0;

// WebSocket connection helper (optional)
class RealtimeSocket {
    constructor() {
        this.socket = null;
        this.connected = false;
    }

    connect() {
        // Using native WebSocket as fallback
        try {
            this.socket = new WebSocket('ws://127.0.0.1:8000/ws');
            
            this.socket.onopen = () => {
                this.connected = true;
                reconnectAttempt = 0;
                console.log('✅ Connected to real-time server');
            };

            this.socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleRealtimeUpdate(data);
            };

            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.connected = false;
            };

            this.socket.onclose = () => {
                this.connected = false;
                this.attemptReconnect();
            };
        } catch (error) {
            console.log('WebSocket not available, using polling instead');
            this.usePolling();
        }
    }

    handleRealtimeUpdate(data) {
        console.log('📡 Real-time update received:', data);
        
        // Update confidence bar
        if (data.confidence) {
            const confBar = document.querySelector('.confidence-bar');
            if (confBar) {
                const newWidth = data.confidence * 100;
                confBar.style.width = newWidth + '%';
                const confText = confBar.querySelector('.confidence-text');
                if (confText) {
                    confText.textContent = newWidth.toFixed(1) + '%';
                }
            }
        }

        // Update probability bars
        if (data.class_probabilities) {
            const bars = document.querySelectorAll('.probability-item .prob-bar');
            bars.forEach((bar, idx) => {
                const classes = Object.keys(data.class_probabilities);
                if (classes[idx]) {
                    const newValue = data.class_probabilities[classes[idx]];
                    bar.style.width = (newValue * 100) + '%';
                }
            });
        }
    }

    attemptReconnect() {
        if (reconnectAttempt < RECONNECT_ATTEMPTS) {
            reconnectAttempt++;
            const delay = Math.pow(2, reconnectAttempt) * 1000; // Exponential backoff
            console.log(`Attempting to reconnect in ${delay}ms...`);
            setTimeout(() => this.connect(), delay);
        }
    }

    usePolling() {
        // Fallback to polling if WebSocket is not available
        console.log('Using polling for updates (less efficient)');
    }

    send(data) {
        if (this.connected && this.socket) {
            this.socket.send(JSON.stringify(data));
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.connected = false;
        }
    }
}

// Initialize RealtimeSocket (optional, disabled by default)
// const realtimeSocket = new RealtimeSocket();
// realtimeSocket.connect();

/**
 * Real-Time Collaboration System for Cyberpunk GM Screen
 * Enables multiple users to share and sync game state
 */

class CollaborationSystem {
  constructor(options = {}) {
    this.roomId = options.roomId || this.generateRoomId();
    this.userId = options.userId || this.generateUserId();
    this.username = options.username || 'Anonymous GM';
    this.role = options.role || 'gm'; // 'gm' or 'player'
    
    this.connection = null;
    this.peers = new Map();
    this.syncHandlers = new Map();
    this.isHost = false;
    this.connectionState = 'disconnected';
    
    // WebRTC configuration
    this.rtcConfig = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };
    
    // State sync settings
    this.syncThrottle = 100; // ms
    this.lastSyncTime = 0;
    this.pendingUpdates = [];
    
    this.init();
  }
  
  init() {
    // For demo purposes, using localStorage for signaling
    // In production, this would use WebSocket or Firebase
    this.setupLocalSignaling();
    this.setupStateSync();
  }
  
  setupLocalSignaling() {
    // Listen for signaling messages via localStorage events
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith('cyberpunk-collab-signal-')) {
        try {
          const signal = JSON.parse(e.newValue);
          if (signal.targetId === this.userId && signal.senderId !== this.userId) {
            this.handleSignal(signal);
          }
        } catch (error) {
          console.error('Failed to parse signal:', error);
        }
      }
    });
  }
  
  setupStateSync() {
    // Sync dice rolls
    this.registerSyncHandler('dice-roll', (data) => {
      const event = new CustomEvent('remote-dice-roll', { detail: data });
      document.dispatchEvent(event);
    });
    
    // Sync combat tracker
    this.registerSyncHandler('combat-update', (data) => {
      const event = new CustomEvent('remote-combat-update', { detail: data });
      document.dispatchEvent(event);
    });
    
    // Sync notes
    this.registerSyncHandler('notes-update', (data) => {
      const event = new CustomEvent('remote-notes-update', { detail: data });
      document.dispatchEvent(event);
    });
    
    // Sync panel positions
    this.registerSyncHandler('panel-move', (data) => {
      const event = new CustomEvent('remote-panel-move', { detail: data });
      document.dispatchEvent(event);
    });
    
    // Sync cursor positions
    this.registerSyncHandler('cursor-move', (data) => {
      this.updatePeerCursor(data.userId, data.position);
    });
  }
  
  // Connection Management
  async createRoom() {
    this.isHost = true;
    this.connectionState = 'hosting';
    
    const roomInfo = {
      roomId: this.roomId,
      hostId: this.userId,
      hostname: this.username,
      created: Date.now(),
      maxPeers: 4
    };
    
    // Store room info
    localStorage.setItem(`cyberpunk-collab-room-${this.roomId}`, JSON.stringify(roomInfo));
    
    // Notify UI
    this.dispatchConnectionEvent('room-created', roomInfo);
    
    return this.roomId;
  }
  
  async joinRoom(roomId) {
    this.roomId = roomId;
    this.connectionState = 'connecting';
    
    // Check if room exists
    const roomInfo = this.getRoomInfo(roomId);
    if (!roomInfo) {
      throw new Error('Room not found');
    }
    
    // Create peer connection to host
    const peer = await this.createPeerConnection(roomInfo.hostId);
    
    // Create and send offer
    const offer = await peer.connection.createOffer();
    await peer.connection.setLocalDescription(offer);
    
    this.sendSignal(roomInfo.hostId, {
      type: 'offer',
      offer: offer,
      userId: this.userId,
      username: this.username
    });
    
    this.dispatchConnectionEvent('joining-room', roomInfo);
  }
  
  async createPeerConnection(peerId) {
    const connection = new RTCPeerConnection(this.rtcConfig);
    const dataChannel = connection.createDataChannel('data', {
      ordered: true
    });
    
    const peer = {
      id: peerId,
      connection,
      dataChannel,
      username: 'Unknown',
      role: 'player',
      cursor: { x: 0, y: 0 },
      lastActivity: Date.now()
    };
    
    // Handle ICE candidates
    connection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignal(peerId, {
          type: 'ice-candidate',
          candidate: event.candidate,
          userId: this.userId
        });
      }
    };
    
    // Handle data channel events
    dataChannel.onopen = () => {
      console.log(`Data channel opened with ${peerId}`);
      this.connectionState = 'connected';
      this.dispatchConnectionEvent('peer-connected', { peerId });
    };
    
    dataChannel.onclose = () => {
      console.log(`Data channel closed with ${peerId}`);
      this.removePeer(peerId);
    };
    
    dataChannel.onmessage = (event) => {
      this.handleDataMessage(peerId, event.data);
    };
    
    connection.ondatachannel = (event) => {
      const channel = event.channel;
      peer.dataChannel = channel;
      
      channel.onopen = () => {
        console.log(`Received data channel from ${peerId}`);
      };
      
      channel.onmessage = (event) => {
        this.handleDataMessage(peerId, event.data);
      };
    };
    
    this.peers.set(peerId, peer);
    return peer;
  }
  
  // Signaling
  sendSignal(targetId, signal) {
    const signalData = {
      ...signal,
      senderId: this.userId,
      targetId: targetId,
      timestamp: Date.now()
    };
    
    localStorage.setItem(
      `cyberpunk-collab-signal-${targetId}-${Date.now()}`,
      JSON.stringify(signalData)
    );
    
    // Clean up old signals
    setTimeout(() => {
      this.cleanupOldSignals();
    }, 5000);
  }
  
  async handleSignal(signal) {
    switch (signal.type) {
      case 'offer':
        await this.handleOffer(signal);
        break;
      case 'answer':
        await this.handleAnswer(signal);
        break;
      case 'ice-candidate':
        await this.handleIceCandidate(signal);
        break;
    }
  }
  
  async handleOffer(signal) {
    const peer = await this.createPeerConnection(signal.userId);
    peer.username = signal.username;
    
    await peer.connection.setRemoteDescription(signal.offer);
    const answer = await peer.connection.createAnswer();
    await peer.connection.setLocalDescription(answer);
    
    this.sendSignal(signal.userId, {
      type: 'answer',
      answer: answer,
      userId: this.userId,
      username: this.username
    });
  }
  
  async handleAnswer(signal) {
    const peer = this.peers.get(signal.userId);
    if (peer) {
      await peer.connection.setRemoteDescription(signal.answer);
    }
  }
  
  async handleIceCandidate(signal) {
    const peer = this.peers.get(signal.userId);
    if (peer) {
      await peer.connection.addIceCandidate(signal.candidate);
    }
  }
  
  // Data Synchronization
  broadcast(type, data) {
    if (this.connectionState !== 'connected' && this.connectionState !== 'hosting') {
      return;
    }
    
    const message = {
      type: 'sync',
      syncType: type,
      data: data,
      userId: this.userId,
      timestamp: Date.now()
    };
    
    // Throttle updates
    const now = Date.now();
    if (now - this.lastSyncTime < this.syncThrottle) {
      this.pendingUpdates.push(message);
      this.schedulePendingSync();
      return;
    }
    
    this.lastSyncTime = now;
    this.sendToAllPeers(message);
  }
  
  sendToAllPeers(message) {
    const messageStr = JSON.stringify(message);
    
    this.peers.forEach((peer) => {
      if (peer.dataChannel && peer.dataChannel.readyState === 'open') {
        try {
          peer.dataChannel.send(messageStr);
        } catch (error) {
          console.error(`Failed to send to peer ${peer.id}:`, error);
        }
      }
    });
  }
  
  handleDataMessage(peerId, data) {
    try {
      const message = JSON.parse(data);
      const peer = this.peers.get(peerId);
      
      if (peer) {
        peer.lastActivity = Date.now();
      }
      
      switch (message.type) {
        case 'sync':
          this.handleSync(message);
          break;
        case 'heartbeat':
          this.handleHeartbeat(peerId, message);
          break;
        case 'request-state':
          this.handleStateRequest(peerId);
          break;
      }
    } catch (error) {
      console.error('Failed to handle data message:', error);
    }
  }
  
  handleSync(message) {
    const handler = this.syncHandlers.get(message.syncType);
    if (handler) {
      handler(message.data);
    }
  }
  
  registerSyncHandler(type, handler) {
    this.syncHandlers.set(type, handler);
  }
  
  // Cursor Tracking
  trackCursor() {
    let lastX = 0;
    let lastY = 0;
    
    document.addEventListener('mousemove', (e) => {
      const x = e.clientX;
      const y = e.clientY;
      
      // Only send if moved significantly
      if (Math.abs(x - lastX) > 5 || Math.abs(y - lastY) > 5) {
        lastX = x;
        lastY = y;
        
        this.broadcast('cursor-move', {
          userId: this.userId,
          position: { x, y },
          username: this.username
        });
      }
    });
  }
  
  updatePeerCursor(userId, position) {
    let cursor = document.getElementById(`peer-cursor-${userId}`);
    
    if (!cursor) {
      cursor = document.createElement('div');
      cursor.id = `peer-cursor-${userId}`;
      cursor.className = 'peer-cursor';
      cursor.innerHTML = `
        <div style="position: fixed; pointer-events: none; z-index: 10000;
                    width: 20px; height: 20px; margin-left: -10px; margin-top: -10px;
                    transition: all 0.1s ease-out;">
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path d="M0,0 L0,16 L4,12 L8,20 L10,19 L6,11 L12,11 Z" 
                  fill="${this.getPeerColor(userId)}" 
                  stroke="#000" 
                  stroke-width="1"/>
          </svg>
          <div style="position: absolute; top: 20px; left: 0; 
                      background: rgba(0,0,0,0.8); color: white; 
                      padding: 2px 6px; border-radius: 3px; 
                      font-size: 11px; white-space: nowrap;">
            ${this.peers.get(userId)?.username || 'Unknown'}
          </div>
        </div>
      `;
      document.body.appendChild(cursor);
    }
    
    const inner = cursor.firstElementChild;
    inner.style.left = `${position.x}px`;
    inner.style.top = `${position.y}px`;
  }
  
  getPeerColor(userId) {
    const colors = ['#ff0080', '#00ff41', '#ffaa00', '#00ffff'];
    const index = Array.from(this.peers.keys()).indexOf(userId);
    return colors[index % colors.length];
  }
  
  // UI Integration
  createCollaborationPanel() {
    return `
      <div class="collaboration-panel" style="padding: 20px;">
        <h3 style="color: var(--primary); margin-bottom: 15px;">Collaboration</h3>
        
        <div class="connection-status" style="margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="status-indicator" style="width: 10px; height: 10px; 
                        border-radius: 50%; background: ${this.getStatusColor()};"></div>
            <span>${this.getStatusText()}</span>
          </div>
        </div>
        
        ${this.connectionState === 'disconnected' ? `
          <div class="connection-actions" style="display: grid; gap: 10px;">
            <button onclick="window.collaborationSystem.createRoom()" 
                    class="cyber-button" style="padding: 10px;">
              Host New Session
            </button>
            <div style="display: flex; gap: 10px;">
              <input type="text" id="room-code-input" placeholder="Enter room code" 
                     class="cyber-input" style="flex: 1; padding: 10px;">
              <button onclick="window.collaborationSystem.joinRoomFromInput()" 
                      class="cyber-button" style="padding: 10px;">
                Join
              </button>
            </div>
          </div>
        ` : ''}
        
        ${this.connectionState === 'hosting' || this.connectionState === 'connected' ? `
          <div class="room-info" style="background: var(--bg-surface); 
                      border: 1px solid var(--border-color); 
                      padding: 15px; border-radius: 4px; margin-bottom: 15px;">
            <div style="font-size: 12px; color: var(--text-secondary);">Room Code</div>
            <div style="font-size: 18px; font-weight: bold; color: var(--primary); 
                        font-family: var(--font-mono);">${this.roomId}</div>
          </div>
          
          <div class="connected-users">
            <h4 style="color: var(--text-secondary); margin-bottom: 10px;">Connected Users</h4>
            <div class="user-list">
              <div class="user-item" style="display: flex; align-items: center; 
                          gap: 10px; padding: 8px; background: var(--bg-tertiary); 
                          border-radius: 4px; margin-bottom: 5px;">
                <div style="width: 8px; height: 8px; border-radius: 50%; 
                            background: var(--success);"></div>
                <span>${this.username} (You)</span>
                ${this.isHost ? '<span style="color: var(--primary); font-size: 11px;">HOST</span>' : ''}
              </div>
              ${Array.from(this.peers.values()).map(peer => `
                <div class="user-item" style="display: flex; align-items: center; 
                            gap: 10px; padding: 8px; background: var(--bg-tertiary); 
                            border-radius: 4px; margin-bottom: 5px;">
                  <div style="width: 8px; height: 8px; border-radius: 50%; 
                              background: ${this.getPeerColor(peer.id)};"></div>
                  <span>${peer.username}</span>
                </div>
              `).join('')}
            </div>
          </div>
          
          <button onclick="window.collaborationSystem.disconnect()" 
                  class="cyber-button" style="width: 100%; padding: 10px; 
                          margin-top: 15px; background: var(--danger);">
            Disconnect
          </button>
        ` : ''}
      </div>
    `;
  }
  
  getStatusColor() {
    switch (this.connectionState) {
      case 'connected':
      case 'hosting':
        return 'var(--success)';
      case 'connecting':
        return 'var(--warning)';
      default:
        return 'var(--error)';
    }
  }
  
  getStatusText() {
    switch (this.connectionState) {
      case 'connected':
        return 'Connected to session';
      case 'hosting':
        return 'Hosting session';
      case 'connecting':
        return 'Connecting...';
      default:
        return 'Not connected';
    }
  }
  
  joinRoomFromInput() {
    const input = document.getElementById('room-code-input');
    if (input && input.value) {
      this.joinRoom(input.value.trim());
    }
  }
  
  disconnect() {
    this.peers.forEach((peer) => {
      peer.connection.close();
    });
    this.peers.clear();
    this.connectionState = 'disconnected';
    this.isHost = false;
    
    // Remove room info if host
    if (this.isHost) {
      localStorage.removeItem(`cyberpunk-collab-room-${this.roomId}`);
    }
    
    this.dispatchConnectionEvent('disconnected');
  }
  
  // Utility Functions
  generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  
  generateUserId() {
    return `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  }
  
  getRoomInfo(roomId) {
    try {
      const info = localStorage.getItem(`cyberpunk-collab-room-${roomId}`);
      return info ? JSON.parse(info) : null;
    } catch {
      return null;
    }
  }
  
  cleanupOldSignals() {
    const now = Date.now();
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith('cyberpunk-collab-signal-')) {
        const parts = key.split('-');
        const timestamp = parseInt(parts[parts.length - 1]);
        
        if (now - timestamp > 10000) { // Remove signals older than 10 seconds
          localStorage.removeItem(key);
        }
      }
    });
  }
  
  schedulePendingSync() {
    if (this.syncTimeout) return;
    
    this.syncTimeout = setTimeout(() => {
      if (this.pendingUpdates.length > 0) {
        this.pendingUpdates.forEach(update => {
          this.sendToAllPeers(update);
        });
        this.pendingUpdates = [];
      }
      this.syncTimeout = null;
    }, this.syncThrottle);
  }
  
  dispatchConnectionEvent(type, detail = {}) {
    document.dispatchEvent(new CustomEvent('collaboration-' + type, { detail }));
  }
  
  removePeer(peerId) {
    const peer = this.peers.get(peerId);
    if (peer) {
      // Remove cursor
      const cursor = document.getElementById(`peer-cursor-${peerId}`);
      if (cursor) {
        cursor.remove();
      }
      
      this.peers.delete(peerId);
      this.dispatchConnectionEvent('peer-disconnected', { peerId });
    }
  }
}

// Initialize global collaboration system
window.collaborationSystem = new CollaborationSystem({
  username: localStorage.getItem('cyberpunk-username') || 'GM ' + Math.floor(Math.random() * 1000)
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CollaborationSystem;
} else {
  window.CollaborationSystem = CollaborationSystem;
}
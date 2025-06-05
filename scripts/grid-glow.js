// Memory-optimized grid glow system
class RandomGridGlow {
  constructor() {
    this.gridContainer = document.getElementById("dynamic-grid");
    this.cells = [];
    this.animationId = null;
    this.lastGlowTime = 0;
    this.glowInterval = 800;
    this.isDestroyed = false;
    this.activeTimeouts = new Set(); // Track timeouts for cleanup

    // Detect mobile and reduce complexity
    this.isMobile = window.innerWidth <= 768 || 
                   /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    this.gridSize = this.isMobile ? 60 : 40;
    // Significantly reduce grid size for performance
    const multiplier = this.isMobile ? 0.8 : 1.2;
    this.cols = Math.ceil((window.innerWidth * multiplier) / this.gridSize);
    this.rows = Math.ceil((window.innerHeight * multiplier) / this.gridSize);
    
    // Limit maximum cells for performance
    const maxCells = this.isMobile ? 200 : 500;
    const totalCells = this.cols * this.rows;
    if (totalCells > maxCells) {
      const ratio = Math.sqrt(maxCells / totalCells);
      this.cols = Math.floor(this.cols * ratio);
      this.rows = Math.floor(this.rows * ratio);
    }

    // Simplified shapes for mobile
    this.shapes = this.isMobile ? {
      circle: [
        [-1, -1], [0, -1], [1, -1],
        [-1, 0], [0, 0], [1, 0],
        [-1, 1], [0, 1], [1, 1]
      ],
      cross: [
        [0, -1],
        [-1, 0], [0, 0], [1, 0],
        [0, 1]
      ]
    } : {
      heart: [
        [-2, -1], [-1, -2], [0, -2], [1, -2], [2, -1],
        [-2, 0], [-1, -1], [0, -1], [1, -1], [2, 0],
        [-1, 0], [0, 0], [1, 0],
        [-1, 1], [0, 1], [1, 1],
        [0, 2]
      ],
      star: [
        [0, -3],
        [-1, -1], [0, -1], [1, -1],
        [-3, 0], [-1, 0], [0, 0], [1, 0], [3, 0],
        [-1, 1], [0, 1], [1, 1],
        [0, 3]
      ],
      diamond: [
        [0, -2],
        [-1, -1], [0, -1], [1, -1],
        [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0],
        [-1, 1], [0, 1], [1, 1],
        [0, 2]
      ]
    };

    this.createGrid();
    this.startVisualization();
    
    // Add cleanup on page unload
    window.addEventListener('beforeunload', () => this.destroy());
    window.addEventListener('pagehide', () => this.destroy());
  }

  createGrid() {
    if (this.isDestroyed) return;
    
    // Clear existing timeouts
    this.activeTimeouts.forEach(timeout => clearTimeout(timeout));
    this.activeTimeouts.clear();
    
    const fragment = document.createDocumentFragment();
    this.gridContainer.innerHTML = "";
    this.cells = [];

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const cell = document.createElement("div");
        cell.className = "grid-cell";
        cell.style.left = `${(col * this.gridSize) - this.gridSize}px`;
        cell.style.top = `${(row * this.gridSize) - this.gridSize}px`;

        fragment.appendChild(cell);
        this.cells.push({
          element: cell,
          x: col,
          y: row,
          intensity: 0,
          lastUpdate: 0,
        });
      }
    }

    this.gridContainer.appendChild(fragment);
  }

  startVisualization() {
    if (this.isDestroyed) return;
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    const animate = () => {
      if (this.isDestroyed) return;
      
      this.updateVisualization();
      this.animationId = requestAnimationFrame(animate);
    };

    animate();
  }

  updateVisualization() {
    if (this.isDestroyed) return;
    
    const currentTime = Date.now();
    
    if (currentTime - this.lastGlowTime > this.glowInterval) {
      this.createRandomGlowingAreas();
      this.lastGlowTime = currentTime;
      this.glowInterval = this.isMobile ? 1000 + Math.random() * 500 : 600 + Math.random() * 400;
    }

    // Batch DOM updates and limit frequency
    if (currentTime % 300 < 50) { // Only update every ~300ms
      this.cells.forEach((cell) => {
        if (currentTime - cell.lastUpdate > 500) {
          cell.element.classList.remove("reactive", "intense");
          cell.intensity = 0;
        }
      });
    }
  }

  createRandomGlowingAreas() {
    if (this.isDestroyed) return;
    
    const currentTime = Date.now();
    const numGlowingAreas = this.isMobile ? 
      Math.floor(Math.random() * 2) + 1 : // 1-2 areas on mobile
      Math.floor(Math.random() * 3) + 2;  // 2-4 areas on desktop

    for (let i = 0; i < numGlowingAreas; i++) {
      const useShape = Math.random() < 0.4;
      
      if (useShape) {
        this.createShapeGlow(currentTime);
      } else {
        this.createCircularGlow(currentTime);
      }
    }
  }

  createShapeGlow(currentTime) {
    if (this.isDestroyed) return;
    
    const shapeNames = Object.keys(this.shapes);
    const shapeName = shapeNames[Math.floor(Math.random() * shapeNames.length)];
    const shapePattern = this.shapes[shapeName];

    const centerRow = Math.floor(Math.random() * this.rows);
    const centerCol = Math.floor(Math.random() * this.cols);
    const baseIntensity = 0.6 + Math.random() * 0.4;

    shapePattern.forEach(([dr, dc]) => {
      const row = centerRow + dr;
      const col = centerCol + dc;

      if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
        const cellIndex = row * this.cols + col;
        const cell = this.cells[cellIndex];

        if (cell && !this.isDestroyed) {
          const distance = Math.sqrt(dr * dr + dc * dc);
          const cellIntensity = Math.max(0.3, baseIntensity - distance * 0.1);

          cell.intensity = cellIntensity;
          cell.lastUpdate = currentTime;
          cell.element.classList.add("reactive");

          if (distance < 1.5 || Math.random() > 0.6) {
            cell.element.classList.add("intense");
          }
        }
      }
    });
  }

  createCircularGlow(currentTime) {
    if (this.isDestroyed) return;
    
    const centerRow = Math.floor(Math.random() * this.rows);
    const centerCol = Math.floor(Math.random() * this.cols);
    const baseIntensity = 0.5 + Math.random() * 0.5;
    const radius = this.isMobile ? 
      Math.floor(Math.random() * 2) + 1 : // Smaller radius on mobile
      Math.floor(Math.random() * 3) + 1;

    for (let dr = -radius; dr <= radius; dr++) {
      for (let dc = -radius; dc <= radius; dc++) {
        const row = centerRow + dr;
        const col = centerCol + dc;

        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
          const cellIndex = row * this.cols + col;
          const cell = this.cells[cellIndex];

          if (cell && !this.isDestroyed) {
            const distance = Math.sqrt(dr * dr + dc * dc);
            const cellIntensity = Math.max(0, baseIntensity - distance * 0.2);

            if (cellIntensity > 0.2) {
              cell.intensity = cellIntensity;
              cell.lastUpdate = currentTime;
              cell.element.classList.add("reactive");

              if (cellIntensity > 0.7 && Math.random() > 0.4) {
                cell.element.classList.add("intense");
              }
            }
          }
        }
      }
    }
  }

  resize() {
    if (this.isDestroyed) return;
    
    // Debounce resize
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    
    this.resizeTimeout = setTimeout(() => {
      const multiplier = this.isMobile ? 0.8 : 1.2;
      this.cols = Math.ceil((window.innerWidth * multiplier) / this.gridSize);
      this.rows = Math.ceil((window.innerHeight * multiplier) / this.gridSize);
      
      // Limit maximum cells
      const maxCells = this.isMobile ? 200 : 500;
      const totalCells = this.cols * this.rows;
      if (totalCells > maxCells) {
        const ratio = Math.sqrt(maxCells / totalCells);
        this.cols = Math.floor(this.cols * ratio);
        this.rows = Math.floor(this.rows * ratio);
      }
      
      this.createGrid();
    }, 250);
  }

  destroy() {
    this.isDestroyed = true;
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    
    // Clear all active timeouts
    this.activeTimeouts.forEach(timeout => clearTimeout(timeout));
    this.activeTimeouts.clear();
    
    // Clear cells array
    this.cells = [];
    
    // Clear DOM
    if (this.gridContainer) {
      this.gridContainer.innerHTML = "";
    }
  }
}

// Initialize with error handling
let gridGlow;
try {
  gridGlow = new RandomGridGlow();
} catch (error) {
  console.error('Grid glow initialization failed:', error);
}

// Handle window resize with debouncing
let resizeTimeout;
window.addEventListener("resize", () => {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  resizeTimeout = setTimeout(() => {
    if (gridGlow && !gridGlow.isDestroyed) {
      gridGlow.resize();
    }
  }, 250);
});

// Handle visibility changes to pause/resume animations
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (gridGlow && gridGlow.animationId) {
      cancelAnimationFrame(gridGlow.animationId);
      gridGlow.animationId = null;
    }
  } else {
    if (gridGlow && !gridGlow.isDestroyed && !gridGlow.animationId) {
      gridGlow.startVisualization();
    }
  }
});

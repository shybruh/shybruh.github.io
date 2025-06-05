// Ultra-optimized grid glow with aggressive memory management
class RandomGridGlow {
  constructor() {
    this.gridContainer = document.getElementById("dynamic-grid");
    this.cells = new Map(); // Use Map for better memory management
    this.animationId = null;
    this.lastGlowTime = 0;
    this.glowInterval = 1000;
    this.isDestroyed = false;
    this.activeTimeouts = new Set();
    this.activeCells = new Set(); // Track only active cells
    this.memoryCleanupInterval = null;

    // Detect mobile and reduce complexity significantly
    this.isMobile = window.innerWidth <= 768 || 
                   /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    this.gridSize = this.isMobile ? 80 : 60; // Larger cells = fewer cells
    
    // Drastically reduce grid size
    const maxWidth = Math.min(window.innerWidth, 1200);
    const maxHeight = Math.min(window.innerHeight, 800);
    
    this.cols = Math.ceil(maxWidth / this.gridSize);
    this.rows = Math.ceil(maxHeight / this.gridSize);
    
    // Hard limit on total cells
    const maxCells = this.isMobile ? 50 : 150;
    const totalCells = this.cols * this.rows;
    if (totalCells > maxCells) {
      const ratio = Math.sqrt(maxCells / totalCells);
      this.cols = Math.floor(this.cols * ratio);
      this.rows = Math.floor(this.rows * ratio);
    }

    // Minimal shapes only
    this.shapes = {
      dot: [[0, 0]],
      line: [[-1, 0], [0, 0], [1, 0]],
      small: [[-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]
    };

    this.createGrid();
    this.startVisualization();
    this.startMemoryCleanup();
    
    // Aggressive cleanup listeners
    window.addEventListener('beforeunload', () => this.destroy());
    window.addEventListener('pagehide', () => this.destroy());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAnimations();
      } else {
        this.resumeAnimations();
      }
    });
  }

  createGrid() {
    if (this.isDestroyed) return;
    
    // Clear everything first
    this.clearAllTimeouts();
    this.cells.clear();
    this.activeCells.clear();
    
    // Use minimal DOM manipulation
    this.gridContainer.innerHTML = "";
    
    // Create cells on-demand instead of pre-creating all
    this.gridContainer.style.width = `${this.cols * this.gridSize}px`;
    this.gridContainer.style.height = `${this.rows * this.gridSize}px`;
  }

  // Create cells only when needed
  getOrCreateCell(row, col) {
    const key = `${row}-${col}`;
    
    if (!this.cells.has(key)) {
      const cell = document.createElement("div");
      cell.className = "grid-cell";
      cell.style.left = `${col * this.gridSize}px`;
      cell.style.top = `${row * this.gridSize}px`;
      cell.style.position = "absolute";
      
      this.gridContainer.appendChild(cell);
      
      const cellData = {
        element: cell,
        x: col,
        y: row,
        intensity: 0,
        lastUpdate: 0,
        key: key
      };
      
      this.cells.set(key, cellData);
      return cellData;
    }
    
    return this.cells.get(key);
  }

  startVisualization() {
    if (this.isDestroyed) return;
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    let frameCount = 0;
    const animate = () => {
      if (this.isDestroyed) return;
      
      frameCount++;
      
      // Only update every 3rd frame for performance
      if (frameCount % 3 === 0) {
        this.updateVisualization();
      }
      
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
      this.glowInterval = this.isMobile ? 2000 + Math.random() * 1000 : 1200 + Math.random() * 800;
    }

    // Clean up inactive cells less frequently
    if (currentTime % 1000 < 50) {
      this.cleanupInactiveCells(currentTime);
    }
  }

  cleanupInactiveCells(currentTime) {
    const cellsToRemove = [];
    
    this.activeCells.forEach(key => {
      const cell = this.cells.get(key);
      if (cell && currentTime - cell.lastUpdate > 2000) {
        cell.element.classList.remove("reactive", "intense");
        cell.intensity = 0;
        cellsToRemove.push(key);
      }
    });
    
    // Remove from active set
    cellsToRemove.forEach(key => {
      this.activeCells.delete(key);
    });
  }

  createRandomGlowingAreas() {
    if (this.isDestroyed) return;
    
    const currentTime = Date.now();
    const numGlowingAreas = this.isMobile ? 1 : Math.floor(Math.random() * 2) + 1;

    for (let i = 0; i < numGlowingAreas; i++) {
      if (Math.random() < 0.7) {
        this.createSimpleGlow(currentTime);
      } else {
        this.createShapeGlow(currentTime);
      }
    }
  }

  createSimpleGlow(currentTime) {
    if (this.isDestroyed) return;
    
    const centerRow = Math.floor(Math.random() * this.rows);
    const centerCol = Math.floor(Math.random() * this.cols);
    const radius = this.isMobile ? 1 : 2;

    for (let dr = -radius; dr <= radius; dr++) {
      for (let dc = -radius; dc <= radius; dc++) {
        const row = centerRow + dr;
        const col = centerCol + dc;

        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
          const cell = this.getOrCreateCell(row, col);
          
          if (cell && !this.isDestroyed) {
            const distance = Math.sqrt(dr * dr + dc * dc);
            if (distance <= radius) {
              cell.intensity = Math.max(0.3, 0.8 - distance * 0.3);
              cell.lastUpdate = currentTime;
              cell.element.classList.add("reactive");
              this.activeCells.add(cell.key);
              
              if (distance < 1) {
                cell.element.classList.add("intense");
              }
            }
          }
        }
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

    shapePattern.forEach(([dr, dc]) => {
      const row = centerRow + dr;
      const col = centerCol + dc;

      if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
        const cell = this.getOrCreateCell(row, col);

        if (cell && !this.isDestroyed) {
          cell.intensity = 0.7;
          cell.lastUpdate = currentTime;
          cell.element.classList.add("reactive", "intense");
          this.activeCells.add(cell.key);
        }
      }
    });
  }

  startMemoryCleanup() {
    // Aggressive memory cleanup every 5 seconds
    this.memoryCleanupInterval = setInterval(() => {
      if (this.isDestroyed) return;
      
      this.performMemoryCleanup();
    }, 5000);
  }

  performMemoryCleanup() {
    const currentTime = Date.now();
    const cellsToDelete = [];
    
    // Remove unused cells from DOM and memory
    this.cells.forEach((cell, key) => {
      if (currentTime - cell.lastUpdate > 5000 && !this.activeCells.has(key)) {
        if (cell.element && cell.element.parentNode) {
          cell.element.parentNode.removeChild(cell.element);
        }
        cellsToDelete.push(key);
      }
    });
    
    // Remove from Map
    cellsToDelete.forEach(key => {
      this.cells.delete(key);
    });
    
    // Force garbage collection hint (if available)
    if (window.gc) {
      window.gc();
    }
    
    console.log(`Memory cleanup: ${cellsToDelete.length} cells removed, ${this.cells.size} cells remaining`);
  }

  pauseAnimations() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  resumeAnimations() {
    if (!this.animationId && !this.isDestroyed) {
      this.startVisualization();
    }
  }

  clearAllTimeouts() {
    this.activeTimeouts.forEach(timeout => clearTimeout(timeout));
    this.activeTimeouts.clear();
  }

  resize() {
    if (this.isDestroyed) return;
    
    // Debounce resize with cleanup
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    
    this.resizeTimeout = setTimeout(() => {
      // Destroy everything and recreate
      this.pauseAnimations();
      this.performMemoryCleanup();
      
      // Recalculate dimensions
      const maxWidth = Math.min(window.innerWidth, 1200);
      const maxHeight = Math.min(window.innerHeight, 800);
      
      this.cols = Math.ceil(maxWidth / this.gridSize);
      this.rows = Math.ceil(maxHeight / this.gridSize);
      
      const maxCells = this.isMobile ? 50 : 150;
      const totalCells = this.cols * this.rows;
      if (totalCells > maxCells) {
        const ratio = Math.sqrt(maxCells / totalCells);
        this.cols = Math.floor(this.cols * ratio);
        this.rows = Math.floor(this.rows * ratio);
      }
      
      this.createGrid();
      this.resumeAnimations();
    }, 500);
  }

  destroy() {
    this.isDestroyed = true;
    
    this.pauseAnimations();
    this.clearAllTimeouts();
    
    if (this.memoryCleanupInterval) {
      clearInterval(this.memoryCleanupInterval);
      this.memoryCleanupInterval = null;
    }
    
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    
    // Clear all cells from DOM
    this.cells.forEach(cell => {
      if (cell.element && cell.element.parentNode) {
        cell.element.parentNode.removeChild(cell.element);
      }
    });
    
    // Clear all data structures
    this.cells.clear();
    this.activeCells.clear();
    
    // Clear DOM
    if (this.gridContainer) {
      this.gridContainer.innerHTML = "";
    }
    
    // Nullify references
    this.gridContainer = null;
    this.cells = null;
    this.activeCells = null;
    this.shapes = null;
  }
}

// Initialize with better error handling and memory monitoring
let gridGlow;

function initializeGridGlow() {
  try {
    if (gridGlow) {
      gridGlow.destroy();
    }
    gridGlow = new RandomGridGlow();
  } catch (error) {
    console.error('Grid glow initialization failed:', error);
    // Fallback: disable grid effects
    const gridContainer = document.getElementById("dynamic-grid");
    if (gridContainer) {
      gridContainer.style.display = 'none';
    }
  }
}

// Memory monitoring (development only)
function monitorMemory() {
  if (performance.memory) {
    console.log('Memory usage:', {
      used: Math.round(performance.memory.usedJSHeapSize / 1048576) + ' MB',
      total: Math.round(performance.memory.totalJSHeapSize / 1048576) + ' MB',
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) + ' MB'
    });
  }
}

// Initialize
initializeGridGlow();

// Monitor memory every 10 seconds (remove in production)
setInterval(monitorMemory, 10000);

// Handle window resize with aggressive cleanup
let resizeTimeout;
window.addEventListener("resize", () => {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  resizeTimeout = setTimeout(() => {
    if (gridGlow && !gridGlow.isDestroyed) {
      gridGlow.resize();
    }
  }, 500);
});

// Page visibility handling
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (gridGlow) {
      gridGlow.pauseAnimations();
    }
  } else {
    if (gridGlow && !gridGlow.isDestroyed) {
      gridGlow.resumeAnimations();
    }
  }
});

// Emergency cleanup on high memory usage
if (performance.memory) {
  setInterval(() => {
    const memoryUsage = performance.memory.usedJSHeapSize / 1048576; // MB
    if (memoryUsage > 100) { // If over 100MB
      console.warn('High memory usage detected, performing emergency cleanup');
      if (gridGlow) {
        gridGlow.performMemoryCleanup();
      }
    }
  }, 5000);
}

// Music-reactive grid system (simplified version without Web Audio API)
class MusicReactiveGrid {
  constructor() {
    this.gridContainer = document.getElementById("dynamic-grid");
    this.cells = [];
    this.animationId = null;
    this.lastBeatTime = 0;
    this.beatInterval = 500; // Default beat interval in ms

    this.gridSize = 40; // Match CSS grid size
    this.cols = Math.ceil((window.innerWidth * 2) / this.gridSize);
    this.rows = Math.ceil((window.innerHeight * 2) / this.gridSize);

    this.createGrid();
    this.startVisualization();
  }

  createGrid() {
    // Clear existing grid
    this.gridContainer.innerHTML = "";
    this.cells = [];

    // Create grid cells
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const cell = document.createElement("div");
        cell.className = "grid-cell";
        cell.style.left = `${col * this.gridSize}px`;
        cell.style.top = `${row * this.gridSize}px`;

        // Add grid lines
        if (row === 0 || col === 0) {
          cell.style.borderTop = "1px solid #191919";
          cell.style.borderLeft = "1px solid #191919";
        }

        this.gridContainer.appendChild(cell);
        this.cells.push({
          element: cell,
          x: col,
          y: row,
          intensity: 0,
          lastUpdate: 0,
        });
      }
    }

    // Add the moving grid background
    this.gridContainer.style.backgroundImage =
      "linear-gradient(#191919 1px, transparent 1px), linear-gradient(90deg, #191919 1px, transparent 1px)";
    this.gridContainer.style.backgroundSize = "40px 40px";
    this.gridContainer.style.animation = "moveGrid 10s linear infinite";
  }

  startVisualization() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    const animate = () => {
      if (!audio.paused) {
        this.updateVisualization();
      } else {
        // Clear all effects when paused
        this.clearAllEffects();
      }
      this.animationId = requestAnimationFrame(animate);
    };

    animate();
  }

  updateVisualization() {
    const currentTime = Date.now();
    
    // Create beat-based effects
    if (currentTime - this.lastBeatTime > this.beatInterval) {
      this.createRandomGlowingAreas();
      this.lastBeatTime = currentTime;
      
      // Vary the beat interval slightly for more natural feel
      this.beatInterval = 300 + Math.random() * 400; // 300-700ms
    }

    // Reset old cells
    this.cells.forEach((cell) => {
      if (currentTime - cell.lastUpdate > 200) {
        cell.element.classList.remove("reactive", "intense");
        cell.intensity = 0;
      }
    });
  }

  createRandomGlowingAreas() {
    const currentTime = Date.now();
    
    // Number of glowing areas (4-10 areas)
    const numGlowingAreas = Math.floor(Math.random() * 7) + 4;

    // Create random glowing areas
    for (let i = 0; i < numGlowingAreas; i++) {
      // Pick completely random positions
      const centerRow = Math.floor(Math.random() * this.rows);
      const centerCol = Math.floor(Math.random() * this.cols);
      
      // Random intensity
      const baseIntensity = 0.5 + Math.random() * 0.5;
      
      // Random radius for each glowing area (1-3 cells)
      const radius = Math.floor(Math.random() * 3) + 1;

      // Create glowing area around the random center point
      for (let dr = -radius; dr <= radius; dr++) {
        for (let dc = -radius; dc <= radius; dc++) {
          const row = centerRow + dr;
          const col = centerCol + dc;

          if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            const cellIndex = row * this.cols + col;
            const cell = this.cells[cellIndex];

            if (cell) {
              const distance = Math.sqrt(dr * dr + dc * dc);
              const cellIntensity = Math.max(0, baseIntensity - distance * 0.2);

              if (cellIntensity > 0.2) {
                cell.intensity = cellIntensity;
                cell.lastUpdate = currentTime;

                cell.element.classList.add("reactive");

                // Make some cells more intense randomly
                if (cellIntensity > 0.7 && Math.random() > 0.4) {
                  cell.element.classList.add("intense");
                } else {
                  cell.element.classList.remove("intense");
                }
              }
            }
          }
        }
      }
    }
  }

  clearAllEffects() {
    this.cells.forEach((cell) => {
      cell.element.classList.remove("reactive", "intense");
      cell.intensity = 0;
    });
  }

  // Handle window resize
  resize() {
    this.cols = Math.ceil((window.innerWidth * 2) / this.gridSize);
    this.rows = Math.ceil((window.innerHeight * 2) / this.gridSize);
    this.createGrid();
  }
}

// Initialize the music-reactive grid
const musicGrid = new MusicReactiveGrid();

// Handle window resize
window.addEventListener("resize", () => {
  musicGrid.resize();
});
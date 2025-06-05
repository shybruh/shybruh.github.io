// Optimized grid glow system
class RandomGridGlow {
  constructor() {
    this.gridContainer = document.getElementById("dynamic-grid");
    this.cells = [];
    this.animationId = null;
    this.lastGlowTime = 0;
    this.glowInterval = 500;

    this.gridSize = 40;
    // Drastically reduce grid coverage for performance
    this.cols = Math.ceil((window.innerWidth * 1.5) / this.gridSize);
    this.rows = Math.ceil((window.innerHeight * 1.5) / this.gridSize);

    // Define shape patterns (keep existing shapes)
    this.shapes = {
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
      ],
      cross: [
        [0, -2], [0, -1],
        [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0],
        [0, 1], [0, 2]
      ],
      circle: [
        [-1, -2], [0, -2], [1, -2],
        [-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1],
        [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0],
        [-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1],
        [-1, 2], [0, 2], [1, 2]
      ]
    };

    this.createGrid();
    this.startVisualization();
  }

  createGrid() {
    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    this.gridContainer.innerHTML = "";
    this.cells = [];

    // Create fewer cells
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

    // Reduce container size
    this.gridContainer.style.width = "200%";
    this.gridContainer.style.height = "200%";
    this.gridContainer.style.left = "-25%";
    this.gridContainer.style.top = "-25%";

    this.gridContainer.style.backgroundImage =
      "linear-gradient(#191919 1px, transparent 1px), linear-gradient(90deg, #191919 1px, transparent 1px)";
    this.gridContainer.style.backgroundSize = "40px 40px";
    this.gridContainer.style.animation = "moveGrid 20s linear infinite";
  }

  startVisualization() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    const animate = () => {
      this.updateVisualization();
      this.animationId = requestAnimationFrame(animate);
    };

    animate();
  }

  updateVisualization() {
    const currentTime = Date.now();
    
    if (currentTime - this.lastGlowTime > this.glowInterval) {
      this.createRandomGlowingAreas();
      this.lastGlowTime = currentTime;
      this.glowInterval = 400 + Math.random() * 300; // Slightly faster interval
    }

    // Batch DOM updates
    this.cells.forEach((cell) => {
      if (currentTime - cell.lastUpdate > 200) {
        cell.element.classList.remove("reactive", "intense");
        cell.intensity = 0;
      }
    });
  }

  createRandomGlowingAreas() {
    const currentTime = Date.now();
    // Reduce number of glowing areas
    const numGlowingAreas = Math.floor(Math.random() * 4) + 2; // 2-5 areas

    for (let i = 0; i < numGlowingAreas; i++) {
      const useShape = Math.random() < 0.3;
      
      if (useShape) {
        this.createShapeGlow(currentTime);
      } else {
        this.createCircularGlow(currentTime);
      }
    }
  }

  createShapeGlow(currentTime) {
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

        if (cell) {
          const distance = Math.sqrt(dr * dr + dc * dc);
          const cellIntensity = Math.max(0.3, baseIntensity - distance * 0.1);

          cell.intensity = cellIntensity;
          cell.lastUpdate = currentTime;
          cell.element.classList.add("reactive");

          if (distance < 1.5 || Math.random() > 0.6) {
            cell.element.classList.add("intense");
          } else {
            cell.element.classList.remove("intense");
          }
        }
      }
    });
  }

  createCircularGlow(currentTime) {
    const centerRow = Math.floor(Math.random() * this.rows);
    const centerCol = Math.floor(Math.random() * this.cols);
    const baseIntensity = 0.5 + Math.random() * 0.5;
    const radius = Math.floor(Math.random() * 3) + 1;

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

  addShape(name, pattern) {
    this.shapes[name] = pattern;
  }

  resize() {
    this.cols = Math.ceil((window.innerWidth * 1.5) / this.gridSize);
    this.rows = Math.ceil((window.innerHeight * 1.5) / this.gridSize);
    this.createGrid();
  }
}

// Initialize the grid glow
const gridGlow = new RandomGridGlow();

// Add custom shape
gridGlow.addShape('arrow', [
  [0, -2],
  [-1, -1], [0, -1], [1, -1],
  [0, 0], [0, 1], [0, 2]
]);

// Handle window resize
window.addEventListener("resize", () => {
  gridGlow.resize();
});

// Random grid glow system with shapes
class RandomGridGlow {
  constructor() {
    this.gridContainer = document.getElementById("dynamic-grid");
    this.cells = [];
    this.animationId = null;
    this.lastGlowTime = 0;
    this.glowInterval = 500; // Default glow interval in ms

    this.gridSize = 40; // Match CSS grid size
    // Increase grid coverage to ensure full background coverage
    this.cols = Math.ceil((window.innerWidth * 3) / this.gridSize);
    this.rows = Math.ceil((window.innerHeight * 3) / this.gridSize);

    // Define shape patterns
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
        [0, -2],
        [0, -1],
        [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0],
        [0, 1],
        [0, 2]
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
    // Clear existing grid
    this.gridContainer.innerHTML = "";
    this.cells = [];

    // Create grid cells with proper positioning
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const cell = document.createElement("div");
        cell.className = "grid-cell";
        // Position cells to start from negative coordinates to cover entire screen
        cell.style.left = `${(col * this.gridSize) - this.gridSize}px`;
        cell.style.top = `${(row * this.gridSize) - this.gridSize}px`;

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

    // Ensure the grid container covers everything
    this.gridContainer.style.width = "300%";
    this.gridContainer.style.height = "300%";
    this.gridContainer.style.left = "-50%";
    this.gridContainer.style.top = "-50%";

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
      this.updateVisualization();
      this.animationId = requestAnimationFrame(animate);
    };

    animate();
  }

  updateVisualization() {
    const currentTime = Date.now();
    
    // Create random glow effects
    if (currentTime - this.lastGlowTime > this.glowInterval) {
      this.createRandomGlowingAreas();
      this.lastGlowTime = currentTime;
      
      // Vary the glow interval for more natural feel
      this.glowInterval = 300 + Math.random() * 400; // 300-700ms
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
    
    // Number of glowing areas (3-8 areas, reduced to accommodate larger shapes)
    const numGlowingAreas = Math.floor(Math.random() * 6) + 3;

    // Create random glowing areas
    for (let i = 0; i < numGlowingAreas; i++) {
      // 30% chance for shapes, 70% chance for regular circular glows
      const useShape = Math.random() < 0.3;
      
      if (useShape) {
        this.createShapeGlow(currentTime);
      } else {
        this.createCircularGlow(currentTime);
      }
    }
  }

  createShapeGlow(currentTime) {
    // Pick a random shape
    const shapeNames = Object.keys(this.shapes);
    const shapeName = shapeNames[Math.floor(Math.random() * shapeNames.length)];
    const shapePattern = this.shapes[shapeName];

    // Pick random center position
    const centerRow = Math.floor(Math.random() * this.rows);
    const centerCol = Math.floor(Math.random() * this.cols);

    // Random intensity
    const baseIntensity = 0.6 + Math.random() * 0.4;

    // Apply the shape pattern
    shapePattern.forEach(([dr, dc]) => {
      const row = centerRow + dr;
      const col = centerCol + dc;

      if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
        const cellIndex = row * this.cols + col;
        const cell = this.cells[cellIndex];

        if (cell) {
          // Center cells get full intensity, edge cells get slightly less
          const distance = Math.sqrt(dr * dr + dc * dc);
          const cellIntensity = Math.max(0.3, baseIntensity - distance * 0.1);

          cell.intensity = cellIntensity;
          cell.lastUpdate = currentTime;
          cell.element.classList.add("reactive");

          // Make center and some random cells more intense
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
    // Pick random position
    const centerRow = Math.floor(Math.random() * this.rows);
    const centerCol = Math.floor(Math.random() * this.cols);
    
    // Random intensity
    const baseIntensity = 0.5 + Math.random() * 0.5;
    
    // Random radius (1-3 cells)
    const radius = Math.floor(Math.random() * 3) + 1;

    // Create glowing area around the center point
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

  // Add a new shape to the collection
  addShape(name, pattern) {
    this.shapes[name] = pattern;
  }

  // Handle window resize
  resize() {
    this.cols = Math.ceil((window.innerWidth * 3) / this.gridSize);
    this.rows = Math.ceil((window.innerHeight * 3) / this.gridSize);
    this.createGrid();
  }
}

// Initialize the random grid glow
const gridGlow = new RandomGridGlow();

// Example of adding a custom shape (arrow pointing up)
gridGlow.addShape('arrow', [
  [0, -2],
  [-1, -1], [0, -1], [1, -1],
  [0, 0],
  [0, 1],
  [0, 2]
]);

// Handle window resize
window.addEventListener("resize", () => {
  gridGlow.resize();
});

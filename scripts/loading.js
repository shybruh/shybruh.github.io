// Optimized loading animation controller
class LoadingAnimations {
  constructor() {
    this.init();
  }

  init() {
    document.body.style.opacity = '0';
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.startAnimations();
      });
    } else {
      this.startAnimations();
    }
  }

  startAnimations() {
    document.body.style.animation = 'fadeInBody 1.5s ease-out forwards';
    
    // Reduce delay and optimize grid cell animations
    setTimeout(() => {
      this.animateGridCells();
    }, 3000);

    this.addEntranceEffects();
  }

  animateGridCells() {
    const cells = document.querySelectorAll('.grid-cell');
    // Animate in smaller batches for better performance
    const batchSize = 50;
    let currentBatch = 0;

    const animateBatch = () => {
      const start = currentBatch * batchSize;
      const end = Math.min(start + batchSize, cells.length);
      
      for (let i = start; i < end; i++) {
        const delay = Math.random() * 1000;
        setTimeout(() => {
          cells[i].style.animation = 'fadeInCell 0.5s ease-out forwards';
        }, delay);
      }
      
      currentBatch++;
      if (currentBatch * batchSize < cells.length) {
        setTimeout(animateBatch, 200);
      }
    };

    animateBatch();
  }

  addEntranceEffects() {
    setTimeout(() => {
      const logo = document.querySelector('.main img');
      if (logo) {
        logo.addEventListener('mouseenter', () => {
          logo.style.filter = 'drop-shadow(0 0 15px #ff66cc) drop-shadow(0 0 30px #ff33aa) drop-shadow(0 0 45px #cc0099)';
          logo.style.transform = 'translateY(0px) scale(1.05)';
        });
        
        logo.addEventListener('mouseleave', () => {
          logo.style.filter = '';
          logo.style.transform = 'translateY(0px) scale(1)';
        });
      }
    }, 3000);
  }
}

new LoadingAnimations();

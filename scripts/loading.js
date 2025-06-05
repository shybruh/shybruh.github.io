// Simplified loading animations
class LoadingAnimations {
  constructor() {
    this.timeouts = new Set();
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
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => this.destroy());
  }

  startAnimations() {
    document.body.style.animation = 'fadeInBody 1.5s ease-out forwards';
    
    // Simplified grid cell animation
    const timeout1 = setTimeout(() => {
      this.animateGridCells();
    }, 2000); // Reduced delay
    
    this.timeouts.add(timeout1);
    this.addEntranceEffects();
  }

  animateGridCells() {
    const cells = document.querySelectorAll('.grid-cell');
    const isMobile = window.innerWidth <= 768;
    
    // Animate fewer cells on mobile
    const step = isMobile ? 4 : 2;
    
    cells.forEach((cell, index) => {
      if (index % step === 0) { // Skip some cells for performance
        const delay = Math.random() * 500; // Reduced delay range
        const timeout = setTimeout(() => {
          if (cell) {
            cell.style.animation = 'fadeInCell 0.3s ease-out forwards';
          }
        }, delay);
        this.timeouts.add(timeout);
      }
    });
  }

  addEntranceEffects() {
    const timeout = setTimeout(() => {
      const logo = document.querySelector('.main img');
      if (logo) {
        // Use passive event listeners
        logo.addEventListener('mouseenter', this.handleLogoHover, { passive: true });
        logo.addEventListener('mouseleave', this.handleLogoLeave, { passive: true });
      }
    }, 2000);
    
    this.timeouts.add(timeout);
  }
  
  handleLogoHover(e) {
    e.target.style.filter = 'drop-shadow(0 0 15px #ff66cc) drop-shadow(0 0 30px #ff33aa) drop-shadow(0 0 45px #cc0099)';
    e.target.style.transform = 'translateY(0px) scale(1.05)';
  }
  
  handleLogoLeave(e) {
    e.target.style.filter = '';
    e.target.style.transform = 'translateY(0px) scale(1)';
  }
  
  destroy() {
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();
  }
}

new LoadingAnimations();

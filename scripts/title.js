// Memory-optimized title animation
class TitleAnimator {
  constructor() {
    this.speed = 300; // Slower for better performance
    this.ends = ["$", "\\", "|", "/", "!"];
    this.intervalId = null;
    this.isDestroyed = false;
    
    this.init();
  }
  
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      this.start();
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => this.destroy());
    window.addEventListener('pagehide', () => this.destroy());
  }
  
  start() {
    if (this.isDestroyed) return;
    
    const title = document.title;
    const titles = [];

    // Pre-generate all title variations
    for (let i = 0; i < title.length + 1; i++) {
      for (let v = 0; v < this.ends.length; v++) {
        titles.push(title.substring(0, i) + this.ends[v]);
      }
    }

    let k = 0;
    this.intervalId = setInterval(() => {
      if (this.isDestroyed) {
        this.destroy();
        return;
      }
      
      document.title = titles[k];
      k = (k + 1) % titles.length;
    }, this.speed);
  }
  
  destroy() {
    this.isDestroyed = true;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

// Initialize title animator
const titleAnimator = new TitleAnimator();

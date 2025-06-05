// Optimized parallax effect
class ParallaxController {
  constructor() {
    this.wrapper = document.querySelector('.grid-wrapper');
    this.isEnabled = !this.isMobile();
    this.rafId = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.currentX = 0;
    this.currentY = 0;
    
    if (this.isEnabled && this.wrapper) {
      this.init();
    }
  }
  
  isMobile() {
    return window.innerWidth <= 768 || 
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  init() {
    // Use throttled mouse move
    let throttleTimeout;
    document.addEventListener('mousemove', (e) => {
      if (throttleTimeout) return;
      
      throttleTimeout = setTimeout(() => {
        this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        throttleTimeout = null;
      }, 16); // ~60fps
    });
    
    document.addEventListener('mouseleave', () => {
      this.mouseX = 0;
      this.mouseY = 0;
    });
    
    this.animate();
  }
  
  animate() {
    if (!this.isEnabled || !this.wrapper) return;
    
    // Smooth interpolation
    this.currentX += (this.mouseX - this.currentX) * 0.1;
    this.currentY += (this.mouseY - this.currentY) * 0.1;
    
    const gridMoveX = this.currentX * 20; // Reduced movement
    const gridMoveY = this.currentY * 20;
    
    this.wrapper.style.transform = `translate(${gridMoveX}px, ${gridMoveY}px)`;
    
    this.rafId = requestAnimationFrame(() => this.animate());
  }
  
  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    if (this.wrapper) {
      this.wrapper.style.transform = 'translate(0px, 0px)';
    }
  }
}

// Initialize parallax
const parallaxController = new ParallaxController();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (parallaxController) {
    parallaxController.destroy();
  }
});

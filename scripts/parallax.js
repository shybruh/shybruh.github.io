// Multi-layer parallax effect
const wrapper = document.querySelector('.grid-wrapper');
const logo = document.querySelector('.main img');
const mainContent = document.querySelector('.main');

document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;
  
  // Grid parallax (background layer - most movement)
  const gridMoveX = x * 30;
  const gridMoveY = y * 30;
  wrapper.style.transform = `translate(${gridMoveX}px, ${gridMoveY}px)`;
  
  // Logo parallax (middle layer - medium movement)
  const logoMoveX = x * 20;
  const logoMoveY = y * 20;
  logo.style.transform = `translate(${logoMoveX}px, ${logoMoveY}px)`;
  
  // Text links parallax (foreground layer - least movement)
  const textMoveX = x * 10;
  const textMoveY = y * 10;
  const links = mainContent.querySelector('ul');
  if (links) {
    links.style.transform = `translate(${textMoveX}px, ${textMoveY}px)`;
  }
});

// Parallax effect for grid
const wrapper = document.querySelector('.grid-wrapper');
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;
  const moveX = x * 30;
  const moveY = y * 30;
  wrapper.style.transform = `translate(${moveX}px, ${moveY}px)`;
});
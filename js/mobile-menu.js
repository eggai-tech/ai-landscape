// Simple mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
  // Toggle menu when burger is clicked
  const toggleMobileMenu = function() {
    const mainNav = document.getElementById('main-nav');
    if (mainNav) {
      mainNav.classList.toggle('active');
    }
  };
  
  // Setup direct burger menu
  const directBurger = document.getElementById('direct-burger');
  if (directBurger) {
    directBurger.addEventListener('click', toggleMobileMenu);
  }
  
  // Setup main burger menu as fallback
  const mainBurger = document.getElementById('burger-menu');
  if (mainBurger) {
    mainBurger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleMobileMenu();
      mainBurger.classList.toggle('active');
    });
  }
});

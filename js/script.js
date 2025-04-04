document.addEventListener('DOMContentLoaded', function() {
  // Set current year in the footer
  document.getElementById('current-year').textContent = new Date().getFullYear();
  
  // Layer filtering
  const buttons = document.querySelectorAll('.button-group button');
  const layers = document.querySelectorAll('.layer-container');
  
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      buttons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      const layerId = button.getAttribute('data-layer');
      
      // Show all layers or filter based on selection
      if (layerId === 'all') {
        layers.forEach(layer => {
          layer.style.display = 'block';
        });
      } else {
        layers.forEach(layer => {
          if (layer.getAttribute('data-layer') === layerId) {
            layer.style.display = 'block';
          } else {
            layer.style.display = 'none';
          }
        });
      }
    });
  });
  
  // Commenting out this section as it's now handled in the inline script
  // This prevents duplicate event listeners from being attached
  /*
  // Collapsible sections
  const layerHeaders = document.querySelectorAll('.layer-header');
  
  layerHeaders.forEach(header => {
    header.addEventListener('click', function() {
      // Toggle active class on the header
      this.classList.toggle('active');
      
      // Get the content element and collapse icon
      const content = this.nextElementSibling;
      const icon = this.querySelector('.collapse-icon');
      
      // Toggle visibility
      if (content.style.display === 'none' || content.classList.contains('collapsed')) {
        content.style.display = 'block';
        content.classList.remove('collapsed');
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        content.style.display = 'none';
        content.classList.add('collapsed');
        if (icon) icon.style.transform = 'rotate(-90deg)';
      }
    });
  });
  */
  
  // Tooltip functionality
  const tooltip = document.getElementById('tooltip');
  const techCards = document.querySelectorAll('.tech-card[data-tooltip]');
  
  techCards.forEach(card => {
    card.addEventListener('mouseenter', e => {
      const tooltipText = card.getAttribute('data-tooltip');
      
      if (tooltipText) {
        tooltip.textContent = tooltipText;
        tooltip.style.opacity = '1';
        
        // Position the tooltip
        const rect = card.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + window.scrollY + 'px';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });
  });
});
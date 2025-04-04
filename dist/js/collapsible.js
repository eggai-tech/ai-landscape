// Add collapsible functionality to your categories
document.addEventListener('DOMContentLoaded', function() {
  // This function can be used to initialize or reinitialize collapsible functionality
  function initCollapsible() {
    // Find all elements with category-header class that should be clickable
    const categoryHeaders = document.querySelectorAll('.category-header');
    
    categoryHeaders.forEach(header => {
      // Remove existing event listeners (to prevent duplicates on reinitialization)
      const headerClone = header.cloneNode(true);
      header.parentNode.replaceChild(headerClone, header);
      
      // Add the new event listener
      headerClone.addEventListener('click', () => {
        // Toggle active class on the header
        headerClone.classList.toggle('active');
        
        // Find the content element that should be collapsed/expanded
        const content = headerClone.nextElementSibling;
        
        // Toggle collapsed class on the content
        if (content && content.classList.contains('category-content')) {
          content.classList.toggle('collapsed');
        }
      });
    });
    
    // Also initialize for elements with the category-title class
    // (useful for elements that don't have the header/content structure)
    const categoryTitles = document.querySelectorAll('.category-title');
    
    categoryTitles.forEach(title => {
      // Remove existing event listeners
      const titleClone = title.cloneNode(true);
      title.parentNode.replaceChild(titleClone, title);
      
      // Add the new event listener
      titleClone.addEventListener('click', (e) => {
        // Prevent the event from bubbling up
        e.stopPropagation();
        
        // Find the parent category element
        const category = titleClone.closest('.category');
        
        if (category) {
          // Toggle collapsed class on the parent
          category.classList.toggle('collapsed');
        }
      });
    });
  }
  
  // Run initialization when the page loads
  initCollapsible();
  
  // Make the function available globally in case other scripts need to initialize
  // collapsible components after dynamic content loading
  window.initCollapsible = initCollapsible;
});
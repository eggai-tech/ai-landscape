// Build script to generate the AI landscape HTML page from JSON data
const fs = require('fs');
const path = require('path');

// Read the landscape data
const landscapeData = JSON.parse(fs.readFileSync(path.join(__dirname, 'landscape-data.json'), 'utf8'));

// Function to generate a simple SVG logo based on color
function generateLogoSvg(color) {
  return `<svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="4" fill="${color}"/>
    <path d="M16 8L24 16L16 24L8 16L16 8Z" fill="white"/>
  </svg>`;
}

// Generate the category buttons HTML
function generateCategoryButtons() {
  let html = '<div class="tag-filters">\n';
  html += '  <button class="tag-filter active" data-category="all">All Categories</button>\n';
  
  landscapeData.categories.forEach(category => {
    html += `  <button class="tag-filter" data-category="${category.id}" style="border-color: ${category.color};" title="${category.description}\n\nExamples: ${category.examples}">${category.name}</button>\n`;
  });
  
  html += '</div>\n';
  return html;
}

// Generate technology card HTML with category grouping
function generateTechCards() {
  // Group technologies by category
  const techsByCategory = {};
  
  // Initialize all categories first
  landscapeData.categories.forEach(category => {
    techsByCategory[category.id] = {
      name: category.name,
      description: category.description,
      color: category.color,
      technologies: []
    };
  });
  
  // Assign technologies to their categories
  landscapeData.technologies.forEach(tech => {
    tech.categories.forEach(catId => {
      if (techsByCategory[catId]) {
        techsByCategory[catId].technologies.push(tech);
      }
    });
  });
  
  // Generate HTML for grouped technologies
  let html = '<div class="layers-container">\n';
  
  // Define the order of categories from bottom (infrastructure) to top (applications) with cross-cutting concerns at the end
  const categoryOrder = [
    'infrastructure', 
    'datalayer', 
    'featurestore', 
    'modeldevelopment', 
    'mlops', 
    'modelserving', 
    'llmops',
    'applications', 
    'monitoring', 
    'security'
  ];
  
  // Generate HTML for each category in order
  categoryOrder.forEach(catId => {
    const category = techsByCategory[catId];
    if (!category || category.technologies.length === 0) return;
    
    html += `<div class="layer-container" data-layer="${catId}">\n`;
    html += `  <div class="layer-header layer-header-clickable" style="background-color: ${category.color};">\n`;
    html += '    <div class="layer-header-top">\n';
    html += `      <h2 class="layer-title">${category.name}</h2>\n`;
    html += '      <span class="collapse-icon">▼</span>\n';
    html += '    </div>\n';
    html += `    <p class="layer-description">${category.description}</p>\n`;
    html += '  </div>\n';
    html += '  <div class="layer-content collapsed">\n';
    html += '    <div class="category-tech-grid">\n';
    
    // Generate cards for technologies in this category
    category.technologies.forEach(tech => {
      const categoriesAttr = tech.categories.join(' ');
      
      html += `      <!-- ${tech.name} -->\n`;
      html += `      <div class="tech-card" data-categories="${categoriesAttr}">\n`;
      html += '        <div class="tech-header">\n';
      html += '          <div class="tech-meta">\n';
      html += `            <div class="tech-name">${tech.name}</div>\n`;
      html += `            <div class="tech-description" title="${tech.longDescription || ''}">${tech.description}</div>\n`;
      html += '          </div>\n';
      html += '          <div class="tech-logo">\n';
      html += `            ${generateLogoSvg(tech.logoColor)}\n`;
      html += '          </div>\n';
      html += '        </div>\n';
      html += '        <div class="tech-body">\n';
      html += '          <div class="tech-tags">\n';
      
      tech.categories.forEach(techCatId => {
        const techCategory = landscapeData.categories.find(cat => cat.id === techCatId);
        html += `            <span class="tech-tag ${techCatId}" data-category="${techCatId}" style="background-color: ${techCategory.color}20; color: ${techCategory.color};" title="${techCategory.description}">${techCategory.name}</span>\n`;
      });
      
      html += '          </div>\n';
      html += '          <div class="tech-links">\n';
      
      if (tech.links.website) {
        html += `            <a href="${tech.links.website}" target="_blank" rel="noopener noreferrer" class="tech-link">\n`;
        html += '              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n';
        html += '                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>\n';
        html += '                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>\n';
        html += '              </svg>\n';
        html += '              Website\n';
        html += '            </a>\n';
      }
      
      if (tech.links.github) {
        html += `            <a href="${tech.links.github}" target="_blank" rel="noopener noreferrer" class="tech-link">\n`;
        html += '              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n';
        html += '                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>\n';
        html += '              </svg>\n';
        html += '              GitHub\n';
        html += '            </a>\n';
      }
      
      if (tech.links.docs) {
        html += `            <a href="${tech.links.docs}" target="_blank" rel="noopener noreferrer" class="tech-link">\n`;
        html += '              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n';
        html += '                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>\n';
        html += '                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>\n';
        html += '              </svg>\n';
        html += '              Docs\n';
        html += '            </a>\n';
      }
      
      html += '          </div>\n';
      html += '        </div>\n';
      html += '      </div>\n';
    });
    
    html += '    </div>\n';
    html += '  </div>\n';
    html += '</div>\n';
  });
  
  html += '</div>\n';
  return html;
}

// Generate the full HTML
function generateHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${landscapeData.title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <div class="header-content">
      <div class="logo">
        <h1>${landscapeData.title}</h1>
      </div>
      <a href="https://github.com/your-org/ai-landscape" target="_blank" rel="noopener noreferrer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.374 0 0 5.373 0 12C0 17.302 3.438 21.8 8.207 23.387C8.806 23.498 9 23.126 9 22.81V20.576C5.662 21.302 4.967 19.16 4.967 19.16C4.421 17.773 3.634 17.404 3.634 17.404C2.545 16.659 3.717 16.675 3.717 16.675C4.922 16.759 5.556 17.912 5.556 17.912C6.626 19.746 8.363 19.216 9.048 18.909C9.155 18.134 9.466 17.604 9.81 17.305C7.145 17 4.343 15.971 4.343 11.374C4.343 10.063 4.812 8.993 5.579 8.153C5.455 7.85 5.044 6.629 5.696 4.977C5.696 4.977 6.704 4.655 8.997 6.207C9.954 5.941 10.98 5.808 12 5.803C13.02 5.808 14.047 5.941 15.006 6.207C17.297 4.655 18.303 4.977 18.303 4.977C18.956 6.63 18.545 7.851 18.421 8.153C19.191 8.993 19.656 10.064 19.656 11.374C19.656 15.983 16.849 16.998 14.177 17.295C14.607 17.667 15 18.397 15 19.517V22.81C15 23.129 15.192 23.504 15.801 23.386C20.566 21.797 24 17.3 24 12C24 5.373 18.627 0 12 0Z" fill="#333"/>
        </svg>
      </a>
    </div>
  </header>

  <main>
    <div class="selector-container">
      <h2>Explore Building Blocks for Your AI Stack</h2>
      <p>${landscapeData.description}</p>
      
      <div class="filter-container">
        ${generateCategoryButtons()}

        <div class="search-box">
          <input type="text" class="search-input" placeholder="Search technologies...">
        </div>
      </div>
      
      <hr>
    </div>

    ${generateTechCards()}
  </main>

  <footer>
    <div class="footer-content">
      <div class="copyright">
        © <span id="current-year"></span> EggAI Technologies. An open reference architecture.
      </div>
      <div class="links">
        <a href="https://github.com/your-org/ai-landscape" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href="https://github.com/your-org/ai-landscape" target="_blank" rel="noopener noreferrer">
          Documentation
        </a>
      </div>
    </div>
  </footer>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Set current year in the footer
      document.getElementById('current-year').textContent = new Date().getFullYear();
      
      // Set up collapsible layer headers
      const layerHeaders = document.querySelectorAll('.layer-header');
      
      layerHeaders.forEach(header => {
        header.addEventListener('click', () => {
          const layerContent = header.nextElementSibling;
          const collapseIcon = header.querySelector('.collapse-icon');
          
          if (layerContent.classList.contains('collapsed')) {
            // Expand - set max-height before removing collapsed class (for smoother animation)
            const expandedHeight = layerContent.scrollHeight;
            requestAnimationFrame(() => {
              layerContent.style.maxHeight = expandedHeight + 'px';
              layerContent.classList.remove('collapsed');
              collapseIcon.style.transform = 'rotate(0deg)';
            });
          } else {
            // Collapse
            layerContent.style.maxHeight = layerContent.scrollHeight + 'px';
            requestAnimationFrame(() => {
              layerContent.classList.add('collapsed');
              collapseIcon.style.transform = 'rotate(-90deg)';
            });
          }
        });
      });
      
      // Initialize all layers as expanded
      setTimeout(() => {
        document.querySelectorAll('.layer-content').forEach(content => {
          // Start with all layers expanded
          const height = content.scrollHeight;
          content.style.maxHeight = height + 'px';
          content.classList.remove('collapsed');
        });
      }, 100);
      
      // Category filtering
      const tagFilters = document.querySelectorAll('.tag-filter');
      const techTags = document.querySelectorAll('.tech-tag');
      const layerContainers = document.querySelectorAll('.layer-container');
      const techCards = document.querySelectorAll('.tech-card');
      
      // Custom filter function to show only one category
      function filterByCategory(category) {
        console.log("Filtering by category:", category);
        
        // First hide ALL layer containers and cards
        layerContainers.forEach(container => {
          container.style.display = 'none';
        });
        
        techCards.forEach(card => {
          card.style.display = 'none';
        });
        
        if (category === 'all') {
          // Show all layers and cards for "All Categories"
          layerContainers.forEach(container => {
            container.style.display = 'block';
          });
          
          techCards.forEach(card => {
            card.style.display = 'flex';
          });
        } else {
          // Only show the layer matching the category
          const matchingLayer = document.querySelector(\`.layer-container[data-layer="\${category}"]\`);
          if (matchingLayer) {
            matchingLayer.style.display = 'block';
            
            // Only show cards in this layer with matching category
            const cardsInLayer = matchingLayer.querySelectorAll('.tech-card');
            cardsInLayer.forEach(card => {
              const cardCategories = card.getAttribute('data-categories').split(' ');
              if (cardCategories.includes(category)) {
                card.style.display = 'flex';
              }
            });
          }
        }
      }
      
      // Add click handlers to main filter buttons
      tagFilters.forEach(filter => {
        filter.addEventListener('click', () => {
          // Remove active class from all filters
          tagFilters.forEach(btn => btn.classList.remove('active'));
          
          // Add active class to clicked filter
          filter.classList.add('active');
          
          const category = filter.getAttribute('data-category');
          filterByCategory(category);
        });
      });
      
      // Make tech tags clickable for filtering
      techTags.forEach(tag => {
        tag.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent event bubbling
          
          // Get the category from the clicked tag
          const category = tag.getAttribute('data-category');
          
          // Find and activate the corresponding filter button
          const matchingFilter = document.querySelector('.tag-filter[data-category="' + category + '"]');
          if (matchingFilter) {
            // Remove active class from all filters
            tagFilters.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to matching filter
            matchingFilter.classList.add('active');
            
            // Apply the filter
            filterByCategory(category);
          }
        });
      });
      
      // Search functionality
      const searchInput = document.querySelector('.search-input');
      
      searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        
        if (searchTerm === '') {
          // If search is empty, show all
          const activeCategory = document.querySelector('.tag-filter.active').getAttribute('data-category');
          filterByCategory(activeCategory);
          return;
        }
        
        // First hide all cards and containers
        techCards.forEach(card => {
          card.style.display = 'none';
        });
        layerContainers.forEach(container => {
          container.style.display = 'none';
        });
        
        techCards.forEach(card => {
          const techName = card.querySelector('.tech-name').textContent.toLowerCase();
          const techDescription = card.querySelector('.tech-description').textContent.toLowerCase();
          const techTags = Array.from(card.querySelectorAll('.tech-tag')).map(tag => tag.textContent.toLowerCase());
          
          // Check if the search term matches name, description, or any tag
          if (techName.includes(searchTerm) || 
              techDescription.includes(searchTerm) || 
              techTags.some(tag => tag.includes(searchTerm))) {
            card.style.display = 'flex';
            // Show the layer container for this card
            const layerContainer = card.closest('.layer-container');
            if (layerContainer) {
              layerContainer.style.display = 'block';
            }
          }
        });
      });
    });
  </script>
</body>
</html>`;
}

// Write the generated HTML to index.html
fs.writeFileSync(path.join(__dirname, 'index.html'), generateHTML());
console.log('AI Landscape HTML has been generated successfully!');
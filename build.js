const fs = require('fs');
const path = require('path');

// Load the category definitions from CSV
const categoriesPath = path.join(__dirname, 'src', 'data', 'categories.csv');
const categoriesContent = fs.readFileSync(categoriesPath, 'utf8');
const categoriesRows = parseCSV(categoriesContent);

// Parse categories from CSV
const categoriesData = categoriesRows.map(row => ({
  id: row[0],
  name: row[1],
  description: row[2],
  examples: row[3],
  color: row[4]
}));

// Read the technologies CSV file
const csvFilePath = path.join(__dirname, 'src', 'data', 'technologies.csv');
const csvContent = fs.readFileSync(csvFilePath, 'utf8');

// Parse CSV data
const rows = parseCSV(csvContent);

// Create technologies array
const technologies = [];

// Process each row
rows.forEach(row => {
  // Skip incomplete rows
  if (row.length < 8) return;
  
  const technology = {
    name: row[0],
    description: row[1],
    longDescription: row[2],
    categories: row[3].split('|').map(cat => cat.trim()), // Convert pipe-separated categories back to array
    logoColor: row[4],
    links: {}
  };
  
  // Add non-empty links
  if (row[5]) technology.links.website = row[5];
  if (row[6]) technology.links.github = row[6];
  if (row[7]) technology.links.docs = row[7];
  
  // Add to technologies array
  technologies.push(technology);
});

// Create the landscape data object
const landscapeData = {
  title: "AI Landscape",
  description: "Explore and filter AI technologies by category.",
  categories: categoriesData,
  technologies: technologies
};

// Generate category filter buttons
function generateCategoryButtons() {
  let html = '<div class="tag-filters">\n';
  
  // All categories button
  html += '  <button class="tag-filter active" data-category="all">All Categories</button>\n';
  
  landscapeData.categories.forEach(category => {
    // Skip if category is a placeholder or has missing required fields
    if (!category.id || !category.name || category.id === "id") {
      return;
    }
    
    // Add context info from the visualization in parentheses for each category
    let displayName = category.name;
        
    html += `  <button class="tag-filter" data-category="${category.id}" style="border-color: ${category.color};" title="${category.description}\\n\\nExamples: ${category.examples}">${displayName}</button>\n`;
  });
  
  html += '</div>\n';
  return html;
}

// Generate a simple icon SVG for the technology
function generateLogoSvg(color) {
  return `<svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="4" fill="${color}"/>
    <path d="M16 8L24 16L16 24L8 16L16 8Z" fill="white"/>
  </svg>`;
}

// Logo SVG generator for tech cards
function generateLogoSvg(color) {
  return `<svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="4" fill="${color}"/>
    <path d="M16 8L24 16L16 24L8 16L16 8Z" fill="white"/>
  </svg>`;
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
    'applications', 
    'llmops', 
    'monitoring', 
    'security'
  ];
  
  // Generate cards by category in the defined order
  categoryOrder.forEach(categoryId => {
    const category = techsByCategory[categoryId];
    
    if (!category) return; // Skip if category doesn't exist
    
    html += `<div class="layer-container" data-layer="${categoryId}">\n`;
    html += `  <div class="layer-header" style="background-color: ${category.color};">\n`;
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
  <title>${landscapeData.title} - Interactive Technology Visualization</title>
  <meta name="description" content="${landscapeData.description}">
  <meta name="keywords" content="AI, artificial intelligence, machine learning, MLOps, AI tools, AI landscape, technology, data science, LLM, infrastructure, data layer">
  <meta name="author" content="EggAI Technologies">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://eggai-tech.github.io/ai-landscape/">
  <meta property="og:title" content="${landscapeData.title} - Interactive Technology Visualization">
  <meta property="og:description" content="${landscapeData.description}">
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://eggai-tech.github.io/ai-landscape/">
  <meta property="twitter:title" content="${landscapeData.title} - Interactive Technology Visualization">
  <meta property="twitter:description" content="${landscapeData.description}">
  
  <!-- Canonical link -->
  <link rel="canonical" href="https://eggai-tech.github.io/ai-landscape/">

  <!-- Favicon - You can add these if you have icon files -->
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23333'%3E%3Cpath d='M12 0C5.374 0 0 5.373 0 12C0 17.302 3.438 21.8 8.207 23.387C8.806 23.498 9 23.126 9 22.81V20.576C5.662 21.302 4.967 19.16 4.967 19.16C4.421 17.773 3.634 17.404 3.634 17.404C2.545 16.659 3.717 16.675 3.717 16.675C4.922 16.759 5.556 17.912 5.556 17.912C6.626 19.746 8.363 19.216 9.048 18.909C9.155 18.134 9.466 17.604 9.81 17.305C7.145 17 4.343 15.971 4.343 11.374C4.343 10.063 4.812 8.993 5.579 8.153C5.455 7.85 5.044 6.629 5.696 4.977C5.696 4.977 6.704 4.655 8.997 6.207C9.954 5.941 10.98 5.808 12 5.803C13.02 5.808 14.047 5.941 15.006 6.207C17.297 4.655 18.303 4.977 18.303 4.977C18.956 6.63 18.545 7.851 18.421 8.153C19.191 8.993 19.656 10.064 19.656 11.374C19.656 15.983 16.849 16.998 14.177 17.295C14.607 17.667 15 18.397 15 19.517V22.81C15 23.129 15.192 23.504 15.801 23.386C20.566 21.797 24 17.3 24 12C24 5.373 18.627 0 12 0Z'/%3E%3C/svg%3E">
  
  <!-- Fonts and Styles -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
  <link rel="stylesheet" href="css/collapsible.css">
  
  <!-- Mobile Menu Styles -->
  <style>
    /* Mobile burger menu in fixed position */
    #direct-burger {
      display: none;
      position: fixed;
      top: 12px;
      right: 12px;
      width: 36px;
      height: 36px;
      background: rgba(31, 41, 55, 0.8);
      z-index: 9999;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      border-radius: 4px;
    }
    
    #direct-burger span {
      display: block;
      width: 20px;
      height: 2px;
      margin: 2px 0;
      background-color: white;
      border-radius: 2px;
    }
    
    /* Only show on mobile */
    @media (max-width: 768px) {
      #direct-burger {
        display: flex !important; /* Force display on mobile */
      }
    }
  </style>
</head>
<body>
  <!-- Mobile burger menu - fixed position for easy access -->
  <div id="direct-burger">
    <span></span>
    <span></span>
    <span></span>
  </div>
  
  <header class="site-header">
    <div class="header-content">
      <div class="logo">
        <a href="index.html">
          <h1>${landscapeData.title}</h1>
        </a>
      </div>
      <div class="burger-menu" id="burger-menu">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="main-nav" id="main-nav">
        <a href="index.html" class="active">Technologies</a>
        <a href="stack.html">Stack</a>
        <a href="https://github.com/eggai-tech/ai-landscape" target="_blank" rel="noopener noreferrer">
          <svg class="github-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.374 0 0 5.373 0 12C0 17.302 3.438 21.8 8.207 23.387C8.806 23.498 9 23.126 9 22.81V20.576C5.662 21.302 4.967 19.16 4.967 19.16C4.421 17.773 3.634 17.404 3.634 17.404C2.545 16.659 3.717 16.675 3.717 16.675C4.922 16.759 5.556 17.912 5.556 17.912C6.626 19.746 8.363 19.216 9.048 18.909C9.155 18.134 9.466 17.604 9.81 17.305C7.145 17 4.343 15.971 4.343 11.374C4.343 10.063 4.812 8.993 5.579 8.153C5.455 7.85 5.044 6.629 5.696 4.977C5.696 4.977 6.704 4.655 8.997 6.207C9.954 5.941 10.98 5.808 12 5.803C13.02 5.808 14.047 5.941 15.006 6.207C17.297 4.655 18.303 4.977 18.303 4.977C18.956 6.63 18.545 7.851 18.421 8.153C19.191 8.993 19.656 10.064 19.656 11.374C19.656 15.983 16.849 16.998 14.177 17.295C14.607 17.667 15 18.397 15 19.517V22.81C15 23.129 15.192 23.504 15.801 23.386C20.566 21.797 24 17.3 24 12C24 5.373 18.627 0 12 0Z" fill="currentColor"/>
          </svg>
        </a>
      </div>
    </div>
  </header>

  <main>
    <h1 class="page-title">AI Technologies</h1>
    <p class="description">${landscapeData.description}</p>
    
    <div class="selector-container">
      
      <div class="filter-container">
        ${generateCategoryButtons()}

        <div class="search-box-container">
          <div class="search-box">
            <input type="text" class="search-input" placeholder="Search technologies...">
          </div>
          <div class="count-indicator">
            <span id="tech-count">${landscapeData.technologies.length}</span> technologies
          </div>
        </div>
      </div>
      
      <hr>
    </div>

    ${generateTechCards()}
  </main>

  <footer>
    <div class="footer-content">
      <div class="copyright">
        © <span id="current-year"></span> EggAI Technologies
      </div>
      <div class="links">
        <a href="https://github.com/eggai-tech/ai-landscape" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </div>
    </div>
  </footer>

  <script src="js/script.js"></script>
  <script src="js/collapsible.js"></script>
  <script src="js/mobile-menu.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Set current year in the footer
      document.getElementById('current-year').textContent = new Date().getFullYear();
      
      // Initialize variables needed for filtering
      const tagFilters = document.querySelectorAll('.tag-filter');
      const techTags = document.querySelectorAll('.tech-tag');
      const layerContainers = document.querySelectorAll('.layer-container');
      const techCards = document.querySelectorAll('.tech-card');
      
      // Define the filter function
      function filterByCategory(category) {
        console.log("Filtering by category:", category);
        
        // First hide ALL layer containers and cards
        layerContainers.forEach(container => {
          container.style.display = 'none';
        });
        
        techCards.forEach(card => {
          card.style.display = 'none';
        });
        
        let visibleCount = 0;
        
        if (category === 'all') {
          // Show all layers and cards for "All Categories"
          layerContainers.forEach(container => {
            container.style.display = 'block';
          });
          
          techCards.forEach(card => {
            card.style.display = 'flex';
            visibleCount++;
          });
        } else {
          // Only show the layer matching the category
          const matchingLayer = document.querySelector('.layer-container[data-layer="' + category + '"]');
          if (matchingLayer) {
            matchingLayer.style.display = 'block';
            
            // Only show cards in this layer with matching category
            const cardsInLayer = matchingLayer.querySelectorAll('.tech-card');
            cardsInLayer.forEach(card => {
              const cardCategories = card.getAttribute('data-categories').split(' ');
              if (cardCategories.includes(category)) {
                card.style.display = 'flex';
                visibleCount++;
              }
            });
          }
        }
        
        // Update the count indicator
        const techCountElement = document.getElementById('tech-count');
        if (techCountElement) {
          techCountElement.textContent = visibleCount;
        }
      }
      
      // Add click handlers to filter buttons
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
      
      // Check URL parameters for category filtering
      const urlParams = new URLSearchParams(window.location.search);
      const categoryParam = urlParams.get('category');
      
      if (categoryParam) {
        // Find the filter button that matches the category parameter
        const matchingFilter = document.querySelector('.tag-filter[data-category="' + categoryParam + '"]');
        if (matchingFilter) {
          // Remove active class from all filters
          tagFilters.forEach(btn => btn.classList.remove('active'));
          
          // Add active class to matching filter
          matchingFilter.classList.add('active');
          
          // Trigger the filtering function
          filterByCategory(categoryParam);
        }
      }

      // Handle the collapsible sections
      const layerHeaders = document.querySelectorAll('.layer-header');
      
      // Handle click on headers
      layerHeaders.forEach(header => {
        header.addEventListener('click', function() {
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
      
      // Initialize all layers as expanded
      document.querySelectorAll('.layer-content').forEach(content => {
        content.classList.remove('collapsed');
        content.style.display = 'block';
      });
      
      // Category filtering - Using the variables defined above
      
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
        
        let visibleCount = 0;
        
        if (category === 'all') {
          // Show all layers and cards for "All Categories"
          layerContainers.forEach(container => {
            container.style.display = 'block';
          });
          
          techCards.forEach(card => {
            card.style.display = 'flex';
            visibleCount++;
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
                visibleCount++;
              }
            });
          }
        }
        
        // Update the count indicator
        document.getElementById('tech-count').textContent = visibleCount;
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
        
        let visibleCount = 0;
        
        techCards.forEach(card => {
          const techName = card.querySelector('.tech-name').textContent.toLowerCase();
          const techDescription = card.querySelector('.tech-description').textContent.toLowerCase();
          const techTags = Array.from(card.querySelectorAll('.tech-tag')).map(tag => tag.textContent.toLowerCase());
          
          // Check if the search term matches name, description, or any tag
          if (techName.includes(searchTerm) || 
              techDescription.includes(searchTerm) || 
              techTags.some(tag => tag.includes(searchTerm))) {
            card.style.display = 'flex';
            visibleCount++;
            // Show the layer container for this card
            const layerContainer = card.closest('.layer-container');
            if (layerContainer) {
              layerContainer.style.display = 'block';
            }
          }
        });
        
        // Update the count indicator
        document.getElementById('tech-count').textContent = visibleCount;
      });
    });
  </script>
</body>
</html>`;
}

// Helper function to parse CSV content
function parseCSV(csvContent) {
  const result = [];
  let row = [];
  let inquote = false;
  let buffer = '';
  
  for (let i = 0; i < csvContent.length; i++) {
    const char = csvContent[i];
    
    // Handle quotes
    if (char === '"') {
      if (i + 1 < csvContent.length && csvContent[i + 1] === '"') {
        // Double quotes inside quoted field - add single quote
        buffer += '"';
        i++; // Skip the next character
      } else {
        // Toggle quote mode
        inquote = !inquote;
      }
    } 
    // Handle commas
    else if (char === ',' && !inquote) {
      row.push(buffer);
      buffer = '';
    } 
    // Handle newlines
    else if ((char === '\n' || char === '\r') && !inquote) {
      // Skip if this is a blank line or part of CRLF
      if (char === '\r' && i + 1 < csvContent.length && csvContent[i + 1] === '\n') {
        continue;
      }
      if (buffer !== '' || row.length > 0) {
        row.push(buffer);
        result.push(row);
        row = [];
        buffer = '';
      }
    } 
    // Add character to buffer
    else {
      buffer += char;
    }
  }
  
  // Add last remaining field and row if there's any
  if (buffer !== '' || row.length > 0) {
    row.push(buffer);
    result.push(row);
  }
  
  return result;
}

// Create docs directory for GitHub Pages if it doesn't exist
const docsDir = path.join(__dirname, 'docs');
const cssDir = path.join(docsDir, 'css');
const jsDir = path.join(docsDir, 'js');

// Ensure directories exist
[docsDir, cssDir, jsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Copy CSS files
fs.readdirSync(path.join(__dirname, 'src', 'css')).forEach(file => {
  fs.copyFileSync(
    path.join(__dirname, 'src', 'css', file),
    path.join(cssDir, file)
  );
});

// Copy only needed JS files
const jsFilesToCopy = ['script.js', 'collapsible.js', 'mobile-menu.js'];
jsFilesToCopy.forEach(file => {
  if (fs.existsSync(path.join(__dirname, 'src', 'js', file))) {
    fs.copyFileSync(
      path.join(__dirname, 'src', 'js', file),
      path.join(jsDir, file)
    );
  }
});

// Data files are not needed in the docs folder as they're processed and embedded into the HTML

// Write the generated HTML to docs/index.html
fs.writeFileSync(path.join(docsDir, 'index.html'), generateHTML());

// Copy the stack.html file from src/html to docs
fs.copyFileSync(
  path.join(__dirname, 'src', 'html', 'stack.html'),
  path.join(docsDir, 'stack.html')
);

console.log('AI Landscape HTML has been generated successfully for GitHub Pages!');
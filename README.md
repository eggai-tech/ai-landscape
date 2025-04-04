# AI Landscape

A static, interactive visualization of the AI technology ecosystem. This tool helps users discover and explore the tools, frameworks, and platforms that power modern AI systems.

## Features

- **Interactive Filtering**: Easily filter technologies by category
- **Collapsible Sections**: Expand and collapse categories to focus on areas of interest
- **Tag-Based Navigation**: Click on technology tags to filter by category
- **Search Functionality**: Find specific technologies by name, description, or category
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (for building the landscape from data)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/eggai-tech/ai-landscape.git
   cd ai-landscape
   ```

2. Build and view the landscape:
   ```bash
   node build.js
   ```
   
   This will generate the site in the `docs` directory for GitHub Pages.
   
   Then serve the docs directory:
   ```bash
   cd docs
   python3 -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser

### Updating the Landscape

The landscape is maintained using CSV files for easy editing:

1. Edit the `data/technologies.csv` file using any spreadsheet application (Excel, Google Sheets, etc.)
2. Run the build script:
   ```bash
   node build.js
   ```
3. The updated landscape will be generated in the `docs` directory for GitHub Pages

## Structure

- `build.js` - Script to generate the HTML from CSV data
- `src/` - Source code directory
  - `data/` - Directory containing source data files
    - `technologies.csv` - Primary data file with technology information
    - `categories.csv` - Category definitions
  - `css/` - Directory containing source CSS files
    - `styles.css` - Main CSS styles for the look & feel
    - `collapsible.css` - CSS for collapsible sections
  - `js/` - Directory containing source JavaScript files
    - `script.js` - Main JavaScript functionality
    - `collapsible.js` - JavaScript for collapsible sections
    - `mobile-menu.js` - JavaScript for mobile navigation
  - `html/` - Template HTML files
    - `stack.html` - Stack visualization page template
- `docs/` - Generated output directory for GitHub Pages (created by build script)
  - `index.html` - The main AI landscape visualization
  - `stack.html` - The stack visualization page
  - `css/` - Copied CSS files
  - `js/` - Copied JavaScript files

## Adding Technologies

To add a new technology to the landscape:

1. Open `src/data/technologies.csv` with a spreadsheet application
2. Add a new row with the following columns:
   - `name`: Technology name
   - `description`: Short description (appears on card)
   - `longDescription`: Detailed description (appears in tooltip)
   - `category`: Category ID (e.g., "infrastructure")
   - `logoColor`: HEX color code for the logo (e.g., "#326CE5")
   - `websiteURL`: URL to the technology website
   - `githubURL`: URL to the GitHub repository (optional)
   - `docsURL`: URL to the documentation (optional)
3. Run `node build.js` to rebuild the landscape

## Adding Categories

Categories are defined in the `src/data/categories.csv` file.

To add a new category:

1. Open `src/data/categories.csv` with a spreadsheet application
2. Add a new row with the following columns:
   - `id`: Unique identifier for the category (e.g., "newcategory")
   - `name`: Display name for the category (e.g., "New Category")
   - `description`: Description of what belongs in this category
   - `examples`: Comma-separated list of example technologies
   - `color`: HEX color code for the category (e.g., "#4C5364")
3. Update the `categoryOrder` array in `build.js` to include your new category ID

## CSV Format

The project uses two CSV files for easy maintenance:

### Technologies CSV (`src/data/technologies.csv`)
This is the main data file containing all the technologies:
- `name`: The name of the technology
- `description`: Short description that appears on the card
- `longDescription`: More detailed description
- `category`: Category ID (e.g., "infrastructure")
- `logoColor`: The HEX color code for the logo
- `websiteURL`: URL to the technology website
- `githubURL`: URL to the GitHub repository (optional)
- `docsURL`: URL to the documentation (optional)

### Categories CSV (`src/data/categories.csv`)
- `id`: Unique identifier for the category (e.g., "infrastructure")
- `name`: Display name for the category (e.g., "Infrastructure") 
- `description`: Description of what belongs in this category
- `examples`: Comma-separated list of example technologies
- `color`: HEX color code for the category (e.g., "#2F80ED")

## Deployment

This is a static site that can be deployed on any web server or hosting platform:

1. Build the site:
   ```bash
   node build.js
   ```

2. For GitHub Pages:
   - Push the repository to GitHub
   - Go to repository settings > Pages
   - Select "Deploy from a branch" and choose "main" branch and "/docs" folder
   - Click "Save"
   - Wait for GitHub Pages to deploy your site

3. For other web servers, copy the contents of the `docs` directory to your server

For local testing, you can use Python's built-in HTTP server:
```bash
cd docs
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

Alternatively, you can use any static file server like Node's `http-server`, nginx, or Apache.

## License

MIT
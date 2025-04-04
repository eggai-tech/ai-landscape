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

2. View the landscape:
   - Option 1: Open `index.html` directly in any modern web browser
   - Option 2: Serve the directory with Python's built-in HTTP server:
     ```bash
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
3. The updated landscape will be generated as `index.html`

## Structure

- `index.html` - The main AI landscape visualization (generated)
- `build.js` - Script to generate the HTML from CSV data
- `data/` - Directory containing data files
  - `technologies.csv` - Primary data file with technology information
  - `categories.csv` - Category definitions
- `css/` - Directory containing CSS files
  - `styles.css` - Main CSS styles for the look & feel
  - `collapsible.css` - CSS for collapsible sections
- `js/` - Directory containing JavaScript files
  - `script.js` - Main JavaScript functionality
  - `collapsible.js` - JavaScript for collapsible sections
- `assets/` - Directory for images, icons, and other static assets

## Adding Technologies

To add a new technology to the landscape:

1. Open `data/technologies.csv` with a spreadsheet application
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

Categories are defined in the `data/categories.csv` file.

To add a new category:

1. Open `data/categories.csv` with a spreadsheet application
2. Add a new row with the following columns:
   - `id`: Unique identifier for the category (e.g., "newcategory")
   - `name`: Display name for the category (e.g., "New Category")
   - `description`: Description of what belongs in this category
   - `examples`: Comma-separated list of example technologies
   - `color`: HEX color code for the category (e.g., "#4C5364")
3. Update the `categoryOrder` array in `build.js` to include your new category ID

## CSV Format

The project uses two CSV files for easy maintenance:

### Technologies CSV (`data/technologies.csv`)
This is the main data file containing all the technologies:
- `name`: The name of the technology
- `description`: Short description that appears on the card
- `longDescription`: More detailed description
- `category`: Category ID (e.g., "infrastructure")
- `logoColor`: The HEX color code for the logo
- `websiteURL`: URL to the technology website
- `githubURL`: URL to the GitHub repository (optional)
- `docsURL`: URL to the documentation (optional)

### Categories CSV (`data/categories.csv`)
- `id`: Unique identifier for the category (e.g., "infrastructure")
- `name`: Display name for the category (e.g., "Infrastructure") 
- `description`: Description of what belongs in this category
- `examples`: Comma-separated list of example technologies
- `color`: HEX color code for the category (e.g., "#2F80ED")

## Deployment

This is a static site that can be deployed on any web server or hosting platform:

1. Copy all files to your web server
2. Ensure `index.html` and support files are accessible

For local testing, you can use Python's built-in HTTP server:
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

Alternatively, you can use any static file server like Node's `http-server`, nginx, or Apache.

## License

MIT
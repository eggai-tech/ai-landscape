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
   - Open `index.html` in any modern web browser

### Updating the Landscape

The landscape is generated from the `landscape-data.json` file. To update:

1. Edit `landscape-data.json` with your changes
2. Run the build script:
   ```bash
   node build-landscape.js
   ```
3. The updated landscape will be generated as `index.html`

## Structure

- `index.html` - The main AI landscape visualization (generated)
- `build-landscape.js` - Script to generate the HTML from data
- `landscape-data.json` - Source data for the landscape
- `styles.css` - CSS styles for the look & feel

## Adding Technologies

To add a new technology to the landscape:

1. Open `landscape-data.json`
2. Add a new entry to the `technologies` array:
   ```json
   {
     "name": "Technology Name",
     "description": "Short description (appears on card)",
     "longDescription": "Detailed description (appears in tooltip)",
     "categories": ["category1", "category2"],
     "logoColor": "#HEXCOLOR",
     "links": {
       "website": "https://example.com",
       "github": "https://github.com/org/repo",
       "docs": "https://docs.example.com"
     }
   }
   ```
3. Run `node build-landscape.js` to rebuild the landscape

## Adding Categories

To add a new category:

1. Open `landscape-data.json`
2. Add a new entry to the `categories` array:
   ```json
   {
     "id": "category-id",
     "name": "Category Name",
     "description": "Description of the category",
     "examples": "Example1, Example2, Example3",
     "color": "#HEXCOLOR"
   }
   ```
3. Update the `categoryOrder` array in `build-landscape.js` to include your new category

## Deployment

This is a static site that can be deployed on any web server or hosting platform:

1. Copy all files to your web server
2. Ensure `index.html` and support files are accessible

## License

MIT
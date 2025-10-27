const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const urls = [
  'https://nurserylive.com/collections/gardening',
  'https://nurserylive.com/collections/plants',
  'https://nurserylive.com/collections/seeds',
  'https://nurserylive.com/collections/flower-bulbs',
  'https://nurserylive.com/collections/planters',
  'https://nurserylive.com/collections/soil-and-fertilizers',
  'https://nurserylive.com/collections/gifts',
  'https://nurserylive.com/collections/accessories',
  'https://nurserylive.com/pages/corporate-gifting'
];

const outputFile = path.join(__dirname, '../apps/web/src/data/categories.json');

async function fetchCategories() {
  const allCategories = [];
  
  for (const url of urls) {
    try {
      console.log(`Fetching categories from: ${url}`);
      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      const $ = cheerio.load(data);
      const categoryName = $('h1').first().text().trim() || url.split('/').pop().replace(/-/g, ' ');
      
      // Find category cards - this selector might need adjustment based on the actual page structure
      $('.grid__item, .collection-block, .category-item').each((i, el) => {
        const $el = $(el);
        const name = $el.find('h3, .category-title, .collection-block-item__title').text().trim();
        let image = $el.find('img').attr('src') || $el.find('img').attr('data-src');
        
        if (image && !image.startsWith('http')) {
          image = `https:${image}`;
        }
        
        if (name && image) {
          allCategories.push({
            id: `${categoryName.toLowerCase().replace(/\s+/g, '-')}-${i}`,
            name,
            image,
            slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
            parentCategory: categoryName
          });
        }
      });
      
      console.log(`Found ${allCategories.length} categories so far...`);
      
      // Be nice to the server
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`Error fetching ${url}:`, error.message);
    }
  }
  
  // Save to file
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, JSON.stringify(allCategories, null, 2));
  console.log(`Saved ${allCategories.length} categories to ${outputFile}`);
}

// Run the scraper
fetchCategories().catch(console.error);

const puppeteer = require('puppeteer');

let linkarr = [];
let pageNum = 1;

let getAllLinks = async (page) => {

    const links = await page.$$eval('h2.entry-title', elements => elements.map(item => item.querySelector('a').href));
    return links
}

(async () => {

    // Launch the browser and open a new blank page

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(100000)
  

    // Navigate the page to a URL
    await page.goto('https://www.affirmations.online/category/money-affirmations/');

    // Set screen size
    await page.setViewport({width: 1080, height: 1024});

    let links = await getAllLinks(page);

    linkarr = linkarr.concat(links);
  
    console.log("Logging links from page 1")

    let isPrevPageAvailable = true;

    while (isPrevPageAvailable) {
      pageNum++;
      console.log("Logging links from page " + pageNum)
      await page.goto(`https://www.affirmations.online/category/money-affirmations/page/${pageNum}/`);
      let links = await getAllLinks(page);
      linkarr = linkarr.concat(links);
        if (await page.$('.nav-previous a') == null){
            isPrevPageAvailable = false;
        } else {
            isPrevPageAvailable = true;
        }
    }

    console.log(linkarr)

    
    //NEXT STEP scraping titles and affirmations

    let affirmations = [];

    for (let i = 0; i < linkarr.length; i++) {
        await page.goto(linkarr[i]);
        await page.waitForSelector('.entry-title');
        await page.waitForSelector('.entry-content');
        const affirmationTitle = await page.$eval('.entry-title', el => el.innerText);
        const affirmation = await page.$eval('.entry-content p', el => el.innerText);

        affirmations.push({affirmationTitle, affirmation});
    }

    Bun.write("affirmations-money.json", JSON.stringify(affirmations, null, 2))


    await browser.close();
  })();
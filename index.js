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
  
    console.log(linkarr)

    let isPrevPageAvailable = true;

    while (isPrevPageAvailable) {
      pageNum++;
      await page.goto(`https://www.affirmations.online/category/money-affirmations/page/${pageNum}/`);
      let links = await getAllLinks(page);
      linkarr = linkarr.concat(links);
        if (await page.$('.nav-previous a') == null){
            isPrevPageAvailable = false;
        } else {
            isPrevPageAvailable = true;
        }
    }

    // let navPrevButton = await page.$eval('.nav-previousss a', element => element.href);
    // console.log(navPrevButton);

    console.log(linkarr)

    await browser.close();
  })();
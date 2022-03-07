import puppeteer from "puppeteer";

(async () => {
  // headless 브라우저 실행
  const browser = await puppeteer.launch({
    headless: false,
  });

  // 새로운 페이지 열기
  const page = await browser.newPage();

  //page size 정하기
  await page.setViewport({
    width: 1920,
    height: 1080,
  });

  await page.goto("https://eruri.kangwon.ac.kr/login.php");

  await page.$$eval(".close_notice", (el) => {
    for (let i of el) {
      i.click();
    }
  });

  await page.$eval("#input-username", (el) => (el.value = "201613199"));

  await page.$eval("#input-password", (el) => (el.value = "pa123456789@%"));
  await page.$eval(".btn-success", (el) => el.click());

  await page.waitForSelector(".course_label_re");
  await page.waitForSelector(".course_link");

  const courseUrls = await page.$$eval(".course_link", (el) =>
    el.map((i) => i.getAttribute("href"))
  );

  for (let url of courseUrls) {
    let newPage = await browser.newPage();
    await newPage.goto(url);
    const test = await newPage.$(
      "#coursemos-course-menu > ul > li:nth-child(1) > div > div.content > ul > li:nth-child(2) > ul > li:nth-child(1) > a"
    );
    console.log(test);
    // await newPage.close();
  }
})();

import puppeteer from "puppeteer";

(async () => {
  let course = new Map();
  // headless 브라우저 실행
  const browser = await puppeteer.launch({
    headless: true,
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

    const courseTitle = await newPage.$eval(
      "div.coursename > h1 > a",
      (el) => el.textContent
    );
    const shceduleUrl = await newPage.$(
      "#coursemos-course-menu > ul > li:nth-child(1) > div > div.content > ul > li:nth-child(2) > ul > li:nth-child(1) > a"
    );

    await shceduleUrl.click();
    await newPage.waitForSelector(".user_progress_table");
    const selector =
      "#ubcompletion-progress-wrapper > div:nth-child(2) > table > tbody";

    const row = await newPage.$$eval(selector, (trs) =>
      trs.map((tr) => {
        const tds = [...tr.getElementsByTagName("td")];
        return tds.map((td) => td.textContent);
      })
    );
    course.set(courseTitle, row.flat());
    await newPage.close();
  }
  console.log(course);
})();

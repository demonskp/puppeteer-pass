const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport:{"width":1536,"height":721}
    })

    const page = await browser.newPage();
    page.setViewport({"width":1121,"height":721});
    await page.goto('https://passport-pbsp-test.myysq.com.cn/auth/login')
    await page.screenshot({
        path: 'D:/Code/puppeteerTest/images/step1.png'
    });
    const tenantCodeInputEl = await page.$("#enterprise");
    await tenantCodeInputEl.type("ywycwcg");
    const usernameInputEl = await page.$("#user_name");
    await usernameInputEl.type("ywycwcg");
    const passwordInputEl = await page.$("#password");
    await passwordInputEl.type("sh123456");

    await page.screenshot({
        path: 'D:/Code/puppeteerTest/images/step2.png'
    });

    const loginBtnEl = await page.$("#login_btn");
    loginBtnEl.click();

    await page.waitForNavigation();
    await page.waitForTimeout(800);
    await page.screenshot({
        path: 'D:/Code/puppeteerTest/images/step3.png'
    });

    // browser.close();
})()
const tempJSON = require("../template.json");
const puppeteer = require('puppeteer');
const path = require("path");
const fs = require("fs");

class Executer {

  /**
   * @type {puppeteer.Browser}
   */
  _browser;
  /**
   * @type {puppeteer.Page}
   */
  _page;

  async openExecute(step) {
    if(!step.href){
      throw new Error("href(链接)不能为空!");
    }
    await this._page.goto(step.href);
  }

  async inputExecute(step){
    if(!step.target){
      throw new Error("target(目标)不能为空!");
    }
    const el = await this._page.$(step.target);
    if(!el){
      throw new Error("找不到对应元素!");
    }
    await el.type(step.text || "");
  }

  async screenshotExecute(step, name){
    let screenElement = this._page;
    if(step.target){
      screenElement = this._page.$(step.target);
    }
    if(!screenElement){
      throw new Error("找不到对应元素!");
    }

    let imgDirPath = path.resolve(__dirname, '../images', name);
    if(!fs.existsSync(imgDirPath)){
      fs.mkdirSync(imgDirPath);
    }
    imgDirPath = path.resolve(__dirname, '../images', name, "时间-hash");
    if(!fs.existsSync(imgDirPath)){
      fs.mkdirSync(imgDirPath);
    }
    await screenElement.screenshot({
      path: path.resolve(imgDirPath, step.name+'.png')
    });
  }

  async clickElementExcute(step){
    if(!step.target){
      throw new Error("target(目标)不能为空!");
    }
    const el = await this._page.$(step.target);
    await el.click();

    if(step.navigation){
        await this._page.waitForNavigation();
    }
  }

  async waitForExcute(step) {
    await this._page.waitForTimeout(step.time);
  }
  async hoverElementExcute(step) {
    if(!step.target){
      throw new Error("target(目标)不能为空!");
    }
    const el = await this._page.$(step.target);
    el.hover();
  }

  async executeReal(step, options) {
    switch (step.type) {
      case "open_page":
        await this.openExecute(step);
        break;
      case "input":
        await this.inputExecute(step);
        break;
      case "screenshot":
        await this.screenshotExecute(step, options.name);
        break;
      case "click_element":
        await this.clickElementExcute(step);
        break;
      case "waitFor":
        await this.waitForExcute(step);
        break;
      case "hover_element":
        await this.hoverElementExcute(step);
        break;

      default:
        break;
    }
    console.log(step.name, '执行完毕')
  }

  async execute() {
    const {
      steps, clientOptions, name
    } = tempJSON;

    const browser = await puppeteer.launch({
      headless: clientOptions.headless,
      defaultViewport: clientOptions.defaultViewport
    })
    const page = await browser.newPage();
    this._browser = browser;
    this._page = page;

    for (let i = 0; i < steps.length; i++) {
      const thisStep = steps[i];
      try {
        await this.executeReal(thisStep, tempJSON);
      } catch (err) {
        console.log(err);
        throw new Error(JSON.stringify({step: i, err:err.message}));
      }
    }
  }
}

module.exports = {
  Executer
}
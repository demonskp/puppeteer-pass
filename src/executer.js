const tempJSON = require("../template.json");
const puppeteer = require('puppeteer');
const path = require("path");
const { getHashcode, mkDeepdirs } = require("./utils/common");
const moment = require("moment");

class Executer {

  /**
   * @type {puppeteer.Browser}
   */
  _browser;
  /**
   * @type {puppeteer.Page}
   */
  _page;

  /**
   * @type {String}
   */
  _hash;
  
  _case;

  constructor(tcase){
    this._case = tcase;
  }

  async execute() {
    const {
      steps, clientOptions, name
    } = this._case;

    const browser = await puppeteer.launch({
      headless: clientOptions.headless,
      defaultViewport: clientOptions.defaultViewport
    })
    const page = await browser.newPage();
    this._browser = browser;
    this._page = page;
    this._hash = getHashcode()+"";

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

    const dateStr = moment().format("yyyy-MM-DD");
    const imgDirPath = path.resolve(__dirname, '../images', name, dateStr, this._hash);

    mkDeepdirs(imgDirPath);

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

  async exitBrowserExcute(){
    await this._browser.close();
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
      case "exit":
        await this.exitBrowserExcute(step);
        break; 

      default:
        break;
    }
  }
}

module.exports = {
  Executer
}
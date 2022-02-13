const tempJSON = require("../template.json");
const puppeteer = require('puppeteer');
const path = require("path");

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
    el.type(step.text || "");
  }

  async screenshotExecute(step){
    let screenElement = this._page;
    if(step.target){
      screenElement = this._page.$(step.target);
    }
    if(!screenElement){
      throw new Error("找不到对应元素!");
    }
    await screenElement.screenshot({
      path: path.resolve(__dirname, '../images', "20220213-nakdji1as", step.name+'.png')
  });
  }

  async executeReal(step) {
    switch (step.type) {
      case "open_page":
        await openExecute(step);
        break;
      case "input":
        await inputExecute(step);
        break;
      case "screenshot":
        await screenshotExecute(step);
        break;
        // TODO {yizy} 继续写剩下的事件
      case "click_element":
        await openExecute(step);
        break;
      case "waitFor":
        await openExecute(step);
        break;
      case "hover_element":
        await openExecute(step);
        break;

      default:
        break;
    }
  }

  async execute() {
    const {
      steps, clientOptions
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
        await this.executeReal(thisStep);
      } catch (err) {
        throw new Error({step: i, err:err});
      }
    }
  }
}
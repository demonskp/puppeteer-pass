const { Executer } = require('../executer');
const { tcaseRouter } = require('./tcase');

const routers = [
  {
    method: "get",
    name: "无头测试",
    path: "/headless-test",
    /**
     * 控制器
     * @param {import('express').Request} req 请求
     * @param {import('express').Response} res 返回
     */
    controller: async (req, res) => {
      try {
        const executer = new Executer();
        await executer.execute();
        res.json({
          code: 0,
          data:{},
          message: "",
        })
      } catch (error) {
        res.json({
          code: 1100,
          message: error.message,
        })
      }
      
    },
  },
  ...tcaseRouter
];

/**
 * 加载前端本地服务
 * @param {import('express').Express} app Express实例
 */
function loadLocalRouter(app) {
  routers.forEach((router) => {
    if (router.method) {
      app[router.method.toLocaleLowerCase()](router.path, router.controller);
    } else {
      app.use(router.path, router.controller);
    }
  });
}

module.exports = {
  loadLocalRouter,
};

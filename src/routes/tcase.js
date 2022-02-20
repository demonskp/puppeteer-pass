const { getCaseList, getCaseDetail } = require('../service/tcase')

module.exports = {
  tcaseRouter:[
    {
      method: "get",
      name: "case",
      path: "/case/list",
      /**
       * 控制器
       * @param {import('express').Request} req 请求
       * @param {import('express').Response} res 返回
       */
      controller: async (req, res) => {
        try {
          const list = await getCaseList();
          res.json({
            code: 0,
            data: list,
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
    {
      method: "get",
      name: "case-detail",
      path: "/case/detail",
      /**
       * 控制器
       * @param {import('express').Request} req 请求
       * @param {import('express').Response} res 返回
       */
      controller: async (req, res) => {
        try {
          const id = req.query.id;
          if(!id){
            throw new Error("id不能为空");
          }
          const detail = await getCaseDetail(id);
          res.json({
            code: 0,
            data: detail,
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
  ]
}
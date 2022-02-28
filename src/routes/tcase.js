const { Executer } = require('../executer');
const { getCaseList, getCaseDetail, addCase, editCase, deleteCase } = require('../service/tcase')

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
      method: "post",
      name: "case-delete",
      path: "/case/delete",
       /**
       * 控制器
       * @param {import('express').Request} req 请求
       * @param {import('express').Response} res 返回
       */
      controller: async (req, res) => {
        const { id } = req.body || {};
        try {
          if(!id){
            throw new Error("id不能为空!");
          }
          const result = await deleteCase(id);
          res.json({
            code: 0,
            data: result,
            message: "",
          })
        } catch (error) {
          res.json({
            code: 1100,
            message: error.message,
          })
        }
      }
    },
    {
      method: "post",
      name: "case-edit",
      path: "/case/edit",
       /**
       * 控制器
       * @param {import('express').Request} req 请求
       * @param {import('express').Response} res 返回
       */
      controller: async (req, res) => {
        const { id, name, clientOptions, steps } = req.body || {};
        try {
          if(!id){
            throw new Error("id不能为空!");
          }
          if(!name){
            throw new Error("用例名不能为空!");
          }
          if(!steps?.length){
            throw new Error("执行步骤不能为空!");
          }
          const tcase = await getCaseDetail(id);
          if(!tcase){
            throw new Error(`该用例(${id})不存在!`);
          }
          const result = await editCase(id, name, "", {name, clientOptions, steps});
          res.json({
            code: 0,
            data: result,
            message: "",
          })
        } catch (error) {
          res.json({
            code: 1100,
            message: error.message,
          })
        }
      }
    },
    {
      method: "post",
      name: "case-add",
      path: "/case/add",
      /**
       * 控制器
       * @param {import('express').Request} req 请求
       * @param {import('express').Response} res 返回
       */
      controller: async (req, res) => {
        const { name, clientOptions, steps } = req.body || {};
        try {
          if(!name){
            throw new Error("用例名不能为空!");
          }
          if(!steps?.length){
            throw new Error("执行步骤不能为空!");
          }
          const result = await addCase(name, "", {name, clientOptions, steps});
          res.json({
            code: 0,
            data: result,
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
          if(!detail){
            throw new Error(`该用例(${id})不存在!`)
          }
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
    {
      method: "post",
      name: "case-excute",
      path: "/case/excute",
      /**
       * 控制器
       * @param {import('express').Request} req 请求
       * @param {import('express').Response} res 返回
       */
      controller: async (req, res) => {
        try {
          const id = req.body.id;
          if(!id){
            throw new Error("id不能为空");
          }
          const detail = await getCaseDetail(id);
          const excuterInstance = new Executer(detail);
          await excuterInstance.execute();
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
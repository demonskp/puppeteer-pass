const mysql = require("mysql");
const {
  config
} = require("../config");

const pool = mysql.createPool({
  host: config.host,
  user: config.mysql.USERNAME,
  password: config.mysql.PASSWORD,
  database: config.mysql.DBNAME
});

class Mysql {
  constructor() {

  }
  /**
   * 普通查询
   * @param sql 查询字符串
   * @param params 参数
   */
  async query(sql, params = []) {
    return new Promise((resolve, reject) => {
      pool.query(sql, params, function (error, results, fields) {
        if (error) {
          throw error
        };
        resolve(results)
        // console.log('The solution is: ', results[0].solution);
      });
    })
  }

  /**
   * 单个SQL执行体
   * @param connection 连接对象
   * @param sql 查询语句
   * @param params 参数
   */
  async action(connection, sql, params) {
    return new Promise((reslove, reject) => {
      connection.query(sql, params, (err, results) => {
        if (err) {
          reject(err);
        }
        reslove(results);
      });
    })

  }

  /**
   * 事务执行
   * @param sqls 执行语句
   * @param params 参数集合
   */
  async transaction(sqls, params) {

    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
        }
        connection.beginTransaction(async err => {
          if (err) {
            throw new Error('start transaction Error');
          }
          try {
            let results = [];
            for (let i = 0; i < sqls.length; i++) {
              let sql = sqls[i];
              let param = params[i];
              let result = await this.action(connection, sql, param);
              results.push(result);
            }
            connection.commit();
            resolve(results);
          } catch (error) {
            connection.rollback();
            reject(error);
          }

        })
      })
    })

  }
}

const DB = new Mysql();

module.exports = {
  DB,
}
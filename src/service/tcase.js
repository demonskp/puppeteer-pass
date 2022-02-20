const { DB } = require("../utils/db");

async function getCaseList(){
  const SQL = "select id,name,create_user_id from tcase";
  const result = await DB.query(SQL);

  return result;
}

async function getCaseDetail(id) {
  const sql = "select id,name,create_user_id,main_json from tcase where 1=1 and id = ?";
  const params = [id];
  const list = await DB.query(sql, params);
  let result;
  if(list?.length){
    result = JSON.parse(list[0].main_json);
  }
  return result;
}

module.exports = {
  getCaseDetail,
  getCaseList
}
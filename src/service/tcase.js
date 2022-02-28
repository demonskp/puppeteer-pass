const { DB } = require("../utils/db");

async function addCase(name, createrId, mainJson){
  const SQL = 
  `INSERT INTO puppeteer.tcase
  (name, create_user_id, main_json)
  VALUES(?, ?, ?);
  `;
  const params = [name, createrId, JSON.stringify(mainJson)];
  const result = await DB.transaction([SQL], [params]);

  return result[0];
}

async function editCase(id, name, createrId, mainJson) {
  const SQL = 
  `UPDATE puppeteer.tcase
  SET name=?, create_user_id=?, main_json=?
  WHERE id=?;
  `
  const params = [name, createrId, JSON.stringify(mainJson), id];

  const result = await DB.transaction([SQL], [params]);
  return result[0];
}

async function deleteCase(id){
  const SQL = `DELETE FROM puppeteer.tcase
  WHERE id=?;`
  const params = [id];
  const result = await DB.transaction([SQL], [params]);
  return result;
}

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
  getCaseList,
  addCase,
  editCase,
  deleteCase
}
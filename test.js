/**
 * Created by 305-2 on 3/5/2017.
 */
console.log('******');
// let startDate = '2016-1-1';
// let endDate = '2016-1-10';
var start = new Date("02/05/2013");
var end = new Date("02/12/2013");

while(start < end){
  console.log(start);
  var newDate = start.setDate(start.getDate() + 1);
  start = new Date(newDate);
}

//
// static bruncuStockDeliveryDateFunc(uid,is_branch){
//   let startDate;
//   let endDate;
//   let dateChecker;
//   let curSql = Unit.test ? sql.test : sql;
//   // return curSql[unitsTableName].get_info_by_uid({
//   //   uid : uid,
//   // })
//   // .then((res) =>{
//   //   if(res.is_branch)
//   //     return curSql[lastLoginTableName].get_previous_login_date({
//   //       login_uid: uid
//   //     })
//   // })
//   if(is_branch) {
//     return curSql[lastLoginTableName].get_previous_login_date
//       .then((res) => {
//         startDate = res[0].login_date_time;
//         endDate = res[0].previous_login_date_time;
//       })
//       .then(() => {
//         return curSql[tableName].select()
//       })
//       .then((res) => {
//         while (startDate > endDate) {
//           let pcnt;
//           for ( pcnt = 1; pcnt <= res.length; pcnt++ ) {
//             dateChecker = rRuleCheckFunctionFactory(res[pcnt].default_date_rule, startDate, endDate);
//             if (dateChecker(startDate)) {
//               return curSql[branchStockDeliveryDate].insert({
//                 product_id: res[pcnt].product_id,
//                 branch_id: uid,
//                 counting_date: startDate,
//                 // min_stock: res[pcnt].default_min,
//                 min_stock: calcMin(res[pcnt],startDate),
//               })
//                 .then((res) => {
//                   res.splice(pcnt, 1);
//                 })
//             }
//
//             var newDate = startDate.setDate(startDate.getDate() - 1);
//             startdate = newDate;
//           }
//         }
//       })
//   }
// }
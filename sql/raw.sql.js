/**
 * Created by Amin on 01/02/2017.
 */
const env = require('../env');
const QueryFile = env.pgp.QueryFile;
const path = require('path');

// Helper for linking to external query files:
function sql(file) {
  let fullPath = path.join(__dirname, file); // generating full path;
  return new QueryFile(fullPath, {minify: true, debug: env.isDev});
}
/*
 * Add any new queries with nesting it in table then query name, then point to the SQL file for the query.
 * Do not forget to wrap the filename in 'sql()' function.
 * Put the SQL files for any new table/schema in a new directory
 * Use the same direcoty name for nesting the queries here.
 */
module.exports = {
  db: {
    create:   sql('db/create.sql'),
    drop:     sql('db/drop.sql'),
    test:     sql('db/test.sql'),
    dropSchema:     sql('db/dropSchema.sql')
  },
  units: {
    create:   sql('units/create.sql'),
    drop:     sql('units/drop.sql'),
    get:      sql('units/get.sql'),
    getUnits: sql('units/get.units.sql'),
    select:   sql('units/select.sql'),
    getByType: sql('units/getByType.sql'),
    get_info_by_uid: sql('units/get_info_by_uid.sql'),
  },
  products: {
    create:      sql('products/create.sql'),
    drop:        sql('products/drop.sql'),
    select:      sql('products/select.sql'),
    getByUnitId: sql('products/getByUnitId.sql'),
    getByBranchId: sql('products/getByBranchId.sql'),
    getByName:   sql('products/getByName.sql'),
    getById:     sql('products/getById.sql'),
    getWithPrepUnitData:  sql('products/getWithPrepUnitData.sql'),
    getWithOverrides: sql('products/selectWithOverrides.sql'),
  },
  branch_stock_rules: {
    create:             sql('branch_stock_rules/create.sql'),
    drop:               sql('branch_stock_rules/drop.sql'),
    get:                sql('branch_stock_rules/get.sql'),
    getByUnitProductId: sql('branch_stock_rules/getByUnitProductId.sql'),
    update:             sql('branch_stock_rules/update.sql'),
    delete:             sql('branch_stock_rules/delete.sql'),
  },
  last_login: {
    create:   sql('last_login/create.sql'),
    drop:     sql('last_login/drop.sql'),
    add:   sql('last_login/insert.sql'),
    delete:   sql('last_login/delete.sql'),
    get_login_uid: sql('last_login/get_login_uid.sql'),
    get_previous_login_date: sql('last_login/get_previous_login_date.sql'),
  },
  branch_stock_delivery_date: {
    create: sql('branch_stock_delivery_date/create.sql'),
    drop: sql('branch_stock_delivery_date/drop.sql'),
    delete: sql('branch_stock_delivery_date/delete.sql'),
    get: sql('branch_stock_delivery_date/get.sql'),
    update: sql('branch_stock_delivery_date/update.sql'),
    selectMaxDate: sql('branch_stock_delivery_date/selectMaxDate.sql'),
    getProductWithOverride: sql('branch_stock_delivery_date/getProductWithOverride.sql'),
    getBranchDelivery: sql('branch_stock_delivery_date/getBranchDelivery.sql'),
    deliveryReport: sql('branch_stock_delivery_date/deliveryReport.sql'),
    deliveryReportByBranch: sql('branch_stock_delivery_date/deliveryReportByBranch.sql'),
    inventoryCountingReport: sql('branch_stock_delivery_date/inventoryCountingReport.sql'),
    getMaxCountProductInBranch: sql('branch_stock_delivery_date/getMaxCountProductInBranch.sql'),

    getMaxCountingDate: sql('branch_stock_delivery_date/getMaxCountingDate.sql'),
    countedButNotDelivered: sql('branch_stock_delivery_date/delivery_types/countedButNotDelivered.sql'),
    countingToday: sql('branch_stock_delivery_date/delivery_types/countingToday.sql'),
    deliveredLessThanMinStock: sql('branch_stock_delivery_date/delivery_types/deliveredLessThanMinStock.sql'),
    notCountedAndNotDelivered: sql('branch_stock_delivery_date/delivery_types/notCountedAndNotDelivered.sql'),
    notCountedButDeliveredAndFinalized: sql('branch_stock_delivery_date/delivery_types/notCountedButDeliveredAndFinalized.sql'),

  },
  prices: {
      create: sql('prices/create.sql'),
      drop: sql('prices/drop.sql'),
      findByProductId: sql('prices/findByProductId.sql'),
      updatePriceOfProduct: sql('prices/updatePriceOfProduct.sql')
  }
};
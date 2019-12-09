// updated table branch_stock_delivery_date added 2 column (ref_type_id and ref_id)

const env = require('../../env');

const chooseDb = (isTest) => isTest ? env.testDb : env.db;

const runQuery = async () => {
    
    const devDb = chooseDb(false);
    const dbs = [devDb];
  
    for (let index = 0; index < dbs.length; index++) {
        const db = dbs[index];
        await db.any(`ALTER TABLE branch_stock_delivery_date ADD COLUMN IF NOT EXISTS ref_type_id integer default null`);
        await db.any(` 
            ALTER TABLE branch_stock_delivery_date DROP CONSTRAINT IF EXISTS fk_stock_ref;  
            ALTER TABLE branch_stock_delivery_date ADD COLUMN IF NOT EXISTS ref_id integer;  
            ALTER TABLE branch_stock_delivery_date ADD CONSTRAINT fk_stock_ref FOREIGN KEY (ref_id) REFERENCES branch_stock_delivery_date(bsddid)`
        );
    }
    
    process.exit(1);
}

runQuery();

// updated table units added one column (is_reporter)

const env = require('../../env');

const chooseDb = (isTest) => isTest ? env.testDb : env.db;

const runQuery = async () => {
    
    const devDb = chooseDb(false);
    const dbs = [devDb];
  
    for (let index = 0; index < dbs.length; index++) {
        const db = dbs[index];
        await db.any(`ALTER TABLE units ADD COLUMN IF NOT EXISTS is_reporter boolean default false`);
    }
    
    process.exit(1);
}

runQuery();

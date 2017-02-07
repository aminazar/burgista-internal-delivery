/**
 * Created by Ali on 2/5/2017.
 */

const env = require('../../env');
const sql = require('../../sql');

describe("Test 'units' table", () => {
  let unit_id;
  let branchUnit_id = [];
  let prepUnit_id;
  beforeAll((done) => {
    sql.test.units.create()
      .then(() => {
        done();
      })
      .catch((err) => {
        console.log(err.message);
        done();
      });
  });

  it("Should add a row to the table", (done) => {
    sql.test.units.add({
      name: 'Ali Alavi',
      username: 'aalavi',
      secret: 'qwerty',
      is_branch: true
    })
      .then((res) => {
        expect(typeof res.uid).toBe('number');
        unit_id = res.uid;
        done();
      })
      .catch((err) => {
        fail(err.message);
        done();
      });
  });

  it("Should get a row in the table by name", (done) => {
    if (unit_id) {
      sql.test.units.get({username: 'aalavi'})
        .then((res) => {
          expect(res[0].uid).toBe(unit_id);
          done();
        })
        .catch((err) => {
          fail(err.message);
          done();
        });
    }
  });

  // it("Should get a row in the table by id", (done) => {
  //     if(unit_id){
  //         sql.test.units.getById({uid: unit_id})
  //             .then((res) => {
  //                 expect(res[0].name).toBe('Ali Alavi');
  //                 done();
  //             })
  //             .catch((err) => {
  //                 fail(err.message);
  //                 done();
  //             });
  //     }
  // });

  // it("Should get a row in the table by username", (done) => {
  //     if(unit_id){
  //         sql.test.units.getByUsername({username: 'aalavi'})
  //             .then((res) => {
  //                 expect(res[0].uid).toBe(unit_id);
  //                 done();
  //             })
  //             .catch((err) => {
  //                 fail(err.message);
  //                 done();
  //             })
  //     }
  // });

  it("Should throw error when adding new record with exist username", (done) => {
    if (unit_id) {
      sql.test.units.add({
        name: 'Taghi Alavi',
        username: 'aalavi',
        secret: 'qwerty',
        is_branch: true
      })
        .then((res) => {
          fail('Have not add new record with exist username');
          done();
        })
        .catch((err) => {
          done();
        });
    }
  });

  it("Should throw error when adding new record with exist name", (done) => {
    if (unit_id) {
      sql.test.units.add({
        name: 'Ali Alavi',
        username: 'test',
        secret: 'qwerty',
        is_branch: true
      })
        .then((res) => {
          fail('Have not add new record with exist name');
          done();
        })
        .catch((err) => {
          done();
        });
    }
  });

  it("Should update name of a row in the table", (done) => {
    if (unit_id) {
      sql.test.units.update({name: 'Taghi Taghavi'}, unit_id)
        .then((res) => {
          expect(res).toBeTruthy();
          done();
        })
        .catch((err) => {
          fail(err.message);
          done();
        });
    }
  });

  it("Should get a row in the table by name", (done) => {
    if (unit_id) {
      sql.test.units.get({username: 'aalavi'})
        .then((res) => {
          expect(res[0].uid).toBe(unit_id);
          done();
        })
        .catch((err) => {
          fail(err.message);
          done();
        })
    }
  });

  it("Should add a row to the table", (done) => {
    sql.test.units.add({
      name: 'Ali Alavi',
      username: 'test',
      secret: 'qwerty',
      is_branch: true
    })
      .then((res) => {
        expect(typeof res.uid).toBe('number');
        unit_id = res.uid;
        done();
      })
      .catch((err) => {
        fail(err.message);
        done();
      });
  });

  it("Should add two branch unit", (done) => {
    sql.test.units.add({
      name: 'firstBranch',
      username: 'john',
      secret: 'qwerty',
      is_branch: true
    })
      .then((res) => {
        expect(typeof res.uid).toBe('number');
        branchUnit_id.push(res.uid);

        sql.test.units.add({
          name: 'secondBranch',
          username: 'jack',
          secret: 'qwerty',
          is_branch: true
        })
          .then((result) => {
            expect(typeof result.uid).toBe('number');
            branchUnit_id.push(result.uid);
            done();
          })
          .catch((error) => {
            fail(error.message);
            done();
          });
      })
      .catch((err) => {
        fail(err.message);
        done();
      });
  });

  it("Should add one prep unit", (done) => {
    sql.test.units.add({
      name: 'firstPrep',
      username: 'joe',
      secret: 'qwerty',
      is_branch: false
    })
      .then((res) => {
        expect(typeof res.uid).toBe('number');
        prepUnit_id = res.uid;
        done();
      })
      .catch((err) => {
        fail(err.message);
        done();
      });
  });

  afterAll((done) => {
    if (unit_id)
      sql.test.units.drop()
        .then(() => {
          done();
        })
        .catch((err) => {
          console.log(err.message);
          done();
        });
    else
      done();
  });
});
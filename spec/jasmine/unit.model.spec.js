/**
 * Created by Amin on 01/02/2017.
 */
const Unit = require('../../lib/unit.model.js');
const sql = require('../../sql');

describe("Unit model", ()=> {
  let uid;
  let u = new Unit(true);
  let newU = new Unit(true);
  const name = 'Ali';
  const username = 'Ali Alavi';
  const pwd = 'testPwd';
  const isBranch = true;


  beforeAll(done=> {
    sql.test.units.create()
      .then(() => {
        sql.test.units.add({
          name: name,
          username: username.toLowerCase(),
          secret: pwd,
          is_branch: isBranch
        })
      .then(res => {
        uid = res.uid;
        done();
        });
      })
      .catch(err => {
        console.log(err.message);
        done();
      });
  });

  it("should load from db", done=> {
    u.load(username, pwd)
      .then(res=> {
        expect(res.uid).toBe(uid);
        expect(u.uid).toBe(uid);
        done();
      })
      .catch(err=> {
        fail(err.message);
        done();
      });
  });

  // it("should fail on password check initially", done=> {
  //     u.checkPassword()
  //         .then(()=> {
  //             fail("succeeded!");
  //             done();
  //         })
  //         .catch(err=> {
  //             expect(err.message).toBe("No password is set up");
  //             done()
  //         });
  // });

  it("should save unit", done=> {
    u.exportData()
      .then((data)=> {
        expect(data.username).toBe(username.toLowerCase());
        expect(data.secret).toBeTruthy();
        expect(data.secret === pwd).toBeFalsy();
        done();
      })
      .catch(err=> {
        fail(err.message);
        done();
      });
  });

  it("should matches password after hashing", done=> {
    u.checkPassword()
      .then(()=> {
        done();
      })
      .catch(err=> {
        fail(err);
        done()
      });
  });

  it("should export name and hashed password", done=> {
    u.username += '.x';
    u.save()
      .then(data=> {
        expect(data).toBe(uid);
        done();
      })
      .catch(err=> {
        fail(err.message);
        done()
      });
  });

  it("should reload the unit after saving", done=> {
    newU.load(username + '.x', pwd)
      .then(()=> {
        expect(newU.uid).toBe(uid);
        done();
      })
      .catch(err=> {
        fail(err.message);
        done();
      })
  });

  it("should match password after hashing", done=> {
    newU.checkPassword()
      .then(()=> {
        done();
      })
      .catch(err=> {
        fail(err);
        done()
      });
  });

  it("should mismatch wrong password", done=> {
    newU.password += 'x';
    newU.checkPassword()
      .then(()=> {
        fail('It matches!');
        done();
      })
      .catch(err=> {
        expect(err.message).toBe('Incorrect password');
        done();
      });
  });

  it("should login with different letter case of username", done=> {
    newU = new Unit(true);
    newU.loginCheck(username.toLowerCase() + '.X', pwd)
      .then(()=> {
        expect(true).toBeTruthy();
        done();
      })
      .catch(err=> {
        fail(err.message);
        done();
      })
  });

  it("should login with correct password", done=> {
    newU = new Unit(true);
    newU.loginCheck(username + '.x', pwd)
      .then(()=> {
        expect(true).toBeTruthy();
        done();
      })
      .catch(err=> {
        fail(err.message);
        done();
      })
  });

  it("should not be an admin", ()=> {
    expect(newU.is_admin).toBe(false);
  });

  it("should maintain unique name", done=> {
    u = new Unit(true);

    u.username = username.toLowerCase() + '.x';
    u.name = name;
    u.password = pwd;
    u.is_branch = isBranch;

    u.save()
      .then(()=> {
        fail('inserted the same name twice');
        done();
      })
      .catch((err)=> {
        expect(err.message).toContain('duplicate key value');
        done();
      });
  });


  it("should save login_date after successful login", done=> {
  Unit.saveDateAfterLogin(username,isBranch,1)
    .then((res) => {
      expect(res).toBeTruthy();
      expect(res.user).toBe('Ali Alavi');
      expect(res.userType).toBe('branch');
      done();
    })
    .catch((err) => {
      fail(err.message);
      done();
    });

});


  afterAll((done) => {
    if(uid) {
      sql.test.units.drop()
        .then(() => {
          done();
        })
        .catch((err) => {
          console.log(err.message);
          fail(err.message);
          done();
        });
    }
    else
      done();
  })

});

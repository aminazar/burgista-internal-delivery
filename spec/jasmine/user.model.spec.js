/**
 * Created by Amin on 01/02/2017.
 */
const User = require('../../lib/user.model');
const sql = require('../../sql');

describe("User model", ()=> {
  let uid;
  let u = new User(true);
  let newU = new User(true);
  const name = 'Ali';
  const username = 'Ali Alavi';
  const pwd = 'testPwd';
  const type = true;

  beforeAll(done=> {
    sql.test.units.create()
      .then(() => {
        sql.test.units.add({
          name: name,
          username: username.toLowerCase(),
          secret: pwd,
          branch_or_prep: type
        })
          .then(res=> {
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

  it("should save user", done=> {
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

  it("should exports name and hashed password", done=> {
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

  it("should reload the user after saving", done=> {
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
    newU = new User(true);
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
    newU = new User(true);
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
    u = new User(true);

    u.username = username.toLowerCase() + '.x';
    u.name = name;
    u.secret = pwd;
    u.branch_or_prep = type;

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

  it("shoule leave empty secret for empty password", ()=> {
    expect(u.secret).toBe('');
  });

  it("should fail to match empty password", done=> {
    u.checkPassword()
      .then(()=> {
        fail('succeeded!');
        done();
      })
      .catch(err=> {
        expect(err.message).toBe('No password is set up');
        done();
      })
  });
});
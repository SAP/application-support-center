var common = require('../common');
var chai = common.chai;
var app = common.app;
var db = common.db;

describe('user_settings.test', () => {
  describe('api/v1/user_settings', () => {
    before(() => {
      db.any('INSERT into user_settings values (\'ABC17772\', \'test_value\', \'12\')');
    });

    it('createUserSetting: should create a new record', (done) => {
      let obj = {
        external_id: 'ABC17772',
        setting_name: 'favorite_apps',
        setting_value: '[1,2,3]'
      };
      chai.request(app)
        .post('/api/v1/user_settings')
        .send(obj)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          done();
        });
    });

    it('getAllUserSetting: should get all records', (done) => {
      chai.request(app)
        .get('/api/v1/user_settings/ABC17772')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });

    it('updateUserSetting: should update a record', (done) => {
      let obj = {
        setting_value: '[1,2,4]'
      };
      chai.request(app)
        .put('/api/v1/user_settings/ABC17772/favorite_apps')
        .send(obj)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          done();
        });
    });

    it('removeUserSetting: should delete a single record', (done) => {
      chai.request(app)
        .delete('/api/v1/user_settings/ABC17772/favorite_apps')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          done();
        });
    });
  });
});

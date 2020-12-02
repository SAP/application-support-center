var common = require('../common');
var chai = common.chai;
var app = common.app;
var keywordId;

describe('app_keywords.test', () => {
  describe('api/v1/apps/1', () => {
    it('createAppKeyword: should create a new record', (done) => {
      let obj = {
        keyword: 'Jamf',
        description: 'v1.0.0',
        app_id: 1
      };
      chai.request(app)
        .post('/api/v1/apps/' + common.appId + '/keywords')
        .send(obj)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          keywordId = res.body.data.keyword_id;
          done();
        });
    });

    it('getAllAppKeywords: should get all records', (done) => {
      chai.request(app)
        .get('/api/v1/apps/' + common.appId + '/keywords')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });

    it('updateAppKeyword: should update a record', (done) => {
      let obj = {
        keyword: 'v1.0.1'
      };
      chai.request(app)
        .put('/api/v1/apps/' + common.appId + '/keywords/' + keywordId)
        .send(obj)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          done();
        });
    });

    it('removeAppKeyword: should delete a single record', (done) => {
      chai.request(app)
        .delete('/api/v1/apps/' + common.appId + '/keywords/' + keywordId)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          done();
        });
    });
  });
});

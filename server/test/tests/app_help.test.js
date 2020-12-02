var common = require('../common');
var chai = common.chai;
var app = common.app;
var helpId;

describe('app_help.test', () => {
  describe('api/v1/apps/1', () => {
    it('createAppHelp: should create a new record', (done) => {
      let obj = {
        title: 'How do I add a new chat',
        description: 'some long text',
        app_id: 1
      };
      chai.request(app)
        .post('/api/v1/apps/' + common.appId + '/help')
        .send(obj)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          helpId = res.body.data.help_id;
          done();
        });
    });

    it('getAllAppHelp: should get all records', (done) => {
      chai.request(app)
        .get('/api/v1/apps/' + common.appId + '/help')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });

    it('getSingleAppHelp: should get a single record', (done) => {
      chai.request(app)
        .get('/api/v1/apps/' + common.appId + '/help/' + helpId)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('help_id').eql(helpId);
          done();
        });
    });

    it('updateAppHelp: should update a record', (done) => {
      let obj = {
        title: 'HOW DO I DELETE A CHAT'
      };
      chai.request(app)
        .put('/api/v1/apps/' + common.appId + '/help/' + helpId)
        .send(obj)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          done();
        });
    });

    it('removeAppHelp: should delete a single record', (done) => {
      chai.request(app)
        .delete('/api/v1/apps/' + common.appId + '/help/' + helpId)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          done();
        });
    });
  });
});

var common = require('../common');
var chai = common.chai;
var app = common.app;
var announcementId;

describe('app_Announcements.test', () => {
  describe('api/v1/apps/1', () => {
    it('createAppAnnouncements: should create a new record', (done) => {
      let obj = {
        title: 'Upcoming upgrade',
        description: 'Upgrade notes',
        app_id: 1
      };
      chai.request(app)
        .post('/api/v1/apps/1/announcements')
        .send(obj)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          announcementId = res.body.data.announcement_id;
          done();
        });
    });

    it('getAllAppAnnouncements: should get all records', (done) => {
      chai.request(app)
        .get('/api/v1/apps/' + common.appId + '/announcements')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });

    it('getSingleAppAnnouncements: should get a single record', (done) => {
      chai.request(app)
        .get('/api/v1/apps/' + common.appId + '/announcements/' + announcementId)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('announcement_id').eql(announcementId);
          done();
        });
    });

    it('updateAppAnnouncements: should update a record', (done) => {
      let obj = {
        title: 'Upcoming upgrade cancelled'
      };
      chai.request(app)
        .put('/api/v1/apps/' + common.appId + '/announcements/' + announcementId)
        .send(obj)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          done();
        });
    });

    it('removeAppAnnouncements: should delete a single record', (done) => {
      chai.request(app)
        .delete('/api/v1/apps/' + common.appId + '/announcements/' + announcementId)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          done();
        });
    });
  });
});

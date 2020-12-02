var common = require('../common');
var chai = common.chai;
var app = common.app;

describe('startup', () => {
  it('createApp: should create a new record', (done) => {
    let obj = {
      app_name: 'Easy Connect'
    };
    chai.request(app)
      .post('/api/v1/apps')
      .send(obj)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        common.appId = res.body.data.app_id;
        done();
      });
  });
  it('createContact: should create a new record', (done) => {
    let obj = {
      external_id: 'ABC17772',
      first_name: 'Rodney',
      last_name: 'Johnson',
      email: 'rodney.johnson@mycompany.com'
    };
    chai.request(app)
      .post('/api/v1/contacts')
      .send(obj)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        common.contactId = res.body.data.contact_id;
        done();
      });
  });
});

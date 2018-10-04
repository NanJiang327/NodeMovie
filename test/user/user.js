const sha1 = require('sha1');


const should = require('should');
const app = require('../../app');
const mongoose = require('mongoose');
const User = require('../../app/models/users')
let user;

// test
describe('<Unit Test', function() {
    describe('<Model User:', function() {
        before(function(done) {
            user = {
                name: 'jjsdasaidjwqn',
                password: sha1('password'),
            }

            done()
        })

        describe('Before Method save:', function() {
            it('should begin without test user', function(done) {
                User.find({name: user.name}, function(err, users) {
                    users.should.have.length(0);

                    done();
                })
            })
        })

        describe('User save method:', function() {
            it('should save without problems', function(done) {
                let _user = new User(user);
                _user.save(function(err) {
                    should.not.exist(err);
                    _user.remove(function(err) {
                        should.not.exist(err);
                        done()
                    })
                })
            })

            it('should password hashed', function(done) {
                const password = user.password
                let _user = new User(user);
                _user.save(function(err) {
                    should.not.exist(err);
                    _user.password.should.not.have.length(0);

                    _user.password.should.equal(password);
                    _user.remove(function(err) {
                        should.not.exist(err);
                        done()
                    })
                })
            })

            it('should have default role 0', function(done) {
                let _user = new User(user);
                _user.save(function(err) {
                    _user.role.should.equal(0)
                    _user.remove(function(err) {
                        should.not.exist(err);
                        done()
                    })
                })
            })

            it('should fail to save an existing user', function(done) {
                let _user = new User(user);

                _user.save(function(err) {
                    should.not.exist(err);

                    let _user2 = new User(user);

                    _user2.save(function(err) {
                        should.exist(err);
                        _user.remove(function(err) {
                            if (!err) {
                                _user2.remove(function(err) {
                                    done()
                                })
                            }
                        })
                    })
                });
            })
        })

        after(function(done) {
            done();
        })
    })
})

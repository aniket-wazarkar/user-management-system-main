const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');


// Enable sinon-chai integration
chai.use(sinonChai);

const User = require('../models/user');
const userRoutes = require('../routes/userRoutes');

describe('User Routes', () => {
    // ... Existing code
  
    describe('POST /', () => {
      it('should create a user and return user id', async () => {
        const saveStub = sinon.stub(User.prototype, 'save').resolves({ id: '123' });
  
        const req = { body: { name: 'John', lastName: 'Doe', age: 25, location: 'City', interests: ['Sports'], income: 50000 } };
        const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
  
        await userRoutes.createUserRoute(req, res);
  
        expect(saveStub).to.have.been.calledOnce;
        expect(res.status).to.have.been.calledWith(201);
        expect(res.json).to.have.been.calledWith({ userId: '123' });
  
        saveStub.restore();
      });
  
      it('should handle internal server error during user creation', async () => {
        const saveStub = sinon.stub(User.prototype, 'save').rejects(new Error('Some error'));
  
        const req = { body: { name: 'John', lastName: 'Doe', age: 25, location: 'City', interests: ['Sports'], income: 50000 } };
        const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
  
        await userRoutes.createUserRoute(req, res);
  
        expect(saveStub).to.have.been.calledOnce;
        expect(res.status).to.have.been.calledWith(500);
        expect(res.json).to.have.been.calledWith({ message: 'Internal Server Error' });
  
        saveStub.restore();
      });
    });
  
    describe('GET /', () => {
      it('should get all users', async () => {
        const findStub = sinon.stub(User, 'find').resolves([{ id: '1', name: 'John' }, { id: '2', name: 'Jane' }]);
  
        const req = {};
        const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
  
        await userRoutes.getAllUsersRoute(req, res);
  
        expect(findStub).to.have.been.calledOnce;
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith([{ id: '1', name: 'John' }, { id: '2', name: 'Jane' }]);
  
        findStub.restore();
      });
  
      it('should handle internal server error during get all users', async () => {
        const findStub = sinon.stub(User, 'find').rejects(new Error('Some error'));
  
        const req = {};
        const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
  
        await userRoutes.getAllUsersRoute(req, res);
  
        expect(findStub).to.have.been.calledOnce;
        expect(res.status).to.have.been.calledWith(500);
        expect(res.json).to.have.been.calledWith({ message: 'Internal Server Error' });
  
        findStub.restore();
      });
    });
  
    describe('PUT /:userId', () => {
      it('should update a user by ID and return the updated user', async () => {
        const updateStub = sinon.stub(User, 'findByIdAndUpdate').resolves({ id: '123', name: 'Updated John' });
  
        const req = { params: { userId: '123' }, body: { name: 'Updated John', age: 26 } };
        const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
  
        await userRoutes.updateUserRoute(req, res);
  
        expect(updateStub).to.have.been.calledWith('123', { name: 'Updated John', age: 26 }, { new: true });
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json).to.have.been.calledWith({ id: '123', name: 'Updated John' });
  
        updateStub.restore();
      });
  
      it('should handle user not found scenario during update', async () => {
        const updateStub = sinon.stub(User, 'findByIdAndUpdate').resolves(null);
  
        const req = { params: { userId: '123' }, body: { name: 'Updated John', age: 26 } };
        const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
  
        await userRoutes.updateUserRoute(req, res);
  
        expect(updateStub).to.have.been.calledWith('123', { name: 'Updated John', age: 26 }, { new: true });
        expect(res.status).to.have.been.calledWith(404);
        expect(res.json).to.have.been.calledWith({ message: 'User not found' });
  
        updateStub.restore();
      });
  
      it('should handle internal server error during update', async () => {
        const updateStub = sinon.stub(User, 'findByIdAndUpdate').rejects(new Error('Some error'));
  
        const req = { params: { userId: '123' }, body: { name: 'Updated John', age: 26 } };
        const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
  
        await userRoutes.updateUserRoute(req, res);
  
        expect(updateStub).to.have.been.calledWith('123', { name: 'Updated John', age: 26 }, { new: true });
        expect(res.status).to.have.been.calledWith(500);
        expect(res.json).to.have.been.calledWith({ message: 'Internal Server Error' });
  
        updateStub.restore();
      });
    });
  });
  
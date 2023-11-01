const AuthService = require('../src/services/AuthService'); // Update the path to your AuthService file
const bcrypt = require('bcrypt'); 
// Mock dependencies (optional)
// require('../src/models/user');
const userModel = require('../src/models/user');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('nodemailer');
const jwt = require('jsonwebtoken');
describe('AuthService', () => {
  describe('isEmailExist', () => {
    it('should return true if email exists', async  () => {
      // userModel.findOne.mockResolvedValue({ email: 'test@example.com' });
      userModel.findOne = async () => ({ email: 'test@example.com' }) //jest.fn().mockReturnValue({ email: 'test@example.com' });
      AuthService.isEmailExist('test@example.com').then(result => expect(result).toBe(true))
      // expect(userModel.findOne ).toHaveBeenCalledWith({ email: 'test@example.com' });
      
    });
      
    it('should return false if email does not exist', async () => {
     
      userModel.findOne=async()=>( null);

      AuthService.isEmailExist('nonexistent@example.com').then(result =>  expect(result).toBe(false));
    
    });
   });

  describe('updateOne', () => {
    it('should update a document in the model', async () => {
      const model = require('../src/models/user');
      const filter = { _id: 'user_id' };
      const fields = { name: 'Updated Name' };
      const expectedResult = { nModified: 1 };

      model.updateOne = jest.fn().mockResolvedValue(expectedResult);

      const result = await AuthService.updateOne(model, filter, fields);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should find and return a document in the model', async () => {
      const model = require('../src/models/user');
      const argg = { email: 'test@example.com' };
      const expectedResult = { name: 'Test User' };

      model.findOne= jest.fn().mockResolvedValue(expectedResult);

      const result = await AuthService.findOne(model, argg);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testpassword';
      const hashedPassword = 'hashedPassword';

      bcrypt.hash=jest.fn().mockResolvedValue(hashedPassword);

      const result = await AuthService.hashPassword(password);
      expect(result).toEqual(hashedPassword);
    });
  });

  describe('createUser', () => {
    it('should create a user object', async () => {
      const name = 'Test User';
      const email = 'test@example.com';
      const passwordHashed = 'hashedPassword'; // Simulated hashed password
      const phoneNumber = 1234567890;
      const address = '123 Main St';
      const image = 'photo.png';
      const role = 'Livreur';
      const roleID = { _id: 'role_id' };

      const result = await AuthService.createUser(
        name,
        email,
        passwordHashed,
        phoneNumber,
        address,        
        role,
        roleID
      );
      
      expect({
        "address": result.address,
        "email": result.email,
        "image": "photo.png",
        "isDeleted": false,
        "isEmailVerfied": false,
        "isVerified": false,
        "name": result.name,
        "password": result.password,
        "phoneNumber": result.phoneNumber,
        role:roleID._id,
      }).toEqual({
        name,
        email,
        password: passwordHashed,
        phoneNumber,
        address,
        image,
        role: roleID._id,
        isEmailVerfied: false,
        isVerified: false,
        isDeleted: false,
      });
    });
  });

  describe('generateToken', () => {
    it('should generate a token', () => {
      const user = { id: 'user_id' };
      const duree = '1h';
      const token = 'generatedToken'; // Simulated generated token

      jwt.sign.mockReturnValue(token);

      const result = AuthService.generateToken(user, duree);
      expect(result).toBe(token);
    });
  });


  describe('validateToken', () => {
    it('should validate a token', () => {
      const token = 'testtoken';
      const decodedToken = { user: 'testuser' };

      jwt.verify.mockReturnValue(decodedToken);

      const result = AuthService.validateToken(token);
      expect(result).toEqual({ success: 'Token is valid', data: decodedToken });
    });

    it('should handle invalid tokens', () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = AuthService.validateToken('invalidtoken');
      expect(result).toEqual({ error: 'Token is invalid' });
   });
  });
});

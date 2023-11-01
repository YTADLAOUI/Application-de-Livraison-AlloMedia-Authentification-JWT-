const AuthService = require('../src/services/AuthService'); // Update the path to your AuthService file

// Mock dependencies (optional)
require('../src/models/user');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('nodemailer');
const jwt = require('jsonwebtoken');
describe('AuthService', () => {
  describe('isEmailExist', () => {
    it('should return true if email exists', async () => {
      const userModel = require('../src/models/user');
      userModel.findOne.mockResolvedValue({ email: 'test@example.com' });

      const result = await AuthService.isEmailExist('test@example.com');
      expect(result).toBe(true);
    });

    it('should return false if email does not exist', async () => {
      const userModel = require('../src/models/user');
      userModel.findOne.mockResolvedValue(null);

      const result = await AuthService.isEmailExist('nonexistent@example.com');
      expect(result).toBe(false);
    });
  });

  describe('updateOne', () => {
    it('should update a document in the model', async () => {
      const model = require('../src/models/user');
      const filter = { _id: 'user_id' };
      const fields = { name: 'Updated Name' };
      const expectedResult = { nModified: 1 };

      model.updateOne.mockResolvedValue(expectedResult);

      const result = await AuthService.updateOne(model, filter, fields);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should find and return a document in the model', async () => {
      const model = require('../src/models/user');
      const argg = { email: 'test@example.com' };
      const expectedResult = { name: 'Test User' };

      model.findOne.mockResolvedValue(expectedResult);

      const result = await AuthService.findOne(model, argg);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testpassword';
      const hashedPassword = 'hashedPassword';

      bcrypt.hash.mockResolvedValue(hashedPassword);

      const result = await AuthService.hashPassword(password);
      expect(result).toEqual(hashedPassword);
    });
  });

  describe('createUser', () => {
    it('should create a user object', async () => {
      const name = 'Test User';
      const email = 'test@example.com';
      const passwordHashed = 'hashedPassword'; // Simulated hashed password
      const phoneNumber = '1234567890';
      const address = '123 Main St';
      const image = 'profile.jpg';
      const role = 'Livreur';
      const roleID = { _id: 'role_id' };

      const result = await AuthService.createUser(
        name,
        email,
        passwordHashed,
        phoneNumber,
        address,
        image,
        role,
        roleID
      );

      expect(result).toEqual({
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

const { register } = require("../src/controllers/authController");
const userModel = require('../src/models/user');
const roleModel = require('../src/models/role');
const bcrypt = require('bcrypt');
const Config = require('../src/config/config');

const mockRequest = (body) => ({ body });
const mockResponse = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock('../src/models/user');
jest.mock('../src/models/role');
jest.mock('bcrypt');

jest.mock('../src/config/config', () => {
  return {
    generateToken: jest.fn(),
    sendEmail: jest.fn(),
  };
});

describe('register', () => {
  it('should return a success message when registration is successful', async () => {
    const req = mockRequest({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password',
      phoneNumber: '1234567890',
      address: '123 Main St',
      image: 'avatar.jpg',
      role: 'client',
    });
    const res = mockResponse();
    userModel.findOne.mockResolvedValue(null);
    roleModel.findOne.mockResolvedValue({ _id: 'role_id' });
    bcrypt.hash.mockResolvedValue('hashed_password');
    userModel.prototype.save.mockResolvedValue({
      _id: 'user_id',
      name: 'John Doe',
      email: 'johndoe@example.com',
      phoneNumber: '1234567890',
      address: '123 Main St',
      image: 'avatar.jpg',
      role: 'role_id',
      isEmailVerified: false,
      isVerified: true,
      isDeleted: false,
    });
    Config.generateToken.mockReturnValue('mocked_token');
    Config.sendEmail.mockResolvedValue('Email sent successfully');

    await register(req, res);

expect(res.json).toHaveBeenCalledWith({ message: 'check your email' });
expect(res.status).not.toHaveBeenCalled();
expect(Config.generateToken).toHaveBeenCalledWith(
  expect.objectContaining({
    name: 'John Doe',
    email: 'johndoe@example.com',
  }),
  '10m'
);
expect(Config.sendEmail).toHaveBeenCalled();
  });

  it('should return an error message when a user with the same email already exists', async () => {
    const req = mockRequest({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: 'password123',
      phoneNumber: '9876543210',
      address: '456 Elm St',
      image: 'avatar2.jpg',
      role: 'user',
    });
    const res = mockResponse();

    userModel.findOne.mockResolvedValue({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      phoneNumber: '9876543210',
      address: '456 Elm St',
      image: 'avatar2.jpg',
      role: 'role_id',
      isEmailVerified: false,
      isVerified: true,
      isDeleted: false,
    });

    await register(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: 'Cet utilisateur existe déjà.' });
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return an error message when required fields are missing', async () => {
    const req = mockRequest({
      name: '', // Missing name
      email: 'johndoe@example.com',
      password: 'password',
      phoneNumber: '1234567890',
      address: '123 Main St',
      image: 'avatar.jpg',
      role: 'user',
    });
    const res = mockResponse();
  
    await register(req, res);
  
    expect(res.json).toHaveBeenCalledWith({ message: "s'il vous plait remplie tout les champs" });
    expect(res.status).not.toHaveBeenCalled();
  });
  

  it('should handle and return an error message when an exception occurs', async () => {
    const req = mockRequest({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password',
      phoneNumber: '1234567890',
      address: '123 Main St',
      image: 'avatar.jpg',
      role: 'user',
    });
    const res = mockResponse();
  
    userModel.findOne = jest.fn().mockRejectedValue(new Error('Some error'));
  
    await register(req, res);
  
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Une erreur s'est produite lors de l'inscription." });
  });
  
});

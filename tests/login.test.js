const { login } = require("../src/controllers/authController");
const userModel = require('../src/models/user');
const bcrypt = require('bcrypt');

const mockRequest = (body) => ({ body });
const mockResponse = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock('../src/models/user');
jest.mock('bcrypt');

describe('login', () => {
  it('should log in a user with valid credentials', async () => {
    const req = mockRequest({
      email: 'johndoe@example.com',
      password: 'password',
    });
    const res = mockResponse();
    
    // Mock the user with valid credentials
    userModel.findOne.mockResolvedValue({
      email: 'johndoe@example.com',
      password: 'hashed_password', 
    });

    bcrypt.compare.mockResolvedValue(true); 
    
    await login(req, res);
    
    expect(res.status).not.toHaveBeenCalled(); 
  });

  it('should handle invalid credentials', async () => {
    const req = mockRequest({
      email: 'johndoe@example.com',
      password: 'invalid_password',
    });
    const res = mockResponse();

    
    userModel.findOne.mockResolvedValue({
      email: 'johndoe@example.com',
      password: 'hashed_password', 
    });

    bcrypt.compare.mockResolvedValue(false); 

    await login(req, res);
    
    expect(res.status).toHaveBeenCalledWith(401); 
  });


});

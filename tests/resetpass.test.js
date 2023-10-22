const { restPassword } = require("../src/controllers/authController");
const userModel = require('../src/models/user');
const bcrypt = require('bcrypt');
const Config = require('../src/config/config');

const mockRequest = (params, body) => ({ params, body });
const mockResponse = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock('../src/models/user');
jest.mock('bcrypt');

jest.mock('../src/config/config', () => {
  return {
    validateToken: jest.fn(),
    generateToken: jest.fn(),
  };
});

describe('restPassword', () => {
  it('should reset the password for a user with a valid token and password', async () => {
    const req = mockRequest({ token: 'valid_token' }, { password: 'new_password' });
    const res = mockResponse();

    
    Config.validateToken.mockReturnValue({ data: { user: { _id: 'user_id' } } });

    
    userModel.findOne.mockResolvedValue({ _id: 'user_id' });

    
    bcrypt.hash.mockResolvedValue('new_hashed_password');

    await restPassword(req, res);

  
  });

  it('should handle invalid or expired tokens', async () => {
    const req = mockRequest({ token: 'invalid_token' }, { password: 'new_password' });
    const res = mockResponse();

    
    Config.validateToken.mockReturnValue({ error: 'Invalid token' });

    await restPassword(req, res);

   
  });
});

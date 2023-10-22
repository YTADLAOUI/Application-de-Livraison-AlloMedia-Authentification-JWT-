const { forgetPassword } = require("../src/controllers/authController");
const userModel = require('../src/models/user');
const Config = require('../src/config/config');

const mockRequest = (body) => ({ body });
const mockResponse = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock('../src/models/user');
jest.mock('../src/config/config', () => {
  return {
    generateToken: jest.fn(),
    sendEmail: jest.fn(),
  };
});

describe('forgetPassword', () => {
  it('should send a password reset email for a valid email', async () => {
    const req = mockRequest({ email: 'valid_email@example.com' });
    const res = mockResponse();

    
    userModel.findOne.mockResolvedValue({ email: 'valid_email@example.com' });

    Config.generateToken.mockReturnValue('valid_token');

    await forgetPassword(req, res);

  });

  it('should handle invalid or non-existent emails', async () => {
    const req = mockRequest({ email: 'invalid_email@example.com' });
    const res = mockResponse();

    userModel.findOne.mockResolvedValue(null);

    await forgetPassword(req, res);

  });
});
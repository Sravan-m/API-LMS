const request = require('supertest')
const app = require('../app')


describe('Post data to api/auth/mlogin', () => {
  it("Valid details", async (done) => {
    const res = await request(app)
    .post('/api/auth/mlogin')
      .send({
              "email": "deepakbhimavarapu@msitprogram.net",
              "accessToken": "ya29.a0Ae4lvC1k0TpF-AbXpOUH5HlvrAvneDvE5ioqgkxYEqjukK_m9JnRsm5h6Nl16Okgq6EkuXtVSn_GkNYuzMxdRglUnvWXmLy9eC_irzqNzfSenKjdRcjE1gY-iDExE9EKWDKAXfxvFuc4WyzuUROSSQHLOaOfkD073NM"
            })
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('valid');
      done();
  });
 it("invalid details", async (done) => {
      const res = await request(app)
      .post('/api/auth/mlogin')
        .send({
          "email": "manikanta.a@msitprogram.net",
          "accessToken": "ya29.a0Ae4lvC2SURcrN3RMXngtcd_0dLQFoQ3hsFdbfDkEuy2ahB-0ujZhvfSu1zw-KtTPqQp0URCC0pYJiMCEt9I8vw62-ZwxYyraeo1MjazuUn58Y_GpBCLMIFwrDRMp1JxFfqiuhm5KjjFS1aHjRK_86epdzBJa0g_YC5M"
        })
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error');
        done();
  });
  
})
  

  





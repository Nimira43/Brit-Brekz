import jwt from 'jsonwebtoken'
import config from '../configuration/env.config.js'

class JwtHelper {
  static async generateToken(data) {
    const appConfig = config

    return new Promise((resolve, _reject) => {
      const signOptions = {
        issuer: `${appConfig.server_token_issuer}`,
        subject: `${appConfig.app_name}. [Author: nimiratech]`,
        algorithm: 'HS256',
        audience: ['Europe'],
      }

      signOptions.expiresIn = appConfig.token_expiry_time

      jwt.sign(data, `${appConfig.server_token_secret}`, signOptions, (err, token) => {
        if (err) {
          console.error(err.message)
        }

        resolve(token)
      })
    })
  }
}

export default JwtHelper
import * as crypto from "crypto"

export class PasswordUtils {
    static async hashPassword(password: string): Promise<string> {
        return await new Promise((resolve, reject) => {
           crypto.pbkdf2(password, 'salt', 10000, 64, 'sha512', (err, derivedKey) =>{
              if (err) reject(err);
              resolve(derivedKey.toString('hex'));
           });
        });
    }
}
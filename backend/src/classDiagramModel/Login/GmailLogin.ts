import { Account } from '../Account';
import { ILogin } from './ILogin';
import bcrypt from 'bcrypt';

export class GmailLogin implements ILogin {

  public constructor() {

  }


  public async login(email: string, password: string): Promise<any> {
    /// code login by gmail here
    const existingUser = await Account.findUserByEmail(email);
    if(existingUser){
      const isMatchPassword = await bcrypt.compare(password, existingUser.password);
      return {
        existingUser,
        isMatchPassword
      };
    }

    return {
      existingUser,
      isMatchPassword: false,
    }
    
    
  }

}
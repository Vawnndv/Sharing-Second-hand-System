import { ILogin } from './ILogin';
import { Account } from '../Account';

export class LoginGoogle implements ILogin {

  public constructor() {
        
  }

  public async login(email: string, password: string): Promise<any> {

    /// code phone login here
    const existingUser = await Account.findUserByEmail(email);
    
    return {
      existingUser
    };
  }
    
}
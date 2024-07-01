import { GmailLogin } from './Login/GmailLogin';
import { ILogin } from './Login/ILogin';

export class Guest {
  private loginMethod: ILogin;

  public constructor(loginMethod: ILogin) {
    this.loginMethod = loginMethod;
  }

  public setLoginMethod(method: ILogin): void {
    this.loginMethod = method;
  }

  public async login(email: string, password: string): Promise<any> {
    return await this.loginMethod.login(email, password);
  }

}
import { GmailLogin } from "./Login/GmailLogin";
import { ILogin } from "./Login/ILogin";

export class Guest {
    private loginMethod: ILogin;

    public constructor(loginMethod: ILogin){
        this.loginMethod = loginMethod;
    }

    public setLoginMethod(method: ILogin): void{
        this.loginMethod = method;
    }

    public login(username: string, password: string): void{
        this.loginMethod.login(username, password)
    }

}
import { ILogin } from "./ILogin";

export class GmailLogin implements ILogin {

    public constructor() {

    }

    public login(username: string, password: string): boolean{
        /// code login by gmail here
        return true
    }

}
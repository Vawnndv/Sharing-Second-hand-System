import { ILogin } from "./ILogin";

export class PhoneLogin implements ILogin {

    public constructor(){
        
    }

    public login(username: string, password: string): boolean{

        /// code phone login here
        return true;
    }
    
}
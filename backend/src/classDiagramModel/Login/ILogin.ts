export interface ILogin {
  login(email: string, password: string) : Promise<any>;
}
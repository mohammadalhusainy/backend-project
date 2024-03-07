export interface IUser {
    firstName: string;
    lastName: string;
    isAdmin: boolean;
    email: string;
    password: string;
    access_token: string;
    verifyToken:boolean;
    isPasswordMatched:Function
}
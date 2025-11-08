import { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
export declare class UserService {
    private userModel;
    constructor(userModel: Model<User>);
    findById(id: string): Promise<User>;
    updateProfile(id: string, updateData: Partial<User>): Promise<User>;
}

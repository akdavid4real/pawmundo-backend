import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getProfile(req: any): Promise<import("../auth/schemas/user.schema").User>;
    updateProfile(req: any, updateData: UpdateUserDto): Promise<import("../auth/schemas/user.schema").User>;
}

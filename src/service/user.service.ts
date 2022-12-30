import { UserModel } from "../schema/user.schema";

class UserService {
    async createUser(input: any){
        UserModel.create(input)
    }
}

export default UserService
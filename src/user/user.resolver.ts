import {Args, ID, Mutation, Query, Resolver} from "@nestjs/graphql";
import {UserEntity} from "./entities/user.entity";
import {UserService} from "./user.service";
import {CreateUserInput} from "./dto/create.user.input";
import {UpdateUserInput} from "./dto/update.user.input";
import {UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "../common/guards/jwt-auth.guard";
import {UserPermissionGuard} from "../common/guards/user.permission.guard";
import {UsePermissions} from "../common/decorators/permissions.decorator";
import {UserUpdatePermissions} from "../common/permissions/user/user.update.permissions";
import {UserDeletePermissions} from "../common/permissions/user/user.delete.permissions";

@Resolver(() => UserEntity)
export class UserResolver {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Query(() => UserEntity)
    @UseGuards(JwtAuthGuard)
    async getUserById(@Args('id', {type: () => ID}) id: number): Promise<UserEntity> {
        return this.userService.getUserById(id);
    }

    @Mutation(() => UserEntity)
    async register(@Args('createUserDto') createUserDto: CreateUserInput): Promise<UserEntity> {
        return this.userService.register(createUserDto);
    }

    @Mutation(() => UserEntity)
    @UseGuards(JwtAuthGuard, UserPermissionGuard)
    @UsePermissions(UserUpdatePermissions)
    async updateUser(@Args('id', {type: () => ID}) id: number, @Args('updateUserDto') updateUserDto: UpdateUserInput): Promise<UserEntity> {
        return this.userService.updateUser(id, updateUserDto);
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtAuthGuard, UserPermissionGuard)
    @UsePermissions(UserDeletePermissions)
    async deleteUser(@Args('id', {type: () => ID}) id: number): Promise<boolean> {
        await this.userService.deleteUser(id);
        return true;
    }
}
import { Test, TestingModule } from "@nestjs/testing";
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {CreateUserDto} from "./dto/create.user.dto";
import {UserEntity} from "./entities/user.entity";
import {Response} from "express";
import {
    ConflictException, ForbiddenException,
    HttpStatus, NotFoundException,
} from "@nestjs/common";
import {UserRoleEnum} from "../common/enums/user.role.enum";
import {ExceptionMessageEnum} from "../common/enums/exception.message.enum";
import {getRepositoryToken} from "@nestjs/typeorm";
import {UserStatusEntity} from "./entities/user-status.entity";
import {UpdateUserDto} from "./dto/update.user.dto";

jest.mock("./user.service");
jest.mock("../common/guards/jwt-auth.guard");
describe('UserController', () => {
    let userController: UserController;
    let userService: UserService;
    const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(UserEntity),
                    useClass: jest.fn(),
                },
                {
                    provide: getRepositoryToken(UserStatusEntity),
                    useClass: jest.fn(),
                },
            ],
        }).compile();

        userController = module.get(UserController);
        userService = module.get(UserService);
    });

    describe('register', () => {
        const createUserDto: CreateUserDto = {
            nickname: 'TestNickname',
            firstName: 'TestFirstName',
            lastName: 'TestLastName',
            password: 'testpass123',
        };
        it('register user and return 201 with user data in response', async () => {
           const registeredUser = {
               id: 1,
               nickname: 'TestNickname',
               firstName: 'TestFirstName',
               lastName: 'TestLastName',
               createdAt: new Date(),
               status: {
                   role: UserRoleEnum.BASIC,
                   isActive: true,
               },
               rating: 0,
           };

           (userService.register as jest.Mock).mockResolvedValue(registeredUser as UserEntity);

           // const res: Partial<Response> = {
           //     status: jest.fn().mockReturnThis(),
           //     json: jest.fn(),
           // };

           await userController.register(createUserDto, res as Response);

           expect(userService.register).toHaveBeenCalledWith(createUserDto);
           expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
           expect(res.json).toHaveBeenCalledWith({
               id: registeredUser.id,
               nickname: registeredUser.nickname,
               firstName: registeredUser.firstName,
               lastName: registeredUser.lastName,
               createdAt: registeredUser.createdAt.toISOString(),
               role: registeredUser.status.role,
               isActive: registeredUser.status.isActive,
               rating: 0,
           });
        });

        it('it should handle the error from db and return status 409 and message: User with this nickname already exists, choose another nickname!', async () => {
            (userService.register as jest.Mock).mockRejectedValue({
               code: '23505',
            });

            // const res: Partial<Response> = {
            //     status: jest.fn().mockReturnThis(),
            //     json: jest.fn(),
            // };

            try {
                await userController.register(createUserDto, res as Response);
            }
            catch (error) {
                expect(error).toBeInstanceOf(ConflictException);
                expect(error.message).toEqual(ExceptionMessageEnum.USER_ALREADY_EXISTS);
                expect(userService.register).toHaveBeenCalledWith(createUserDto);
                expect(res.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
                expect(res.json).toHaveBeenCalledWith({ message: ExceptionMessageEnum.USER_ALREADY_EXISTS });
            }
        });

        it('handles other errors with status 500, and error message in response', async () => {
            (userService.register as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

            // const res: Partial<Response> = {
            //     status: jest.fn().mockReturnThis(),
            //     json: jest.fn(),
            // };

            try {
                await userController.register(createUserDto, res as Response);
            }
            catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toEqual('Unexpected error');
                expect(userService.register).toHaveBeenCalledWith(createUserDto);
                expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
                expect(res.json).toHaveBeenCalledWith({ message: 'Unexpected error' });
            }
        });
    });

    describe('getUserById', () => {
        const userId = '1';
        it('returns 200 and user info',  async () => {
            const user = {
                id: userId,
                nickname: 'TestNickname',
                firstName: 'TestFirstName',
                lastName: 'TestLastName',
                createdAt: new Date(),
                status: {
                    role: UserRoleEnum.BASIC,
                    isActive: true,
                },
                rating: 0,
            };
            (userService.getUserById as jest.Mock).mockResolvedValue(user);

            await userController.getUserById(userId, res as Response);

            expect(userService.getUserById).toHaveBeenCalledWith(Number(userId));
            expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(res.json).toHaveBeenCalledWith({
                id: user.id,
                nickname: user.nickname,
                firstName: user.firstName,
                lastName: user.lastName,
                createdAt: user.createdAt.toISOString(),
                role: user.status.role,
                isActive: user.status.isActive,
                rating: user.rating,
            });
        });
        it('returns 404 if user not found or deleted', async () => {
            jest.spyOn(userService, "getUserById").mockRejectedValue(new NotFoundException(ExceptionMessageEnum.USER_NOT_FOUND));

            try{
                await expect(userController.getUserById(userId, res as Response)).rejects.toThrow(NotFoundException);

                expect(userService.getUserById).toHaveBeenCalledWith(Number(userId));
            }
            catch (error) {
                expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
                expect(res.json).toHaveBeenCalledWith({
                    message: ExceptionMessageEnum.USER_NOT_FOUND,
                    error: 'Not Found',
                    statusCode: HttpStatus.NOT_FOUND,
                });
            }
        });
        it('if users have isActive false it returns message is banned and status 401', async () => {
            jest.spyOn(userService, 'getUserById').mockRejectedValue(new ForbiddenException(ExceptionMessageEnum.USER_IS_BANNED));

            try {
                await expect(userController.getUserById(userId, res as Response)).rejects.toThrow(ForbiddenException);
                expect(userService.getUserById).toHaveBeenCalledWith(Number(userId));
            }
            catch (error) {
                expect(error).toBeInstanceOf(ForbiddenException);
                expect(error.message).toEqual(ExceptionMessageEnum.USER_IS_BANNED);
                expect(res.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
                expect(res.json).toHaveBeenCalledWith({
                    message: ExceptionMessageEnum.USER_IS_BANNED,
                    error: 'Unauthorized',
                    statusCode: HttpStatus.FORBIDDEN,
                });
            }
        });
    });
    describe('updateUser', () => {
        const updateUserDto = {
            nickname: 'ChangedNickname',
        };
        const userId = '1';
        it('returns 404 if user not found', async () => {
            jest.spyOn(userService, 'updateUser').mockRejectedValue(new NotFoundException(ExceptionMessageEnum.USER_NOT_FOUND));

            try {
                await expect(userController.updateUser(userId, updateUserDto as UpdateUserDto, res as Response)).rejects.toThrow(NotFoundException);
                expect(userService.updateUser).toHaveBeenCalledWith(Number(userId), updateUserDto);
            }
            catch (error) {
                expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
                expect(res.json).toHaveBeenCalledWith({
                    message: ExceptionMessageEnum.USER_NOT_FOUND,
                });
            }
        });
        it('returns 403 if user is banned (isActive=false) and message to contact admin', async () => {
            jest.spyOn(userService, 'updateUser').mockRejectedValue(new ForbiddenException(ExceptionMessageEnum.USER_IS_BANNED));

            try {
                await expect(userController.updateUser(userId, updateUserDto as UpdateUserDto, res as Response)).rejects.toThrow(ForbiddenException);
                expect(userService.updateUser).toHaveBeenCalledWith(Number(userId), updateUserDto);
            }
            catch (error) {
                expect(res.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
                expect(res.json).toHaveBeenCalledWith({
                    message: ExceptionMessageEnum.USER_IS_BANNED,
                });
            }
        });
        it('returns 409 and message that user already exists, handles error 23505 from db and throws conflict exception', async () => {
            jest.spyOn(userService, 'updateUser').mockRejectedValue({
                code: '23505',
            });

            try{
                await userController.updateUser(userId, updateUserDto as UpdateUserDto, res as Response);
                expect(userService.updateUser).toHaveBeenCalledWith(Number(userId), updateUserDto);
            }
            catch (error) {
                expect(error).toBeInstanceOf(ConflictException);
                expect(error.message).toEqual(ExceptionMessageEnum.USER_ALREADY_EXISTS);
                expect(res.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
                expect(res.json).toHaveBeenCalledWith({
                    message: ExceptionMessageEnum.USER_ALREADY_EXISTS,
                });
            }
        });
        it('returns 500 and error message if unexpected error got', async () => {
            jest.spyOn(userService, 'updateUser').mockRejectedValue(new Error('Unexpected error'));

            try {
                await userController.updateUser(userId, updateUserDto as UpdateUserDto, res as Response);
                expect(userService.updateUser).toHaveBeenCalledWith(Number(userId), updateUserDto);
            }
            catch (error) {
                expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
                expect(res.json).toHaveBeenCalledWith({
                    message: 'Unexpected error',
                });
            }
        });
        it('successfully updates user', async () => {
            const updatedUser = {
                id: 1,
                nickname: 'ChangedNickname',
                firstName: 'TestFirstName',
                lastName: 'TestLastName',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
                rating: 0,
                status: {
                    role: UserRoleEnum.BASIC,
                    isActive: true,
                },
            };
            jest.spyOn(userService, 'updateUser').mockResolvedValue(updatedUser as UserEntity);

            await userController.updateUser(userId, updateUserDto as UpdateUserDto, res as Response);

            expect(userService.updateUser).toHaveBeenCalledWith(Number(userId), updateUserDto);
            expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(res.json).toHaveBeenCalledWith({
                id: updatedUser.id,
                nickname: updatedUser.nickname,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                createdAt: updatedUser.createdAt.toISOString(),
                updatedAt: updatedUser.updatedAt,
                deletedAt: null,
                rating: 0,
                role: updatedUser.status.role,
                isActive: updatedUser.status.isActive,
            });
        });
    });

    describe('deleteUser', () => {
        const userId = '1';
        it('no user it returns 404 and message not found user', async () => {
            jest.spyOn(userService, 'deleteUser').mockRejectedValue(new NotFoundException(ExceptionMessageEnum.USER_NOT_FOUND));

            try {
                await expect(userController.deleteUser(userId, res as Response)).rejects.toThrow(NotFoundException);
                expect(userService.deleteUser).toHaveBeenCalledWith(Number(userId));
            }
            catch (error) {
                expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
                expect(res.json).toHaveBeenCalledWith({
                    message: ExceptionMessageEnum.USER_NOT_FOUND,
                });
            }
        });
        it('handles unexpected eroor and return 500', async () => {
            jest.spyOn(userService, 'deleteUser').mockRejectedValue(new Error('Unexpected error'));

            try{
                await expect(userController.deleteUser(userId, res as Response)).rejects.toThrow(Error);
                expect(userService.deleteUser).toHaveBeenCalledWith(Number(userId));
            }
            catch (error) {
                expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
                expect(res.json).toHaveBeenCalledWith({
                    message: 'Unexpected error',
                });
            }
        });
        it('successfully deletes user and returns 201', async () => {
            jest.spyOn(userService, 'deleteUser').mockResolvedValue(undefined);

            await userController.deleteUser(userId, res as Response);
            expect(userService.deleteUser).toHaveBeenCalledWith(Number(userId));
            expect(res.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
        });
    });
});



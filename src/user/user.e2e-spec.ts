import {
    ConflictException,
    ForbiddenException,
    HttpStatus,
    INestApplication,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import {UserService} from "./user.service";
import {UserEntity} from "./entities/user.entity";
import {Repository} from "typeorm";
import {UserStatusEntity} from "./entities/user-status.entity";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../app.module";
import {getRepositoryToken} from "@nestjs/typeorm";
import {ExceptionMessageEnum} from "../common/enums/exception.message.enum";
import {CreateUserDto} from "./dto/create.user.dto";
import * as request from 'supertest';
import {UserRoleEnum} from "../common/enums/user.role.enum";
import {JwtAuthGuard} from "../common/guards/jwt-auth.guard";
import {UserPermissionGuard} from "../common/guards/user.permission.guard";
import {MockUserPermissionGuard} from "../common/guards/test/mock.user.permission.guard";

describe('UserController e2e', () => {
    let app: INestApplication;
    let userService: UserService;
    let userRepository: Repository<UserEntity>;
    let userStatusRepository: Repository<UserStatusEntity>;

    const mockUserService = {
        register: jest.fn(),
        getUserById: jest.fn(),
        updateUser: jest.fn(),
        deleteUser: jest.fn(),
    };

    const basicUserInDb: UserEntity = {
        avatar: null,
        votes: [],
        updateDeletedAt(): void {},
        id: 1,
        nickname: 'basicUser',
        firstName: 'firstname',
        lastName: 'lastname',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        status: {
            role: UserRoleEnum.BASIC,
            isActive: true,
            isDeleted: false,
            id: 1,
            refreshToken: null,
            user: new UserEntity
        },
        rating: 0
    };

    const moderUserInDb = {
        avatar: null,
        votes: [],
        updateDeletedAt(): void {},
        id: 2,
        nickname: 'moderUser',
        firstName: 'firstname',
        lastName: 'lastname',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        status: {
            role: UserRoleEnum.MODER,
            isActive: true,
            isDeleted: false,
            id: 2,
            refreshToken: null,
            user: new UserEntity
        },
        rating: 0
    };

    const adminUserInDb = {
        avatar: null,
        votes: [],
        updateDeletedAt(): void {},
        id: 3,
        nickname: 'adminUser',
        firstName: 'firstname',
        lastName: 'lastname',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        status: {
            role: UserRoleEnum.ADMIN,
            isActive: true,
            isDeleted: false,
            id: 3,
            refreshToken: null,
            user: new UserEntity
        },
        rating: 0
    }

    const basicUser = {
        id: 1,
        role: UserRoleEnum.BASIC,
        token: '1.basic',
        user: basicUserInDb,
    }

    const moderUser = {
        id: 2,
        role: UserRoleEnum.MODER,
        token: '2.moder',
        user: moderUserInDb,
    }

    const adminUser = {
        id: 3,
        role: UserRoleEnum.ADMIN,
        token: '3.admin',
        user: adminUserInDb,
    }

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(UserService)
            .useValue(mockUserService)
            .overrideGuard(JwtAuthGuard)
            .useValue({
                canActivate: (ctx) => {
                    const authHeader = ctx.switchToHttp().getRequest().headers.authorization
                    if(!authHeader) {
                        throw new UnauthorizedException();
                    }
                    const token = authHeader.split(' ')[1];
                    return token === '1.basic' || token === '2.moder' || token === '3.admin';
                },
            })
            .overrideGuard(UserPermissionGuard)
            .useClass(MockUserPermissionGuard)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        userService = moduleFixture.get<UserService>(UserService);
        userRepository = moduleFixture.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
        userStatusRepository = moduleFixture.get<Repository<UserStatusEntity>>(getRepositoryToken(UserStatusEntity));
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST user/register', () => {
        const url = '/user/register';
        const createUserDto: CreateUserDto = {
            nickname: 'basicUser',
            firstName: 'firstname',
            lastName: 'lastname',
            password: 'testpass123',
        }
        it('returns 409 if nickname is already exists', async () => {
            mockUserService.register.mockRejectedValueOnce(new ConflictException(ExceptionMessageEnum.USER_ALREADY_EXISTS));

            const createDuplicateUserDto: CreateUserDto = {
                nickname: 'ExistingUser',
                firstName: 'Firstname',
                lastName: 'Surname',
                password: 'testpass123',
            };

            const res = await request(app.getHttpServer())
                .post(url)
                .send(createDuplicateUserDto)
                .expect(HttpStatus.CONFLICT);

            expect(res.body.message).toEqual(ExceptionMessageEnum.USER_ALREADY_EXISTS);
        });

        it('some unexpected error, status 500, error message', async () => {
            mockUserService.register.mockRejectedValueOnce(new Error('Unexpected error'));
            const res = await request(app.getHttpServer())
                .post(url)
                .send(createUserDto)
                .expect(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(res.body.message).toEqual('Unexpected error');
        });

        it('successful user creating, returns 201 and user data', async () => {
            mockUserService.register.mockResolvedValueOnce(basicUserInDb);
            const res = await request(app.getHttpServer())
                .post(url)
                .send(createUserDto)
                .expect(HttpStatus.CREATED);
            expect(res.body.nickname).toEqual(basicUserInDb.nickname);
            expect(res.body.firstName).toEqual(basicUserInDb.firstName);
            expect(res.body.lastName).toEqual(basicUserInDb.lastName);
            expect(res.body.id).toEqual(basicUserInDb.id);
            expect(res.body.password).toBeUndefined();
            expect(res.body.role).toEqual(basicUserInDb.status.role);
        });
    });

    describe('GET user/:id', () => {
        const url = '/user/1';
        it('try to  retrieve user info without jwt token, returns 401 and message Unauthorized', async () => {
            const res = await request(app.getHttpServer())
                .get(url)
                .expect(HttpStatus.UNAUTHORIZED);
            expect(res.body).toEqual({
                message: 'Unauthorized',
                statusCode: 401,
            });
        });

        it('authenticated user gets info about user, status 200 and user info', async () => {
            mockUserService.getUserById.mockResolvedValueOnce(basicUser.user);

            const res = await request(app.getHttpServer())
                .get(url)
                .set('Authorization', `Bearer ${basicUser.token}`)
                .expect(HttpStatus.OK);

            expect(res.body.nickname).toEqual(basicUserInDb.nickname);
            expect(res.body.firstName).toEqual(basicUserInDb.firstName);
            expect(res.body.lastName).toEqual(basicUserInDb.lastName);
            expect(res.body.id).toEqual(basicUserInDb.id);
            expect(res.body.password).toBeUndefined();
            expect(res.body.role).toEqual(basicUserInDb.status.role);
        });

        it('user tries to get unexisting user, returns 404 and message not found user', async () => {
            mockUserService.getUserById.mockRejectedValueOnce(new NotFoundException(ExceptionMessageEnum.USER_NOT_FOUND));

            const res = await request(app.getHttpServer())
                .get(url)
                .set('Authorization', `Bearer ${basicUser.token}`)
                .expect(HttpStatus.NOT_FOUND);
            expect(res.body).toEqual({
                error: 'Not Found',
                message: ExceptionMessageEnum.USER_NOT_FOUND,
                statusCode: 404,
            })
        });

        it('user tries to get banned user throws forbidden', async () => {
           mockUserService.getUserById.mockRejectedValueOnce(new ForbiddenException(ExceptionMessageEnum.USER_IS_BANNED));

           const res = await request(app.getHttpServer())
               .get(url)
               .set('Authorization', `Bearer ${basicUser.token}`)
               .expect(HttpStatus.FORBIDDEN);

           expect(res.body).toEqual({
               error: 'Forbidden',
               message: ExceptionMessageEnum.USER_IS_BANNED,
               statusCode: 403,
           })
        });

        it('user tries to get info but unexpected error happened, status 500', async () => {
            mockUserService.getUserById.mockRejectedValueOnce(new Error());
            const res = await request(app.getHttpServer())
                .get(url)
                .set('Authorization', `Bearer ${basicUser.token}`)
                .expect(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(res.body).toEqual({
                message: 'Internal server error',
                statusCode: 500,
            })
        });
    });

    describe('PUT user/:id', () => {
        const basicUserUrl = '/user/1';
        const moderUserUrl = '/user/2';
        const adminUserUrl = '/user/3';
        const updateNicknameDto = {
            nickname: 'newNickname',
        }
        const updatePasswordDto = {
            password: 'newpass123',
        }
        it('unauthorized user tries to update smth but it rejected, returns 401', async () => {
            const res = await request(app.getHttpServer())
                .put(basicUserUrl)
                .send(updateNicknameDto)
                .expect(HttpStatus.UNAUTHORIZED);
            expect(res.body).toEqual({
                message: 'Unauthorized',
                statusCode: 401,
            });
        });

        it('user tries to change his nickname on already existing nickname, returns 409', async () => {
            mockUserService.updateUser.mockRejectedValueOnce(new ConflictException(ExceptionMessageEnum.USER_ALREADY_EXISTS));
            const res = await request(app.getHttpServer())
                .put(basicUserUrl)
                .set('Authorization', `Bearer ${basicUser.token}`)
                .send(updateNicknameDto)
                .expect(HttpStatus.CONFLICT);
            expect(res.body.message).toEqual(ExceptionMessageEnum.USER_ALREADY_EXISTS);
        });

        it('user tries to change his nickname and it successful, returns 200', async () => {
            mockUserService.updateUser.mockResolvedValueOnce({...basicUserInDb, nickname: updateNicknameDto.nickname});
            const res = await request(app.getHttpServer())
                .put(basicUserUrl)
                .set('Authorization', `Bearer ${basicUser.token}`)
                .send(updateNicknameDto)
                .expect(HttpStatus.OK);
            expect(res.body.nickname).toEqual(updateNicknameDto.nickname);
        });

        it('user tries to update his own password and it is successful', async () => {
            mockUserService.updateUser.mockResolvedValueOnce({
                ...basicUserInDb,
                password: 'newhashedPassword',
            });
            const res = await request(app.getHttpServer())
                .put(basicUserUrl)
                .set('Authorization', `Bearer ${basicUser.token}`)
                .send(updatePasswordDto)
                .expect(HttpStatus.OK);
            expect(res.body.password).toBeUndefined();
        });

        it('basic user tries to update the other uder nickname', async () => {
            const res = await request(app.getHttpServer())
                .put(moderUserUrl)
                .set('Authorization', `Bearer ${basicUser.token}`)
                .send(updateNicknameDto)
                .expect(HttpStatus.FORBIDDEN);
            expect(res.body).toEqual({
                error: 'Forbidden',
                message: 'Forbidden resource',
                statusCode: 403,
            })
        });

        it('moder tries to change admins nickname and gets forbidden', async () => {
            const res = await request(app.getHttpServer())
                .put(adminUserUrl)
                .set('Authorization', `Bearer ${moderUser.token}`)
                .send(updateNicknameDto)
                .expect(HttpStatus.FORBIDDEN);
            expect(res.body).toEqual({
                error: 'Forbidden',
                message: 'Forbidden resource',
                statusCode: 403,
            })
        });

        it('moder tries to change basic user nickname, returns 200', async () => {
            mockUserService.updateUser.mockResolvedValueOnce({...basicUserInDb, nickname: updateNicknameDto.nickname});
            const res = await request(app.getHttpServer())
                .put(basicUserUrl)
                .set('Authorization', `Bearer ${moderUser.token}`)
                .send(updateNicknameDto)
                .expect(HttpStatus.OK);
            expect(res.body.nickname).toEqual(updateNicknameDto.nickname);
        });
    });

    describe('DELETE user/:id', () => {
        const url = '/user/1';

        it('user deletes himself gets 204', async () => {
            const res = await request(app.getHttpServer())
                .delete(url)
                .set('Authorization', `Bearer ${basicUser.token}`)
                .expect(HttpStatus.NO_CONTENT);
        });

        it('admin deletes basic user', async () => {
            const res = await request(app.getHttpServer())
                .delete(url)
                .set('Authorization', `Bearer ${adminUser.token}`)
                .expect(HttpStatus.NO_CONTENT);
        });

        it('admin tries to delete unexisting user, returns 404', async () => {
            mockUserService.deleteUser.mockRejectedValueOnce(new NotFoundException(ExceptionMessageEnum.USER_NOT_FOUND))
            const res = await request(app.getHttpServer())
                .delete(url)
                .set('Authorization', `Bearer ${adminUser.token}`)
                .expect(HttpStatus.NOT_FOUND);
            expect(res.body.message).toEqual(ExceptionMessageEnum.USER_NOT_FOUND);
        });

        it('moder tries to delete other user and gets forbidden', async () => {
            const res = await request(app.getHttpServer())
                .delete(url)
                .set('Authorization', `Bearer ${moderUser.token}`)
                .expect(HttpStatus.FORBIDDEN);
        });
    });
});
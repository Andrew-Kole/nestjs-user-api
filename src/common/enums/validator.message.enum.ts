export enum ValidationFailed {
    IS_EMPTY = 'Cannot be empty',
    IS_STRING = 'It must be a string',
    MINIMAL_LENGTH = 'Password is too short',
    MUST_CONTAIN = 'Password must contain minimum 1 character and 1 number',
    IS_BOOLEAN = 'It must true or false',
    IS_USER_ROLE_ENUM = 'Unexisting role provided',
}
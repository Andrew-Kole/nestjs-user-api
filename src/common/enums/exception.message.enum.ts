export enum ExceptionMessageEnum {
    USER_NOT_FOUND = 'User not found!',
    USER_ALREADY_EXISTS = 'User with this nickname already exists, choose another nickname!',
    USER_IS_BANNED = 'This user is banned! Think about your behavior and contact admin or moder!',
    INVALID_CREDENTIALS = 'Wrong login or password!',
    SELF_VOTE = 'You cannot vote for yourself!',
    DOUBLE_VOTE = 'You cannot vote twice on same profile!',
    VOTED_RECENTLY = 'You cannot vote oftener than once an hour!',
    VOTE_NOT_FOUND = 'Vote does not exists',
    VOTE_NOT_OWNER = 'You can change only your votes',
    NO_CHANGES = 'You have not done any changes',
}
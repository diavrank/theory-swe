// TODO: Remove this definition when types meteor/accounts is updated, since nowadays the method onLogout is returning void.
interface LogoutHook {
    stop: Function;
}

export {
    LogoutHook
}

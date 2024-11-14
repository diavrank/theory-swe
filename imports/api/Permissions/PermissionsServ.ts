export default class PermissionsService {
    getPermissions(permissions:string[]) {
        return Meteor.roles.find({ _id: { $in: permissions } });
    }

    getPermissionsComplement(permissions:string[]) {
        return Meteor.roles.find({ _id: { $not: { $in: permissions } } });
    }
}

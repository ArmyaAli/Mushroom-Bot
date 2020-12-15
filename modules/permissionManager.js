const checkPermissions = (client, message, commandName) => {
    let authorPerms = message.member.permissions;
    return authorPerms.has(client.commands.get(commandName).requiredPermissions)
  };

  module.exports.checkPermissions = checkPermissions;
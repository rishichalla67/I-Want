export const Notification = (username, msg, id, requesterUsername, first, notificationType) => {
    return {
        username: username,
        message: msg,
        requesterID: id,
        requesterUsername: requesterUsername,
        firstName: first,
        notificationType: notificationType,
        checked: false
    }
}
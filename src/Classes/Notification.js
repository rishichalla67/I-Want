export const Notification = (msg, id, first) => {
    return {
        checked: false,
        message: msg,
        requesterID: id,
        firstName: first
    }
}
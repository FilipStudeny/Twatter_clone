$(document).ready( () => {

    $.get("/notifications/all", (data) => {
        outputNotifications(data, $('.resultsContainer'))
    });

});

$('#markNotificationAsRead').click(() => markNotificationsAsOpened())

//@ts-ignore
const outputNotifications = (notifications, container) => {
    
    if(notifications.length == 0){
        container.append("<span class='noResults'>Nothing to show</span>")
        return;
    }

    //@ts-ignore
    notifications.forEach(notification => {
        const html = createNotificationHtml(notification);
        container.append(html);
    });
}

//@ts-ignore
const createNotificationHtml = (notification) => {

    const userFrom = notification.userFrom;
    const className = notification.opened ? "" : "active";

    const html = `
        <a href='${getNotificationURL(notification)}' class='resultListItem notification  ${className}' data-id='${notification._id}'>
            <div class='resultsImageContainer'>
                <img src='${userFrom.profilePicture}'>
            </div>
            <div class='resultsDetailsContainer elipsis'>
                <span class='elipsis'>${getNotificationText(notification)}</span>
            </div>
        </a>
    `

    return html;
}

//@ts-ignore
const getNotificationText = (notification) => {

    const userFrom = notification.userFrom;
    if(!userFrom.firstName || !userFrom.lastName){
        return alert("User data not populated");
    }

    const userFromName = `${userFrom.firstName} ${userFrom.lastName}`;
    let text;

    if(notification.notificationType == "Retweet"){
        text = `${userFromName} retweeted your post`;

    }else if(notification.notificationType == "Post like"){
        text = `${userFromName} liked your post`;

    }else if(notification.notificationType == "Reply"){
        text = `${userFromName} replied to your post`;

    }else if(notification.notificationType == "Follow"){
        text = `${userFromName} followed you`;
    };

    return `<span class='elipsis'>${text}</span>`

}

//@ts-ignore
const getNotificationURL = (notification) => {

    let url = '#';

    if(notification.notificationType == "Retweet" || notification.notificationType == "Post like" || notification.notificationType == "Reply"){
        url = `/posts/post/${notification.entityID}`;

    } else if(notification.notificationType == "Follow"){
        url = `/profile/${notification.userFrom._id}`;
    };

    return url;

}


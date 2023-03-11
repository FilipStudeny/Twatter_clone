$(document).ready( () => {

    $.get("/notifications/all", (data) => {
        outputNotifications(data, $('.resultsContainer'))
    });

});

$('#markNotificationAsRead').click(() => markNotificationsAsOpened())

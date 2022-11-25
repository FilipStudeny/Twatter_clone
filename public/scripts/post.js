

$(document).ready(() => {

    // *** AJAX REQUEST *** //
    // @ts-ignore
    $.get("/posts/" + postID, (results) => {
        outputPostsWithReplies(results, $('.postContainer'))
    });
})




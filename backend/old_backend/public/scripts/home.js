

$(document).ready(() => {

    // *** AJAX REQUEST *** //
    $.get("/posts/", { followingOnly: true } ,(results) => {
        outputPosts(results, $('.postContainer'))
    });
})




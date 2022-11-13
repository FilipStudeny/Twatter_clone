

$(document).ready(() => {

    // *** AJAX REQUEST *** //
    $.get("/posts/", (results) => {
        console.log(results)
        outputPosts(results, $('.postContainer'))
    });
})

// @ts-ignore
const outputPosts = (results, container) => {
    container.html("");

    // @ts-ignore
    results.forEach( (result) => {
        const html = createPostHtml(result);
        container.append(html);
    })

    if( results.length == 0 ){
        container.append("<span class='noResults'> No posts found. </span>");
    }
}

// @ts-ignore
function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if(elapsed / 1000 < 30 ) return "Just now";
        return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}
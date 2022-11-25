$("#postTextArea, #replyTextArea",).keyup( (event) => {
    const textbox = $(event.target);
    // @ts-ignore
    let value = textbox.val().trim();
    let isModal = textbox.parents(".modal").length == 1;
    let submitButton = isModal ? $('#submitReplyButton') : $('#submitPostButton');


   
    if(submitButton.length == 0){
        return alert("No submit button found");
    }

    if(value == ''){
        submitButton.prop('disabled', true);
        return
    }
        
    submitButton.prop('disabled', false);
})


$("#submitPostButton, #submitReplyButton").click( (event) => {
    let button = $(event.target);
    let isModal = button.parents(".modal").length == 1;
    let textbox = isModal ? $('#replyTextArea') : $('#postTextArea');

    var data = {
        content: textbox.val()
    }

    if(isModal){
        const id = button.data().id;
        if(id == null){
            return alert("Button id is null");
        }
        // @ts-ignore
        data.replyTo = id;
    }

    // *** AJAX REQUEST *** //        
    $.post("/posts/new", data, (postData) => {

        if(postData.replyTo) {
            // @ts-ignore
            location.reload();
        }else{
            const html = createPostHtml(postData);
            // @ts-ignore
            $('.postContainer').prepend(html);
    
            textbox.val('');
            button.prop('disabled', true);
        }
    });
});

$("#replyModal").on("show.bs.modal", (event) => {
    $("#replyTextArea").val("");

    // @ts-ignore
    const button = $(event.relatedTarget);
    const postID = getPostIDFromElement(button);

    $("#submitReplyButton").data("id", postID);

    // *** AJAX REQUEST *** //
    $.get(`/posts/${postID}`, (results) => {
        // @ts-ignore
        outputPosts(results.postData, $('#originalPostContainer'))
    });
})

// @ts-ignore
$("#replyModal").on("hidden.bs.modal", (event) => {
    $("#originalPostContainer").html("");
    $("#replyTextArea").html("");

})


$("#deletePostModal").on("show.bs.modal", (event) => {

    // @ts-ignore
    const button = $(event.relatedTarget);
    const postID = getPostIDFromElement(button);

    $("#deletePostButton").data("id", postID);

})

$("#deletePostButton").click( (event) => {
    // @ts-ignore
    const postID = $(event.target).data("id");

    // *** AJAX REQUEST *** //
    $.ajax({
        url: `/posts/delete/${postID}`,
        type: "DELETE",
        success: (data, sucessMessage, xhr) => {
            if(xhr.status != 202){
                alert("Could not delete post.")
                return;
            }
            
            location.reload();
        }
    });
})


$(document).on("click",".likeButton", (event) => {
    const button = $(event.target);
    const postID = getPostIDFromElement(button);

    if (postID === undefined){
        return;
    }

    // *** AJAX REQUEST *** //
    $.ajax({
        url: `/posts/${postID}/like`,
        type: "PUT",
        success: (postData) => {
            button.find("span").text(postData.likes.length || "");

            // @ts-ignore
            if (postData.likes.includes(userLoggedIn._id))
            {
                button.addClass("active");
            }else{
                button.removeClass("active");
            }
        }
    });

});

$(document).on("click",".shareButton", (event) => {
    const button = $(event.target);
    const postID = getPostIDFromElement(button);

    if (postID === undefined){
        return;
    }

    // *** AJAX REQUEST *** //
    $.ajax({
        url: `/posts/${postID}/retweet`,
        type: "POST",
        success: (postData) => {
            
            button.find("span").text(postData.retweetUsers.length || "");

            // @ts-ignore
            if (postData.retweetUsers.includes(userLoggedIn._id))
            {
                button.addClass("active");
            }else{
                button.removeClass("active");
            }

            location.reload();
            
        }
    });

});

$(document).on("click",".followButton", (event) => {
    const button = $(event.target);
    const userID = button.data().user;


    if (userID === undefined){
        return;
    }

    // *** AJAX REQUEST *** //
    $.ajax({
        url: `/users/${userID}/follow`,
        type: "PUT",
        success: (data, status, xhr) => {

            if(xhr.status == 404){
                alert('User not found.')
                return;
            }


            let difference = 1;
            // @ts-ignore
            if (data.following && data.following.includes(userID))
            {
                button.addClass("following");
                button.text("Following")
            }else{
                button.removeClass("following");
                button.text("Follow")
                difference = -1;
            }
            
            const followersLabel = $("#followersValue");
            if(followersLabel.length != 0){
                let followersCount = followersLabel.text();
                // @ts-ignore
                followersCount = parseInt(followersCount);
                followersLabel.text(followersCount + difference);
            }
            
        }
    });

});

$(document).on("click",".post", (event) => {
    const element = $(event.target);
    const postID = getPostIDFromElement(element);

    if(postID !== undefined && !element.is('button')){
        window.location.href = '/posts/post/' + postID;
    }

});

// @ts-ignore
const getPostIDFromElement = (element) => {
    const isRoot = element.hasClass("post");
    const rootElement = isRoot == true ? element : element.closest(".post");
    const postID = rootElement.data().id;

    if (postID === undefined){
        return alert("Post id undefined");
    }

    return postID;

};

// @ts-ignore
const outputPosts = (results, container) => {
    container.html("");

    if(!Array.isArray(results)){
        results = [results];
    }

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
const outputPostsWithReplies = (results, container) => {
    
    container.html("");

    if(results.replyTo !== undefined && results.replyTo._id !== undefined){
        const html = createPostHtml(results.replyTo);
        container.append(html);
    }

    const mainPostHtml = createPostHtml(results.postData, true);
    container.append(mainPostHtml);

    // @ts-ignore
    results.replies.forEach( (result) => {
        const html = createPostHtml(result);
        container.append(html);
    })

}

// @ts-ignore
const createPostHtml = (postData, largeFont = false) => {


    if(postData == null){
        postData.content = "<div class='notAvailable'>This content is not available</div>"
    }

    if(postData == null){
        return alert("Post data not populated");
    }
    const postedBy = postData.postedBy;
    const isRetweet = postData.retweetData !== undefined;
    const retweetedBy = isRetweet ? postData.postedBy.username : null;

    postData = isRetweet ? postData.retweetData : postData;

    if(postedBy._id === undefined){
        return alert("User object not populated !")
    }

    const username = postedBy.firstName + ' ' + postedBy.lastName;
    let timestamp = timeDifference(new Date(), new Date(postData.createdAt));

    
    // @ts-ignore
    const likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "active" : "";
    // @ts-ignore
    const shareButtonActiveClass = postData.retweetUsers.includes(userLoggedIn._id) ? "active" : "";
    const largeFontClass = largeFont ? "largeFont" : "";

    let retweetText = " ";
    
    if (isRetweet){
        retweetText =
        `
        <span>
            <i class="fa-solid fa-share"></i>
            Retweeted by <a href='profile/${retweetedBy}'> @${retweetedBy} </a>
        </span>`
    };

    let replyFlag = "";
    if(postData.replyTo && postData.replyTo._id){

        if(!postData.replyTo._id){
            return alert("ReplyTo is not populated");
        }else if(!postData.replyTo.postedBy._id){
            return alert("PostedBy is not populated");
        }

        let replyToUsername = postData.replyTo.postedBy.username;
        replyFlag = `
        <div class=replyFlag>
            Replying to <a href='/profile/${replyToUsername}'>@${replyToUsername}</a>
        </div>`;
    }
    console.log(postData)
    let buttons = "";
    // @ts-ignore
    if(postData.postedBy._id == userLoggedIn._id){
        buttons = `
        <button data-id='${postData._id}' data-toggle='modal' data-target='#deletePostModal'>
            <i class='fas fa-times'></i>
        </button>`
    }

    const html = 
    `<div class='post ${largeFontClass}' data-id='${postData._id}'>
        <div class='postActionContainer'>
            ${retweetText}
        </div>

        <div class='mainContentContainer'>
            <div class='userImageContainer'>
                <img src='${postedBy.profilePicture}'/>
            </div>
            <div class='postContentContainer'>
                <div class='header'>
                    <a class='displayName' href='/profile/${postedBy.username}'>${username}</a>
                    <span class='username'>@${postedBy.username}</span>
                    <span class='date'>${timestamp}</span>
                    ${buttons}
                </div>
                ${replyFlag}
                <div class='postBody'>
                    <span>${postData.content}</span>
                
                </div>
                <div class='postFooter'>
                    <div class='postButtonContainer blue'>
                        <button class='commentButton'>
                            <button data-toggle='modal' data-target='#replyModal'> 
                                <i class="fa-regular fa-comment"></i>
                                <span></span>
                            </button>
                            
                        </button>
                    </div>
                    <div class='postButtonContainer green'>
                        <button class='shareButton ${shareButtonActiveClass}'>
                            <i class="fa-solid fa-share"></i>
                            <span>${postData.retweetUsers.length || ""}</span>
                        </button>            
                    </div>
                    <div class='postButtonContainer red'>
                        <button class='likeButton ${likeButtonActiveClass}'>
                            <i class="fa-solid fa-heart"></i>
                            <span>${postData.likes.length || ""}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div> 
    `

    return html
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
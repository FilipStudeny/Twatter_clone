$('#postTextArea',).keyup( (event) => {
    const textbox = $(event.target);
    const submitButton = $('#submitPostButton');

    // @ts-ignore
    let value = textbox.val().trim();
    if(submitButton.length == 0){
        return alert("No submit button found");
    }

    if(value == ''){
        submitButton.prop('disabled', true);
    }else{
        submitButton.prop('disabled', false);
    }
})

$('#submitPostButton').click( (event) => {
    const button = $(event.target);
    const textbox = $('#postTextArea');

    var data = {
        content: textbox.val()
    }

    // *** AJAX REQUEST *** //
    $.post("/posts/new", data, (postData) => {
        
        const html = createPostHtml(postData);
        // @ts-ignore
        $('.postContainer').prepend(html);

        textbox.val('');
        button.prop('disabled', true);
    });
});

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
            if (postData.likes.includes(userLoggedIn._id))
            {
                button.addClass("active");
            }else{
                button.removeClass("active");
            }
            
        }
    });

});

// @ts-ignore
const getPostIDFromElement = (element) => {
    const isRoot = element.hasClass("post");
    const rootElement = isRoot ? element : element.closest(".post");
    const postID = rootElement.data().id;

    if (postID === undefined){
        return alert("Post id undefined");
    }

    return postID;

};

// @ts-ignore
const createPostHtml = (postData) => {

    if(postData == null){
        return alert("Post object is null");
    }

    const postedBy = postData.postedBy;
    const isRetweet = postData.retweetData !== undefined;
    const retweetedBy = isRetweet ? postedBy.username : null;
    postData = isRetweet ? postData.retweetData : postData;

    if(postedBy._id === undefined){
        return alert("User object not populated !")
    }

    const username = postedBy.firstName + ' ' + postedBy.lastName;
    const timestamp = timeDifference(new Date(), new Date(postData.createdAt));

    // @ts-ignore
    const likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "active" : "";
    // @ts-ignore
    const shareButtonActiveClass = postData.retweetUsers.includes(userLoggedIn._id) ? "active" : "";

    let retweetText = " ";
    
    if (isRetweet){
        retweetText =
        `
        <span>
            <i class="fa-solid fa-share"></i>
            Retweeted by <a href='profile/${retweetedBy}'> @${retweetedBy} </a>
        </span>`
    };

    const html = 
    `<div class='post' data-id='${postData._id}'>
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
                </div>
                <div class='postBody'>
                    <span>${postData.content}</span>
                
                </div>
                <div class='postFooter'>
                    <div class='postButtonContainer blue'>
                        <button class='commentButton'>
                            <i class="fa-regular fa-comment"></i>
                            <span></span>
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
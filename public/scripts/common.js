// @ts-ignore
let cropper;
// @ts-ignore
var timer;
// @ts-ignore
let selectedUsers = [];

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

$("#confirmPinModal").on("show.bs.modal", (event) => {

    // @ts-ignore
    const button = $(event.relatedTarget);
    const postID = getPostIDFromElement(button);

    $("#pinPostButton").data("id", postID);

})

$("#pinPostButton").click( (event) => {
    // @ts-ignore
    const postID = $(event.target).data("id");

    // *** AJAX REQUEST *** //
    $.ajax({
        url: `/posts/pin/${postID}`,
        type: "PUT",
        data: { 'pinned': true },
        success: (data, sucessMessage, xhr) => {
            if(xhr.status != 204){
                alert("Could not pin post.")
                return;
            }
            
            location.reload();
        }
    });
})

$("#unpinModal").on("show.bs.modal", (event) => {

    // @ts-ignore
    const button = $(event.relatedTarget);
    const postID = getPostIDFromElement(button);

    $("#unpinPostButton").data("id", postID);

})

$("#unpinPostButton").click( (event) => {
    // @ts-ignore
    const postID = $(event.target).data("id");

    // *** AJAX REQUEST *** //
    $.ajax({
        url: `/posts/pin/${postID}`,
        type: "PUT",
        data: { 'pinned': false },
        success: (data, sucessMessage, xhr) => {
            if(xhr.status != 204){
                alert("Could not unpin post.")
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


$("#filePhoto").change( function(event){

    //@ts-ignore
    if(this.files && this.files[0]){
        const reader = new FileReader();
        reader.onload = (event) => {
            const image = document.getElementById("imagePreview")
            //@ts-ignore
            image.src = event.target.result;

            //@ts-ignore
            if(cropper !== undefined){
                //@ts-ignore
                cropper.destroy();
            }
            //@ts-ignore
            cropper = new Cropper(image, {
                aspectRatio: 1 / 1,
                background: false
            });


        }
        //@ts-ignore
        reader.readAsDataURL(this.files[0])
    }
});

$("#imageUploadButton").click( () => {
    // @ts-ignore
    const canvas = cropper.getCroppedCanvas();
    
    if(canvas == null){
        alert("Empty area in image cropper.")
        return
    }

    // @ts-ignore
    canvas.toBlob((blob) => { //converts image to binary data
        const formData = new FormData();
        formData.append("croppedImage", blob);

        $.ajax({
            url: "/profile/profilePicture",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: () => {
                location.reload();
            }
        })

    })

});


$("#coverPhoto").change( function(event){

    //@ts-ignore
    if(this.files && this.files[0]){
        const reader = new FileReader();
        reader.onload = (event) => {
            const image = document.getElementById("coverPreview")
            //@ts-ignore
            image.src = event.target.result;

            //@ts-ignore
            if(cropper !== undefined){
                //@ts-ignore
                cropper.destroy();
            }
            //@ts-ignore
            cropper = new Cropper(image, {
                aspectRatio: 16 / 9,
                background: false
            });
        }
        //@ts-ignore
        reader.readAsDataURL(this.files[0])
    }
});

$("#coverPhotoButton").click( () => {
    // @ts-ignore
    const canvas = cropper.getCroppedCanvas();
    
    if(canvas == null){
        alert("Empty area in image cropper.")
        return
    }

    // @ts-ignore
    canvas.toBlob((blob) => { //converts image to binary data
        const formData = new FormData();
        formData.append("croppedImage", blob);

        $.ajax({
            url: "/profile/coverPhoto",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: () => {
                location.reload();
            }
        })

    })

});


//@ts-ignore
$("#userSearchTextBox").keydown( (event) => {
    //@ts-ignore
    clearTimeout(timer);
    const textBox = $(event.target);

    //@ts-ignore
    let value = textBox.val();
    const searchType = textBox.data().search

    //@ts-ignore
    if(value == "" && (event.which == 8 || event.keyCode == 8)){
        //remove user from selection
        //@ts-ignore
        selectedUsers.pop();
        updateSelectedUsersHtml();
        $('.resultsContainer').html('');
        
        if(selectedUsers.length == 0){
            $('#createChatButton').prop('disabled', true);
        }

        return;
    }

    timer = setTimeout(() => {
        //@ts-ignore
        value = textBox.val().trim();

        if(value == ''){
            $(".resultsContainer").html("")
        }else{
            searchUsers(value);
        }
    }, 1000)
})

$("#createChatButton").click( () => {
    // @ts-ignore
    const data = JSON.stringify(selectedUsers);
    
    $.post('/messages/chat', { users: data }, chat => {

        if(!chat || !chat._id){
            return alert('Invalid response from server');
        }


        window.location.href = `/messages/${chat._id}`;
    });

});

// @ts-ignore
const searchUsers = (searchTerm) => {
    // @ts-ignore
    $.get('/users/', {search: searchTerm}, results => {

        outputSelectableUsers(results, $('.resultsContainer'))

    });
}

// @ts-ignore
const outputSelectableUsers = (result, container) => {
    container.html("")
    // @ts-ignore
    result.forEach(result => {

        // @ts-ignore
        if(result._id == userLoggedIn._id || selectedUsers.some(u => u._id == result._id)) {
            return  
        } 

        const html = createUserHTML(result, false)
        const element = $(html);
        element.click( () => userSelected(result));

        container.append(element);
    });

    // @ts-ignore
    if(result.length == 0){
        container.append("<span class='noResults'>No results found</span>")
    }

}

// @ts-ignore
const userSelected = (user) => {
    selectedUsers.push(user);
    updateSelectedUsersHtml()
    $('#userSearchTextBox').val('').focus();
    $('.resultsContainer').html('');
    $('#createChatButton').prop('disabled', false);
}

const updateSelectedUsersHtml = () => {
    // @ts-ignore
    const elements = [];

    // @ts-ignore
    selectedUsers.forEach( (user) => {
        const name = user.firstName + ' ' + user.lastName;
        const userElement = $(`<span class='selectedUser'>${name}</span>`)
        elements.push(userElement);
    })

    $('.selectedUser').remove();
    // @ts-ignore
    $('#selectedUsers').prepend(elements);
};

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
        let html = createPostHtml(result);
        container.append(html);
    })

    if( results.length  == 0 ){
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
const outputUsers = (data, container) => {
    container.html("")
    // @ts-ignore
    data.forEach(result => {
        const html = createUserHTML(result, true)
        container.append(html)
    });

    // @ts-ignore
    if(data.length == 0){
        container.append("<span class='noResults'>No results found</span>")
    }

}

// @ts-ignore
const createUserHTML = (userData, showFollowButton) => {
    // @ts-ignore
    const name = userData.firstName + " " + userData.lastName;
    let followButton = "";
    // @ts-ignore
    const isFollowing = userLoggedIn.following && userLoggedIn.following.includes(userData._id)
    const text = isFollowing ? "Following" : "Follow"
    const buttonClass = isFollowing ? "followButton following" : "followButton"

    // @ts-ignore
    if(showFollowButton && userLoggedIn._id != userData._id){
        followButton = 
        `
        <div class='followButtonContainer'>
            <button class='${buttonClass}' data-user='${userData._id}'>${text}</button>
        </div>
        `
    }

    const html = 
    `
    <div class='user'>
        <div class='userImageContainer'>
            <img src='${userData.profilePicture}'>
        </div>
        <div class='userDetailsContainer'>
            <div class='header'>
                <a href='/profile/${userData.username}'>${name}</a>
                <span class='username'>@${userData.username}</span>
            </div>
        </div>
        ${followButton}
    </div>
    `

    return html
}

// @ts-ignore
const createPostHtml = (postData, largeFont = false) => {
    if(postData === null){
        return alert("Post object is null");
    }

    let isRetweet = postData.retweetData !== undefined;
    let retweetedBy = isRetweet ? postData.postedBy.username : null;
    postData = isRetweet ? postData.retweetData : postData;
    let postedBy = postData.postedBy;

   
    if(postData.content == null){
        postData.content = "<div class='notAvailable'>This content is not available</div>"
    }


    if(postedBy._id === undefined){
        return alert("User object not populated !")
    }

    let username = postedBy.firstName + ' ' + postedBy.lastName;
    let timestamp = timeDifference(new Date(), new Date(postData.createdAt));

    
    // @ts-ignore
    let likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "active" : "";
    // @ts-ignore
    let shareButtonActiveClass = postData.retweetUsers.includes(userLoggedIn._id) ? "active" : "";
    let largeFontClass = largeFont ? "largeFont" : "";

    let retweetText = "";
    
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
        replyFlag = 
        `
        <div class=replyFlag>
            Replying to <a href='/profile/${replyToUsername}'>@${replyToUsername}</a>
        </div>
        `;
    }

    let buttons = "";
    let pinnedPostText = '';
    // @ts-ignore
    if(postData.postedBy._id == userLoggedIn._id){
        let pinnedClass = '';
        let dataTarget = '#confirmPinModal'

        if(postData.pinned === true){
            pinnedClass = 'active'
            pinnedPostText = `
            <i class='fas fa-thumbtack'></i>
            <span>Pinned Post</span>
            `
            dataTarget = '#unpinModal'
        }

        buttons = `
        <button class='pinButton ${pinnedClass}' data-id='${postData._id}' data-toggle='modal' data-target='${dataTarget}'>
            <i class='fas fa-thumbtack'></i>
        </button>        
        <button data-id='${postData._id}' data-toggle='modal' data-target='#deletePostModal'>
            <i class='fas fa-times'></i>
        </button>
        `
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
                <div class='pinnedPostText'>
                    ${pinnedPostText}
                </div>
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
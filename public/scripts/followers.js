



$(document).ready(() => {

    // @ts-ignore
    if(selectedTab === "followers"){
        loadFollowers()
    }else{
        loadFollowing()
    }


 
})

const loadFollowers = () => {
   // *** AJAX REQUEST *** //
   // @ts-ignore
   $.get(`/user/${profileUserID}/followers`, (results) => {
        outputUsers(results.followers, $('.resultsContainer'))
    });
}

const loadFollowing = () => {
    // *** AJAX REQUEST *** //
    // @ts-ignore
    $.get(`/user/${profileUserID}/following`, (results) => {
        outputUsers(results.following, $('.resultsContainer'))
     });
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
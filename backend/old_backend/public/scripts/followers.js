



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




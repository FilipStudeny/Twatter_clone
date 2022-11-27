

$(document).ready(() => {

    // @ts-ignore
    if(selectedTab === "replies"){
        loadReplies()
    }else{
        loadPosts()
    }


 
})

const loadPosts = () => {
   // *** AJAX REQUEST *** //
   // @ts-ignore
   $.get("/posts/", { postedBy: profileUserID, pinned: true } ,(results) => {
        outputPinnedPost(results, $('.pinnedPostContainer'))
    });

   // @ts-ignore
    $.get("/posts/", { postedBy: profileUserID, isReply: false } ,(results) => {
        outputPosts(results, $('.postContainer'))
    });
}

const loadReplies = () => {
    // *** AJAX REQUEST *** //
    // @ts-ignore
    $.get("/posts/", { postedBy: profileUserID, isReply: true } ,(results) => {
         outputPosts(results, $('.postContainer'))
     });
 }

// @ts-ignore
 const outputPinnedPost = (results, container) => {
    if (results.length == 0){
        container.hide();
        return;
    }
    
    container.html("");

    // @ts-ignore
    results.forEach( (result) => {
        let html = createPostHtml(result);
        container.append(html);
    })

}
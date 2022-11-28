//@ts-ignore
let timer;

//@ts-ignore
$("#searchBox").keydown( (event) => {
    //@ts-ignore
    clearTimeout(timer);
    const textBox = $(event.target);
    //@ts-ignore
    let value = textBox.val();
    const searchType = textBox.data().search

    timer = setTimeout(() => {
        //@ts-ignore
        value = textBox.val().trim();

        if(value == ''){
            $(".resultsContainer").html("")
        }else{
            search(value, searchType);
        }
    }, 1000)
})

//@ts-ignore
const search = (searchTerm, searchType) => {
    const url = searchType == "users" ? '/users' : '/posts'

    $.get(url, {
        search: searchTerm,
    }, (results) => {
        
        if(searchType == 'users'){
            outputUsers(results, $(".resultsContainer") )
        }else{
            outputPosts(results, $(".resultsContainer"))
        }
    })
}
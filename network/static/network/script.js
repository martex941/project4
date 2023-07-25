function timeline() {
    fetch('/')
    .then(response => response.json())
    .then(posts => {
        console.log(posts);

        posts.forEach(element => {
            const post_div = document.createElement("div");
            post_div.className = 'post';
            post_div.innerHTML =
            `
            <h5 class="post-creator">${element.username}</h5>
            <p class="post-body">${element.body}</p>
            <span class="post-timestamp">${element.timestamp}</span>
            `;
            document.querySelector("#timeline-feed").append(post_div);
        });
    });           
}

function new_post() {
    const textareaElement = document.querySelector("#new-post-body");
    const body = textareaElement.value;
    console.log(body)
    
}

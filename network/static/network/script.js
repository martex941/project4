function timeline() {
    fetch("timeline")
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
            <hr>
            <span class="post-timestamp">${element.timestamp}</span>
            `;
            document.querySelector("#timeline-feed").append(post_div);
        });
    });           
}

function new_post() {
    document.querySelector("#new-post-form").onsubmit = (event) => {
        event.preventDefault();

        const csrfTokenInput = document.getElementsByName('csrfmiddlewaretoken')[0];
        const csrfToken = csrfTokenInput.value;

        const textareaElement = document.querySelector("#new-post-body");
        const body = textareaElement.value;

        fetch("new_post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken
            },
            body: JSON.stringify({ body: body }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error(error);
        });

        return false;  
    }
}

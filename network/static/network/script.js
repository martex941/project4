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
            <a href="/profile/${element.username}"><h5 class="post-creator">${element.username}</h5></a>
            <p class="post-body">${element.body}</p>
            <hr>
            <div class="row">
                <span class="col post-timestamp">${element.timestamp}</span>
                <div class="col post-like">
                    <h5 class="text-lead">${element.likes} likes</h5>
                    <button class="btn btn-primary like-btn">Like</button>
                </div>
            </div>
            `;
            document.querySelector("#timeline-feed").append(post_div);
        });
    });           
}

function follow() {
    document.querySelector("#follow-btn").addEventListener('click', () => {
        const followee = document.querySelector("#profile-username").dataset.name;

        fetch("follow", {
            method: "POST",
            body: JSON.stringify({
                followee: followee
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error(error);
        });
    })
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

function getCsrf(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


function like(liked_post) {
    const csrftoken = getCsrf('csrftoken');

    fetch("like", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken
        },
        body: JSON.stringify({
            liked_post: liked_post
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });
}

function unlike(unliked_post) {
    const csrftoken = getCsrf('csrftoken');

    fetch("unlike", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken
        },
        body: JSON.stringify({
            liked_post: unliked_post
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });
}

function timeline(url) {
    fetch(`${url}`)
    .then(response => response.json())
    .then(posts => {
        console.log(posts);
        posts.forEach(element => {
            const post_div = document.createElement("div");
            post_div.className = 'post';

            // <a href="/profile/${element.username}"><h5 class="post-creator">${element.username}</h5></a>
            const a = document.createElement("a");
            a.href = `/profile/${element.username}`;
            const post_creator = document.createElement("h5");
            post_creator.className = 'post-creator';
            post_creator.innerHTML = `${element.username}`;
            a.appendChild(post_creator);
            post_div.append(a);

            // <p class="post-body">${element.body}</p>
            const p = document.createElement("p");
            p.className = 'post-body';
            p.innerHTML = `${element.body}`;
            post_div.append(p);

            // <hr>
            const hr = document.createElement("hr");
            post_div.append(hr);

            // <div class="row">
            const row = document.createElement("div");
            row.className = 'row';

            // <span class="col post-timestamp">${element.timestamp}</span>
            const span = document.createElement("span");
            span.className = 'col post-timestamp';
            span.innerHTML = `${element.timestamp}`;
            row.appendChild(span);

            // <div class="col post-like">
            const post_like = document.createElement("div");
            post_like.className = 'col post-like';

            // <h5 class="text-lead">${element.likes} likes</h5>
            const likes_amount = document.createElement("h5");
            likes_amount.className = 'text-lead';
            likes_amount.innerHTML = `${element.likes} likes`;
            post_like.appendChild(likes_amount);

            function create_like_btn() {
                const like_btn = document.createElement("button");
                like_btn.className = 'btn btn-primary like-btn';
                like_btn.id = 'like-btn';
                like_btn.innerHTML = "Like";
                post_like.appendChild(like_btn);
                like_btn.addEventListener('click', () => {
                    like(element.id);
                    likes_amount.innerHTML = `${element.likes += 1} likes`;
                    like_btn.remove();
                    create_unlike_btn();
                })
            }

            function create_unlike_btn() {
                const unlike_btn = document.createElement("button");
                unlike_btn.className = 'btn btn-secondary yunlike-btn';
                unlike_btn.id = 'unlike-btn';
                unlike_btn.innerHTML = "Unlike";
                post_like.appendChild(unlike_btn);
                unlike_btn.addEventListener('click', () => {
                    unlike(element.id);
                    likes_amount.innerHTML = `${element.likes -= 1} likes`;
                    unlike_btn.remove();
                    create_like_btn();
                })
            }

            // <button class="btn btn-primary like-btn" id="like-btn">Like</button>
            // <button class="btn btn-secondary unlike-btn" id="unlike-btn">Unlike</button>
            if (element.like_check) {
                create_unlike_btn();    
            }
            else {
                create_like_btn();
            }

            row.appendChild(post_like);
            post_div.append(row);

            document.querySelector("#timeline-feed").append(post_div);
        });
    });     
}

function following_switch() {
    const following_check = document.querySelector("#following-check").dataset.following;
    console.log(following_check);
    if (following_check === "True") {
        document.querySelector("#follow-btn").style.display = 'none';
        document.querySelector("#unfollow-btn").style.display = 'block';
    }
    else if (following_check === "False") {
        document.querySelector("#follow-btn").style.display = 'block';
        document.querySelector("#unfollow-btn").style.display = 'none';
    }
}

function follow() {
    const csrftoken = getCsrf('csrftoken');
    const followee = document.querySelector("#profile-username").dataset.name;

    fetch("follow", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken
        },
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
    setTimeout(() => {
        location.reload();
    }, 50);
}

function unfollow() {
    const csrftoken = getCsrf('csrftoken');
    const followee = document.querySelector("#profile-username").dataset.name;

    fetch("unfollow", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken
        },
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
    setTimeout(() => {
        location.reload();
    }, 50);
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

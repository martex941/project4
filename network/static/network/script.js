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

function edit_post(post_id, edited_body) {
    const csrftoken = getCsrf('csrftoken');

    fetch("edit_post", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken
        },
        body: JSON.stringify({
            post_id: post_id,
            edited_body: edited_body
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
    .then(data => {
        console.log(data);
        data['posts_data'].forEach(element => {
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

            // <div class="post-body-div">
            const body_div = document.createElement("div");
            body_div.className = 'post-body-div';

            // <p class="post-body">${element.body}</p>
            let body = document.createElement("p");
            body.className = 'post-body';
            body.innerHTML = `${element.body}`;
            body_div.appendChild(body);
            post_div.append(body_div);

            // <hr>
            const hr = document.createElement("hr");
            post_div.append(hr);

            // <div class="row"> TIMESTAMP AND LIKES
            const timestamp_likes = document.createElement("div");
            timestamp_likes.className = 'row';

            // <span class="col post-timestamp">${element.timestamp}</span>
            const span = document.createElement("span");
            span.className = 'col post-timestamp';
            span.innerHTML = `${element.timestamp}`;
            timestamp_likes.appendChild(span);

            // <h5 class="col text-lead likes>${element.likes} likes</h5>
            const likes_amount = document.createElement("h5");
            likes_amount.className = 'col text-lead likes';
            likes_amount.innerHTML = `${element.likes} likes`;
            timestamp_likes.appendChild(likes_amount);
            post_div.append(timestamp_likes);

            // <div class="col"> EDIT BUTTON AND LIKE BUTTON
            const edit_like = document.createElement("div");
            edit_like.className = 'row';

            // <div class="col"> EDIT BUTTON COLUMN
            const edit_col = document.createElement("div");
            edit_col.className = 'col';

            const current_user = document.querySelector("#username").dataset.name;
            if (current_user == element.username) {
                const edit_btn = document.createElement("button");
                edit_btn.className = 'btn btn-primary edit-btn';
                edit_btn.id = 'edit-btn';
                edit_btn.innerHTML = "Edit post";
                edit_col.appendChild(edit_btn);
                edit_btn.addEventListener('click', () => {
                    body.style.display = 'none';
                    edit_btn.style.display = 'none';
                    const edit_body = document.createElement("textarea");
                    edit_body.innerHTML = `${element.body}`;
                    body_div.appendChild(edit_body);

                    const save_btn = document.createElement("button");
                    save_btn.className = "btn btn-primary save-btn";
                    save_btn.innerHTML = "SAVE";
                    body_div.appendChild(save_btn);
                    save_btn.addEventListener('click', () => {
                        const edited_body = edit_body.value;
                        edit_post(element.id, edited_body);
                        body.innerHTML = `${edited_body}`;
                        edit_body.style.display = 'none';
                        save_btn.style.display = 'none';
                        edit_btn.style.display = 'block';
                        body.style.display = 'block';
                    })
                })
            }
            edit_like.appendChild(edit_col);

            // <div class="col"> LIKE BUTTON COLUMN
            const like_col = document.createElement("div");
            like_col.className = 'col';

            // <button class="btn btn-primary like-btn" id="like-btn">Like</button>
            function create_like_btn() {
                const like_btn = document.createElement("button");
                like_btn.className = 'btn btn-primary like-btn';
                like_btn.id = 'like-btn';
                like_btn.innerHTML = "Like";
                like_col.appendChild(like_btn);

                // Upon clicking:
                // - send POST request to the server's "like" path
                // - update front-end likes
                // - remove like button and create unlike button
                like_btn.addEventListener('click', () => {
                    like(element.id);
                    likes_amount.innerHTML = `${element.likes += 1} likes`;
                    like_btn.remove();
                    create_unlike_btn();
                })
            }

            // <button class="btn btn-secondary unlike-btn" id="unlike-btn">Unlike</button>
            function create_unlike_btn() {
                const unlike_btn = document.createElement("button");
                unlike_btn.className = 'btn btn-secondary yunlike-btn';
                unlike_btn.id = 'unlike-btn';
                unlike_btn.innerHTML = "Unlike";
                like_col.appendChild(unlike_btn);

                // Upon clicking:
                // - send POST request to the server's "unlike" path
                // - update front-end likes
                // - remove unlike button and create like button
                unlike_btn.addEventListener('click', () => {
                    unlike(element.id);
                    likes_amount.innerHTML = `${element.likes -= 1} likes`;
                    unlike_btn.remove();
                    create_like_btn();
                })
            }

            // Check whether the post is liked or not and display buttons accordingly
            if (element.like_check) {
                create_unlike_btn();    
            }
            else {
                create_like_btn();
            }

            edit_like.appendChild(like_col);

            post_div.append(edit_like);

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
        setTimeout(() => {
            location.reload();
        }, 50);

        return false;  
    }
}

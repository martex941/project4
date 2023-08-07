            // <a href="/profile/${element.username}"><h5 class="post-creator">${element.username}</h5></a>
            const a = document.createElement("a");
            a.href = `/profile/${element.username}`;
            const post_creator = document.createElement("h5");
            post_creator.className = 'post-creator';
            post_creator.innerHTML = `${element.username}`;
            a.appendChild(post_creator);
            post_div.appendChild(a);

            // <p class="post-body">${element.body}</p>
            const p = document.createElement("p");
            p.className = 'post-body';
            p.innerHTML = `${element.body}`;
            post_div.appendChild(p);

            // <hr>
            const hr = document.createElement("hr");
            post_div.appendChild(hr);

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

            const unlike_btn = document.createElement("button");
            unlike_btn.className = 'btn btn-primary unlike-btn';
            unlike_btn.id = 'unlike-btn';
            unlike_btn.innerHTML = "Unlike";
            post_like.appendChild(unlike_btn);

            const like_btn = document.createElement("button");
            like_btn.className = 'btn btn-primary like-btn';
            like_btn.id = 'like-btn';
            like_btn.innerHTML = "Like";
            post_like.appendChild(like_btn);

            row.appendChild(post_like);
            post_div.appendChild(row);

            // <button class="btn btn-primary like-btn" id="like-btn">Like</button>
            // <button class="btn btn-secondary unlike-btn" id="unlike-btn">Unlike</button>
            if (element.like_check) {
                unlike_btn.style.display = 'block';
                like_btn.style.display = 'none';                
                unlike_btn.addEventListener('click', () => {
                    unlike(element.id);
                })
            }
            else {
                unlike_btn.style.display = 'none';
                like_btn.style.display = 'block';
                like_btn.addEventListener('click', () => {
                    like(element.id);
                })
            }

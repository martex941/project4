import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.serializers.json import DjangoJSONEncoder
from django.forms.models import model_to_dict
from django.db import IntegrityError
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .models import User, Post, Like, Follow


def index(request):
    return render(request, "network/index.html")


@login_required
def new_post(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    data = json.loads(request.body)
    username = request.user
    body = data.get("body", "")

    new_post = Post(creator=username, body=body)
    new_post.save()

    return JsonResponse({"message": "Post created."}, status=201)


def timeline(request):
    posts = Post.objects.all().order_by("-timestamp")

    # Create a list of dictionaries representing the Post objects
    posts_data = [
        {
            'username': post.creator.username,
            'body': post.body,
            'likes': post.likes,
            'timestamp': post.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        }
        for post in posts
    ]
    return JsonResponse(posts_data, safe=False)


@login_required
def follow(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    data = json.loads(request.body)
    username = request.user
    body = data.get("followee", "")
    new_follow = Follow(follower=username, followee=body)
    new_follow.save()


    return JsonResponse({"message": "Followed."}, status=201)


@login_required
def profile(request, username):

    # Obtain username and their posts
    user_info = User.objects.get(username=username)
    user_posts = Post.objects.filter(creator=user_info.id)

    # Obtain amount of followers the user has got and how many people the user follows
    followers = Follow.objects.filter(followee=user_info.id)
    followees = Follow.objects.filter(follower=user_info.id)
    followers_count = followers.count()
    followees_count = followees.count()

    # Check whether the user visiting the profile already follows that person
    already_following = False
    current_user = request.user
    try:
        Follow.objects.get(followee=user_info.id, follower=current_user)
        already_following = True
    except Follow.DoesNotExist:
        pass

    return render(request, "network/profile.html", {
        "profile_username": user_info,
        "user_posts": user_posts,
        "followers": followers_count,
        "followees_count": followees_count,
        "already_following": already_following
    })


@login_required
def following(request):
    followees = Follow.objects.filter(follower=request.user.id)
    print(followees)
    followees_array = []
    for user in followees_array:
        followees_array += user.followee
    print(followees_array)

    posts = Post.objects.all().order_by("-timestamp")

    # Create a list of dictionaries representing the Post objects
    posts_data = [
        {
            'username': post.creator.username,
            'body': post.body,
            'timestamp': post.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        }
        for post in posts
    ]

    return render(request, "network/following.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

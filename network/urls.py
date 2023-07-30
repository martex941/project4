
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("new_post", views.new_post, name="new_post"),
    path("timeline", views.timeline, name="timeline"),
    path("profile/follow", views.follow, name="follow"),
    path("profile/unfollow", views.unfollow, name="unfollow"),
    path("profile/<str:username>", views.profile, name="profile"),
    path("profile/profile_feed/<str:username>", views.profile_feed, name="profile_feed"),
    path("following", views.following, name="following"),
    path("following_feed", views.following_feed, name="following_feed"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register")
]

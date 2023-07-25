from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    pass

class Post(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="post_creator", default="")
    body = models.CharField(max_length=250, default="")
    timestamp = models.DateTimeField(default=timezone.now, editable=False)
    likes = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"A post by {self.creator} at {self.timestamp}"
    
class Like(models.Model):
    liker = models.ForeignKey(User, on_delete=models.CASCADE, related_name="liker", default="")
    liked_post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="liked_post", default="")

    def __str__(self):
        return f"{self.liker} liked {self.liked_post}"
    
class Follow(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="follower", default="")
    followee = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followee", default="")
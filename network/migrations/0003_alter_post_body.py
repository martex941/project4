# Generated by Django 4.2.3 on 2023-07-25 09:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0002_post_like_follow'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='body',
            field=models.CharField(default='', max_length=250),
        ),
    ]

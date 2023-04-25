from django.db import models

# TODO: modify fiels of each model

class Document(models.Model):
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to="documents/")
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    metadata = models.JSONField()

    def __str__(self):
        return self.name


class Embedding(models.Model):
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to="documents/")
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    metadata = models.JSONField()

    def __str__(self):
        return self.name


class Index(models.Model):
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to="documents/")
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    metadata = models.JSONField()

    def __str__(self):
        return self.name


class Chain(models.Model):
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to="documents/")
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    metadata = models.JSONField()

    def __str__(self):
        return self.name

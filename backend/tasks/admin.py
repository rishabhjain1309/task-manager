from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'title',
        'status',
        'priority',
        'due_date',
        'created_at',
        'updated_at',
    )
    list_filter = (
        'status',
        'priority',
        'due_date',
        'created_at',
    )
    search_fields = (
        'title',
        'description',
    )
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    list_per_page = 25
    readonly_fields = ('created_at', 'updated_at')

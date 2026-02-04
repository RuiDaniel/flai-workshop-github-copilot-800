from django.contrib import admin
from .models import User, Team, Activity, Leaderboard, Workout


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'name', 'team', 'total_points', 'is_active', 'created_at']
    list_filter = ['team', 'is_active', 'created_at']
    search_fields = ['email', 'name']
    ordering = ['-total_points']
    readonly_fields = ['created_at']


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'total_points', 'get_members_count', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['-total_points']
    readonly_fields = ['created_at']

    def get_members_count(self, obj):
        return obj.members.count()
    get_members_count.short_description = 'Members'


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['user', 'activity_type', 'duration', 'distance', 'calories', 'points', 'date', 'created_at']
    list_filter = ['activity_type', 'date', 'created_at']
    search_fields = ['user__name', 'user__email', 'notes']
    ordering = ['-date', '-created_at']
    readonly_fields = ['created_at']
    date_hierarchy = 'date'


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ['rank', 'user', 'team', 'points', 'activities_count', 'updated_at']
    list_filter = ['team', 'updated_at']
    search_fields = ['user__name', 'user__email', 'team__name']
    ordering = ['rank']
    readonly_fields = ['updated_at']


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ['title', 'difficulty', 'exercise_type', 'duration', 'target_calories', 'target_points', 'created_at']
    list_filter = ['difficulty', 'exercise_type', 'created_at']
    search_fields = ['title', 'description', 'instructions']
    ordering = ['difficulty', 'title']
    readonly_fields = ['created_at']

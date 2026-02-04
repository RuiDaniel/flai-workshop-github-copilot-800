from rest_framework import serializers
from .models import User, Team, Activity, Leaderboard, Workout


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'team', 'total_points', 'created_at']
        read_only_fields = ['id', 'created_at']


class TeamSerializer(serializers.ModelSerializer):
    members_count = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'total_points', 'members_count', 'created_at']
        read_only_fields = ['id', 'created_at']

    def get_members_count(self, obj):
        return obj.members.count()


class ActivitySerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)

    class Meta:
        model = Activity
        fields = ['id', 'user', 'user_name', 'activity_type', 'duration', 'distance', 
                  'calories', 'points', 'date', 'notes', 'created_at']
        read_only_fields = ['id', 'created_at']


class LeaderboardSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)
    team_name = serializers.CharField(source='team.name', read_only=True)
    total_calories = serializers.SerializerMethodField()

    class Meta:
        model = Leaderboard
        fields = ['id', 'user', 'user_name', 'team', 'team_name', 'rank', 
                  'points', 'activities_count', 'total_calories', 'updated_at']
        read_only_fields = ['id', 'updated_at']

    def get_total_calories(self, obj):
        from django.db.models import Sum
        total = obj.user.activities.aggregate(total=Sum('calories'))['total']
        return total if total is not None else 0


class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ['id', 'title', 'description', 'difficulty', 'duration', 
                  'exercise_type', 'target_calories', 'target_points', 
                  'instructions', 'created_at']
        read_only_fields = ['id', 'created_at']

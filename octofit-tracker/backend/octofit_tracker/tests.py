from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from datetime import date
from .models import User, Team, Activity, Leaderboard, Workout


class TeamModelTest(TestCase):
    """Test Team model"""
    
    def setUp(self):
        self.team = Team.objects.create(
            name='Test Team',
            description='Test team description',
            total_points=100
        )
    
    def test_team_creation(self):
        """Test team is created correctly"""
        self.assertEqual(self.team.name, 'Test Team')
        self.assertEqual(self.team.total_points, 100)
        self.assertIsNotNone(self.team.created_at)
    
    def test_team_string_representation(self):
        """Test team string representation"""
        self.assertEqual(str(self.team), 'Test Team')


class UserModelTest(TestCase):
    """Test User model"""
    
    def setUp(self):
        self.team = Team.objects.create(name='Test Team', total_points=0)
        self.user = User.objects.create_user(
            email='test@example.com',
            name='Test User',
            password='testpass123',
            team=self.team,
            total_points=50
        )
    
    def test_user_creation(self):
        """Test user is created correctly"""
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertEqual(self.user.name, 'Test User')
        self.assertEqual(self.user.team, self.team)
        self.assertEqual(self.user.total_points, 50)
        self.assertTrue(self.user.is_active)
    
    def test_user_string_representation(self):
        """Test user string representation"""
        self.assertEqual(str(self.user), 'test@example.com')
    
    def test_unique_email_constraint(self):
        """Test email uniqueness"""
        with self.assertRaises(Exception):
            User.objects.create_user(
                email='test@example.com',
                name='Another User',
                password='pass123'
            )


class ActivityModelTest(TestCase):
    """Test Activity model"""
    
    def setUp(self):
        self.team = Team.objects.create(name='Test Team')
        self.user = User.objects.create_user(
            email='test@example.com',
            name='Test User',
            password='pass123',
            team=self.team
        )
        self.activity = Activity.objects.create(
            user=self.user,
            activity_type='running',
            duration=30,
            distance=5.0,
            calories=300,
            points=30,
            date=date.today(),
            notes='Morning run'
        )
    
    def test_activity_creation(self):
        """Test activity is created correctly"""
        self.assertEqual(self.activity.user, self.user)
        self.assertEqual(self.activity.activity_type, 'running')
        self.assertEqual(self.activity.duration, 30)
        self.assertEqual(self.activity.points, 30)


class TeamAPITest(APITestCase):
    """Test Team API endpoints"""
    
    def setUp(self):
        self.team = Team.objects.create(
            name='API Test Team',
            description='Test description',
            total_points=200
        )
    
    def test_get_teams_list(self):
        """Test retrieving teams list"""
        url = reverse('team-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data['results']), 1)
    
    def test_get_team_detail(self):
        """Test retrieving a single team"""
        url = reverse('team-detail', args=[self.team.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'API Test Team')
    
    def test_create_team(self):
        """Test creating a new team"""
        url = reverse('team-list')
        data = {
            'name': 'New Team',
            'description': 'New team description',
            'total_points': 0
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Team.objects.count(), 2)
        self.assertEqual(Team.objects.get(name='New Team').description, 'New team description')


class UserAPITest(APITestCase):
    """Test User API endpoints"""
    
    def setUp(self):
        self.team = Team.objects.create(name='Test Team')
        self.user = User.objects.create_user(
            email='apitest@example.com',
            name='API Test User',
            password='pass123',
            team=self.team,
            total_points=100
        )
    
    def test_get_users_list(self):
        """Test retrieving users list"""
        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data['results']), 1)
    
    def test_get_user_detail(self):
        """Test retrieving a single user"""
        url = reverse('user-detail', args=[self.user.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'apitest@example.com')


class ActivityAPITest(APITestCase):
    """Test Activity API endpoints"""
    
    def setUp(self):
        self.team = Team.objects.create(name='Test Team')
        self.user = User.objects.create_user(
            email='activity@example.com',
            name='Activity User',
            password='pass123',
            team=self.team
        )
    
    def test_create_activity(self):
        """Test creating a new activity"""
        url = reverse('activity-list')
        data = {
            'user': self.user.id,
            'activity_type': 'cycling',
            'duration': 45,
            'distance': 10.5,
            'calories': 400,
            'points': 40,
            'date': date.today().isoformat(),
            'notes': 'Evening ride'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Activity.objects.count(), 1)


class WorkoutAPITest(APITestCase):
    """Test Workout API endpoints"""
    
    def setUp(self):
        self.workout = Workout.objects.create(
            title='Test Workout',
            description='Test workout description',
            difficulty='beginner',
            duration=30,
            exercise_type='running',
            target_calories=300,
            target_points=30,
            instructions='1. Warm up\n2. Run\n3. Cool down'
        )
    
    def test_get_workouts_list(self):
        """Test retrieving workouts list"""
        url = reverse('workout-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data['results']), 1)
    
    def test_get_workout_detail(self):
        """Test retrieving a single workout"""
        url = reverse('workout-detail', args=[self.workout.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Workout')


class LeaderboardAPITest(APITestCase):
    """Test Leaderboard API endpoints"""
    
    def setUp(self):
        self.team = Team.objects.create(name='Test Team')
        self.user = User.objects.create_user(
            email='leader@example.com',
            name='Leader User',
            password='pass123',
            team=self.team,
            total_points=500
        )
        self.leaderboard = Leaderboard.objects.create(
            user=self.user,
            team=self.team,
            rank=1,
            points=500,
            activities_count=10
        )
    
    def test_get_leaderboard_list(self):
        """Test retrieving leaderboard"""
        url = reverse('leaderboard-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data['results']), 1)
    
    def test_leaderboard_ordering(self):
        """Test leaderboard is ordered by rank"""
        url = reverse('leaderboard-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # First entry should have rank 1
        self.assertEqual(response.data['results'][0]['rank'], 1)

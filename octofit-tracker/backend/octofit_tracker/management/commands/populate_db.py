from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import date, timedelta
import random
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Clearing existing data...')
        # Delete all existing data using Django ORM
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        User.objects.all().delete()
        Team.objects.all().delete()
        Workout.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Cleared existing data'))

        # Create Teams
        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(
            name='Team Marvel',
            description='Earth\'s Mightiest Heroes',
            total_points=0
        )
        team_dc = Team.objects.create(
            name='Team DC',
            description='Justice League Champions',
            total_points=0
        )
        self.stdout.write(self.style.SUCCESS(f'Created teams: {team_marvel.name}, {team_dc.name}'))

        # Create Users (Superheroes)
        self.stdout.write('Creating users...')
        marvel_heroes = [
            {'name': 'Iron Man', 'email': 'tony.stark@marvel.com'},
            {'name': 'Captain America', 'email': 'steve.rogers@marvel.com'},
            {'name': 'Thor', 'email': 'thor.odinson@marvel.com'},
            {'name': 'Black Widow', 'email': 'natasha.romanoff@marvel.com'},
            {'name': 'Hulk', 'email': 'bruce.banner@marvel.com'},
            {'name': 'Spider-Man', 'email': 'peter.parker@marvel.com'},
        ]

        dc_heroes = [
            {'name': 'Superman', 'email': 'clark.kent@dc.com'},
            {'name': 'Batman', 'email': 'bruce.wayne@dc.com'},
            {'name': 'Wonder Woman', 'email': 'diana.prince@dc.com'},
            {'name': 'The Flash', 'email': 'barry.allen@dc.com'},
            {'name': 'Aquaman', 'email': 'arthur.curry@dc.com'},
            {'name': 'Green Lantern', 'email': 'hal.jordan@dc.com'},
        ]

        marvel_users = []
        for hero in marvel_heroes:
            user = User.objects.create_user(
                email=hero['email'],
                name=hero['name'],
                password='password123',
                team=team_marvel,
                total_points=random.randint(100, 500)
            )
            marvel_users.append(user)
            self.stdout.write(f'Created user: {user.name}')

        dc_users = []
        for hero in dc_heroes:
            user = User.objects.create_user(
                email=hero['email'],
                name=hero['name'],
                password='password123',
                team=team_dc,
                total_points=random.randint(100, 500)
            )
            dc_users.append(user)
            self.stdout.write(f'Created user: {user.name}')

        all_users = marvel_users + dc_users
        self.stdout.write(self.style.SUCCESS(f'Created {len(all_users)} users'))

        # Create Activities
        self.stdout.write('Creating activities...')
        activity_types = ['running', 'cycling', 'swimming', 'weightlifting', 'yoga']
        activities_count = 0

        for user in all_users:
            # Create 5-10 activities per user
            num_activities = random.randint(5, 10)
            for i in range(num_activities):
                activity_date = date.today() - timedelta(days=random.randint(0, 30))
                activity_type = random.choice(activity_types)
                duration = random.randint(20, 120)
                distance = random.uniform(2.0, 20.0) if activity_type in ['running', 'cycling'] else None
                calories = duration * random.randint(5, 10)
                points = calories // 10

                Activity.objects.create(
                    user=user,
                    activity_type=activity_type,
                    duration=duration,
                    distance=round(distance, 2) if distance else None,
                    calories=calories,
                    points=points,
                    date=activity_date,
                    notes=f'{user.name} completed a {activity_type} session'
                )
                activities_count += 1

        self.stdout.write(self.style.SUCCESS(f'Created {activities_count} activities'))

        # Update team and user total points based on activities
        self.stdout.write('Updating points...')
        for user in all_users:
            user_activities = Activity.objects.filter(user=user)
            total_points = sum(activity.points for activity in user_activities)
            user.total_points = total_points
            user.save()

        # Update team points
        team_marvel.total_points = sum(user.total_points for user in marvel_users)
        team_marvel.save()
        team_dc.total_points = sum(user.total_points for user in dc_users)
        team_dc.save()
        self.stdout.write(self.style.SUCCESS('Updated user and team points'))

        # Create Leaderboard
        self.stdout.write('Creating leaderboard...')
        leaderboard_entries = []
        for user in all_users:
            activities_count = Activity.objects.filter(user=user).count()
            leaderboard_entries.append({
                'user': user,
                'team': user.team,
                'points': user.total_points,
                'activities_count': activities_count
            })

        # Sort by points descending
        leaderboard_entries.sort(key=lambda x: x['points'], reverse=True)

        # Create leaderboard entries with ranks
        for rank, entry in enumerate(leaderboard_entries, start=1):
            Leaderboard.objects.create(
                user=entry['user'],
                team=entry['team'],
                rank=rank,
                points=entry['points'],
                activities_count=entry['activities_count']
            )

        self.stdout.write(self.style.SUCCESS(f'Created {len(leaderboard_entries)} leaderboard entries'))

        # Create Workouts
        self.stdout.write('Creating workouts...')
        workouts = [
            {
                'title': 'Super Soldier Training',
                'description': 'Intense full-body workout inspired by Captain America',
                'difficulty': 'advanced',
                'duration': 60,
                'exercise_type': 'weightlifting',
                'target_calories': 600,
                'target_points': 60,
                'instructions': '1. Warm-up: 10 minutes\n2. Bench press: 4 sets x 12 reps\n3. Squats: 4 sets x 15 reps\n4. Pull-ups: 4 sets x 10 reps\n5. Core exercises: 15 minutes\n6. Cool-down: 10 minutes'
            },
            {
                'title': 'Speedster Sprint',
                'description': 'High-intensity cardio workout like The Flash',
                'difficulty': 'intermediate',
                'duration': 30,
                'exercise_type': 'running',
                'target_calories': 400,
                'target_points': 40,
                'instructions': '1. Warm-up jog: 5 minutes\n2. Sprint intervals: 10 x 100m\n3. Recovery jog between sprints\n4. Cool-down: 5 minutes'
            },
            {
                'title': 'Warrior Flow',
                'description': 'Flexibility and strength yoga session inspired by Wonder Woman',
                'difficulty': 'beginner',
                'duration': 45,
                'exercise_type': 'yoga',
                'target_calories': 250,
                'target_points': 25,
                'instructions': '1. Sun salutations: 5 rounds\n2. Warrior poses: hold for 1 minute each\n3. Balance poses: 5 minutes\n4. Core strengthening: 10 minutes\n5. Relaxation: 5 minutes'
            },
            {
                'title': 'Arc Reactor Cycling',
                'description': 'Endurance cycling workout with Iron Man\'s stamina',
                'difficulty': 'intermediate',
                'duration': 90,
                'exercise_type': 'cycling',
                'target_calories': 800,
                'target_points': 80,
                'instructions': '1. Easy pace: 15 minutes\n2. Moderate pace: 40 minutes\n3. Hill climbs: 20 minutes\n4. High intensity: 10 minutes\n5. Cool-down: 5 minutes'
            },
            {
                'title': 'Atlantean Swimming',
                'description': 'Aquatic workout session like Aquaman',
                'difficulty': 'advanced',
                'duration': 60,
                'exercise_type': 'swimming',
                'target_calories': 700,
                'target_points': 70,
                'instructions': '1. Warm-up: 400m easy\n2. Main set: 8 x 100m freestyle at high intensity\n3. Technique drills: 15 minutes\n4. Endurance set: 800m continuous\n5. Cool-down: 200m easy'
            },
            {
                'title': 'Web-Slinger Agility',
                'description': 'Bodyweight workout for agility like Spider-Man',
                'difficulty': 'beginner',
                'duration': 30,
                'exercise_type': 'other',
                'target_calories': 300,
                'target_points': 30,
                'instructions': '1. Warm-up: dynamic stretches 5 minutes\n2. Push-ups: 3 sets x 15\n3. Lunges: 3 sets x 20\n4. Burpees: 3 sets x 10\n5. Plank holds: 3 x 60 seconds\n6. Stretch: 5 minutes'
            }
        ]

        for workout_data in workouts:
            Workout.objects.create(**workout_data)

        self.stdout.write(self.style.SUCCESS(f'Created {len(workouts)} workouts'))

        # Summary
        self.stdout.write(self.style.SUCCESS('\n=== Database Population Complete ==='))
        self.stdout.write(f'Teams: {Team.objects.count()}')
        self.stdout.write(f'Users: {User.objects.count()}')
        self.stdout.write(f'Activities: {Activity.objects.count()}')
        self.stdout.write(f'Leaderboard Entries: {Leaderboard.objects.count()}')
        self.stdout.write(f'Workouts: {Workout.objects.count()}')
        self.stdout.write(self.style.SUCCESS('\nDatabase is ready for use!'))

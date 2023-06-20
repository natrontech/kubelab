import csv
import json
import os
import requests


class User:
    def __init__(self, id, name, email, username):
        self.id = id
        self.name = name
        self.email = email
        self.username = username


class ExerciseSession:
    def __init__(self, id, userId, startTime, endTime):
        self.id = id
        self.userId = userId
        self.startTime = startTime
        self.endTime = endTime


def get_request(url):
    try:
        headers = {'Content-type': 'application/json'}
        response = requests.get(url, headers=headers)
        return response
    except requests.exceptions.RequestException as e:
        print(e)


def main():
    exercises_sessions_url = os.environ['EXERCISE_SESSIONS_URL']
    users_url = os.environ['USERS_URL']
    csv_path = os.environ['CSV_PATH']

    exercise_sessions = get_exercise_sessions_from_exercise_sessions_url(
        exercises_sessions_url)
    users = get_users_from_users_url(users_url)

    # parse the data into a csv file
    with open(csv_path, mode='w') as file:
        writer = csv.writer(file)
        writer.writerow(["userId", "username", "email",
                        "exercise_session_id", "start_time", "end_time"])

        for user in users:
            for exercise_session in exercise_sessions:
                if user.id == exercise_session.userId:
                    writer.writerow([user.id, user.username, user.email, exercise_session.id,
                                     exercise_session.startTime, exercise_session.endTime])


def get_users_from_users_url(users_url):
    users = []
    response = get_request(users_url)
    if response.status_code == 200:
        users_json = json.loads(response.text)['items']
        print(users_json)
        for user_json in users_json:
            email = user_json.get('email')
            username = user_json.get('username')
            user = User(user_json['id'], user_json['name'], email, username)
            users.append(user)
    return users



def get_exercise_sessions_from_exercise_sessions_url(exercises_sessions_url):
    exercise_sessions = []
    response = get_request(exercises_sessions_url)
    if response.status_code == 200:
        exercise_sessions_json = json.loads(response.text)['items']
        print(exercise_sessions_json)
        for exercise_session_json in exercise_sessions_json:
            exercise_session = ExerciseSession(
                exercise_session_json['id'], exercise_session_json['user'], exercise_session_json['startTime'], exercise_session_json['endTime'])
            exercise_sessions.append(exercise_session)
    return exercise_sessions


if __name__ == '__main__':
    main()

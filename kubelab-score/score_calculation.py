

import json
import os
import requests


class User:
    def __init__(self, id, name, email):
        self.id = id
        self.name = name
        self.email = email

class ExerciseSession:
    def __init__(self, id, userId, startTime, endTime):
        self.id = id
        self.userId = userId
        self.startTime = startTime
        self.endTime = endTime

def get_request(url, data):
    try:
        headers = {'Content-type': 'application/json'}
        response = requests.get(url, data=json.dumps(data), headers=headers)
        return response
    except requests.exceptions.RequestException as e:
        print(e)


def main():
    exercises_sessions_url = os.environ['EXERCISE_SESSIONS_URL']
    users_url = os.environ['USERS_URL']
    csv_path = os.environ['CSV_PATH']

    exercise_sessions = get_exercise_sessions_from_exercise_sessions_url(csv_path)
    users = get_users_from_users_url(users_url)

    # print exercise sessions
    for exercise_session in exercise_sessions:
        print("Exercise session id: {}, userId: {}, startTime: {}, endTime: {}".format(exercise_session.id, exercise_session.userId, exercise_session.startTime, exercise_session.endTime))

    # print users
    for user in users:
        print("User id: {}, name: {}, email: {}".format(user.id, user.name, user.email))

def get_users_from_users_url(users_url):
    users = []
    response = get_request(users_url, None)
    if response.status_code == 200:
        users_json = json.loads(response.text)
        for user_json in users_json:
            user = User(user_json['id'], user_json['name'], user_json['email'])
            users.append(user)
    return users

def get_exercise_sessions_from_exercise_sessions_url(exercises_sessions_url):
    exercise_sessions = []
    response = get_request(exercises_sessions_url, None)
    if response.status_code == 200:
        exercise_sessions_json = json.loads(response.text)
        for exercise_session_json in exercise_sessions_json:
            exercise_session = ExerciseSession(exercise_session_json['id'], exercise_session_json['userId'], exercise_session_json['startTime'], exercise_session_json['endTime'])
            exercise_sessions.append(exercise_session)
    return exercise_sessions



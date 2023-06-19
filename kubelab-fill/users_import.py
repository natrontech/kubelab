

import csv
import json
import os
import requests

class User:
    def __init__(self, email, password, passwordConfirm, name):
        self.email = email
        self.password = password
        self.passwordConfirm = passwordConfirm
        self.name = name


def post_request(url, data):
    try:
        headers = {'Content-type': 'application/json'}
        response = requests.post(url, data=json.dumps(data), headers=headers)
        return response
    except requests.exceptions.RequestException as e:
        print(e)

def main():
    user_upload_url = os.environ['USER_UPLOAD_URL']
    path = os.environ['CSV_PATH']

    users = get_users_from_csv(path)

    for user in users:
        data = vars(user)
        response = post_request(user_upload_url, data)
        if response.status_code == 200:
            print("User {} uploaded successfully".format(user.name))
            # convert response.content bytes to json
            userId = json.loads(response.text)['id']
            print("User {} id: {}".format(user.name, userId))


def get_users_from_csv(path):
    users = []
    with open(path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            name = row['firstname'] + " " + row['lastname']
            user = User(row['email'], row['password'], row['password'], name)
            users.append(user)
    return users


if __name__ == '__main__':
    main()

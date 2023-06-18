import json
import os
import requests


class Lab:
    def __init__(self, title, description, docs):
        self.title = title
        self.description = description
        self.docs = docs


class Exercise:
    def __init__(self, title, description, docs, hint, solution, check, bootstrap, lab):
        self.title = title
        self.description = description
        self.docs = docs
        self.hint = hint
        self.solution = solution
        self.check = check
        self.bootstrap = bootstrap
        self.lab = lab


def post_request(url, data):
    try:
        headers = {'Content-type': 'application/json'}
        response = requests.post(url, data=json.dumps(data), headers=headers)
        print(response.text)
    except requests.exceptions.RequestException as e:
        print(e)


def main():
    # from .env import labs_upload_url, exercises_upload_url
    labs_upload_url = os.environ['LABS_UPLOAD_URL']
    exercises_upload_url = os.environ['EXERCISES_UPLOAD_URL']
    prefix = os.environ['URL_PREFIX']
    path = os.environ['WORSHOP_DIR_PATH']

    labs = get_labs_from_dir(path)
    exercises = get_exercises_from_dir(path)

    # sort labs and exercises
    labs.sort(key=lambda x: x.title)
    exercises.sort(key=lambda x: x.title)

    for lab in labs:
        data = {
            'title': lab.title,
            'description': lab.description,
            'docs': prefix + lab.docs
        }
        post_request(labs_upload_url, data)


def get_labs_from_dir(path):
    labs = []
    for name in os.listdir(path):
        if os.path.isdir(os.path.join(path, name)):
            prename = name
            number = name.split("_")[0]
            name = name.split("_")[1:]
            name = " ".join(name)
            name = number+" "+name.title()
            labs.append(
                Lab(
                    title=name,
                    description=name,
                    docs=prename+"/docs.md"
                )
            )
    return labs


def get_exercises_from_dir(path, level=1, parent=None):
    exercises = []
    for name in os.listdir(path):
        full_path = os.path.join(path, name)
        if os.path.isdir(full_path):
            if level == 2:
                prename = name
                number = name.split("_")[0]
                name = name.split("_")[1:]
                name = " ".join(name)
                name = number+" "+name.title()
                exercises.append(
                    Exercise(
                        title=name,
                        description=name,
                        docs=prename+"/docs.md",
                        hint=prename+"/hint.md",
                        solution=prename+"/solution.md",
                        check=prename+"/check.sh",
                        bootstrap=prename+"/bootstrap.sh",
                        lab=parent
                    )
                )
            exercises.extend(get_exercises_from_dir(full_path, level + 1, parent=name))
    return exercises


if __name__ == '__main__':
    main()

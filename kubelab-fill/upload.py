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
        return response
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
        response = post_request(labs_upload_url, data)
        if response.status_code == 200:
            print("Lab {} uploaded successfully".format(lab.title))
            # convert response.content bytes to json
            labId = json.loads(response.text)['id']
            print("Lab {} id: {}".format(lab.title, labId))
            for exercise in exercises:
                if exercise.lab == lab.title:
                    data = {
                        'title': exercise.title,
                        'description': exercise.description,
                        'docs': prefix + exercise.docs,
                        'hint': prefix + exercise.hint,
                        'solution': prefix + exercise.solution,
                        'check': prefix + exercise.check,
                        'bootstrap': prefix + exercise.bootstrap,
                        'lab': labId
                    }
                    response = post_request(exercises_upload_url, data)
                    if response.status_code == 200:
                        print("Exercise {} uploaded successfully".format(exercise.title))
                    else:
                        print("Exercise {} upload failed".format(exercise.title))


        else:
            print("Lab {} upload failed".format(lab.title))



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
                        docs=parent+"/"+prename+"/docs.md",
                        hint=parent+"/"+prename+"/hint.md",
                        solution=parent+"/"+prename+"/solution.md",
                        check=parent+"/"+prename+"/check.sh",
                        bootstrap=parent+"/"+prename+"/bootstrap.sh",
                        lab=parse_name(parent)
                    )
                )
            exercises.extend(get_exercises_from_dir(full_path, level + 1, parent=name))
    return exercises

def parse_name(name):
    name = name.split("_")
    number = name[0]
    name = name[1:]
    name = " ".join(name)
    name = number+" "+name.title()
    return name


if __name__ == '__main__':
    main()

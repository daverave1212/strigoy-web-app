from PIL import Image
from os import listdir
from os.path import join, isfile

files = [f for f in listdir('.') if isfile(join('.', f)) and f.endswith('.png')]

for file_name in files:
    image = Image.open(file_name)
    new_image = image.resize((128, 128))
    new_image.save(file_name)
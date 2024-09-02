from PIL import Image
import os
from os import listdir
from os.path import join, isfile
import pathlib

files = [f for f in listdir('.') if isfile(join('.', f)) and f.endswith('.png')]

for file_name in files:
    image = Image.open(file_name)
    new_image = image.resize((346, 346))
    dot_index = file_name.index('.')
    new_image_name = file_name[0:dot_index] + '.webp'
    new_image.save(new_image_name)
    os.remove(file_name)
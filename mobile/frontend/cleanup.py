#!/usr/bin/env python3
import os
import shutil

os.chdir(os.path.dirname(os.path.abspath(__file__)))

dirs_to_remove = ['node_modules', '.expo']
files_to_remove = ['package-lock.json']

for d in dirs_to_remove:
    if os.path.exists(d):
        shutil.rmtree(d)
        print(f'Removed {d}')

for f in files_to_remove:
    if os.path.exists(f):
        os.remove(f)
        print(f'Removed {f}')

print('Cleanup complete')

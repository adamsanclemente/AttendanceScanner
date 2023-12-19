from setuptools import setup, find_packages

setup(
    name='AttendanceScannerBackened',
    version='0.0.1',
    url='https://github.com/PixelParallax/AttendanceScanner',
    author='Author Name',
    author_email='asanclemen24@shawtech.org',
    description='Backend for Attendance Scanner',
    packages=find_packages(),    
    install_requires=[
        "requests",
    ],
)
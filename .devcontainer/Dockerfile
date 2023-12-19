# Use the bullseye version of Debian as the base image
FROM debian:bullseye



# Install Node.js
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

# Install Python 3 and pip
RUN apt-get install -y python3 python3-pip

# Set the working directory
WORKDIR /workspaces/AttendanceScanner

# Copy the project files to the container
COPY . /workspaces/AttendanceScanner
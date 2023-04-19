FROM python:3-alpine

# Create app directory
WORKDIR /flask

# Install app dependencies
COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt --no-cache-dir

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "flask", "run","--host","0.0.0.0","--port","8080"]
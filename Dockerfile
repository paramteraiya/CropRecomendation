FROM python:3.8


ADD . webapp

# Run requirements.py file
WORKDIR webapp
RUN pip install -r requirements.txt

EXPOSE 5000
CMD ["python","app.py"]
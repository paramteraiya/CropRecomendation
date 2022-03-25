from flask import Flask, url_for, render_template, request, redirect, session, send_file, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
import requests
import json
import os
import pickle
import numpy as np
from scipy import stats

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
db = SQLAlchemy(app)
cors = CORS(app)

result = None

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response


# Loading all Crop Recommendation Models
crop_xgb_pipeline = pickle.load(
    open("./models/crop_recommendation/xgb_pipeline.pkl", "rb")
)
crop_rf_pipeline = pickle.load(
    open("./models/crop_recommendation/rf_pipeline.pkl", "rb")
)
crop_knn_pipeline = pickle.load(
    open("./models/crop_recommendation/knn_pipeline.pkl", "rb")
)
crop_label_dict = pickle.load(
    open("./models/crop_recommendation/label_dictionary.pkl", "rb")
)


def convert(o):
    if isinstance(o, np.generic):
        return o.item()
    raise TypeError


def crop_prediction(input_data):
    prediction_data = {
        "xgb_model_prediction": crop_label_dict[
            crop_xgb_pipeline.predict(input_data)[0]
        ],
        "xgb_model_probability": max(crop_xgb_pipeline.predict_proba(input_data)[0])
                                 * 100,
        "rf_model_prediction": crop_label_dict[crop_rf_pipeline.predict(input_data)[0]],
        "rf_model_probability": max(crop_rf_pipeline.predict_proba(input_data)[0])
                                * 100,
        "knn_model_prediction": crop_label_dict[
            crop_knn_pipeline.predict(input_data)[0]
        ],
        "knn_model_probability": max(crop_knn_pipeline.predict_proba(input_data)[0])
                                 * 100,
    }

    all_predictions = [
        prediction_data["xgb_model_prediction"],
        prediction_data["rf_model_prediction"],
        prediction_data["knn_model_prediction"],
    ]

    all_probs = [
        prediction_data["xgb_model_probability"],
        prediction_data["rf_model_probability"],
        prediction_data["knn_model_probability"],
    ]

    if len(set(all_predictions)) == len(all_predictions):
        prediction_data["final_prediction"] = all_predictions[all_probs.index(max(all_probs))]
    else:
        prediction_data["final_prediction"] = stats.mode(all_predictions)[0][0]

    return prediction_data


def predict_crop(input_dictionary_object):
    try:
        column_names = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
        input_data = np.asarray([float(input_dictionary_object[i].strip()) for i in column_names]).reshape(
            1, -1
        )
        prediction_data = crop_prediction(input_data)
        json_obj = json.dumps(prediction_data, default=convert)
        return json_obj
    except:
        return json.dumps({"error": "Please Enter Valid Data"}, default=convert)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))

    def __init__(self, username, password):
        self.username = username
        self.password = password


@app.route('/', methods=['GET'])
def index():
    if session.get('logged_in'):
        return render_template('prediction.html')
        # return render_template('prediction.html', jsonfile=json.dumps(response_data))
    else:
        return render_template('index.html', message="Crop yield prediction system!")


@app.route('/guest-user', methods=['GET'])
def guest_user():
    return render_template('prediction.html')


@app.route('/register/', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        try:
            db.session.add(User(username=request.form['username'], password=request.form['password']))
            db.session.commit()
            return redirect(url_for('login'))
        except:
            return render_template('index.html', message="User Already Exists")
    else:
        return render_template('register.html')


@app.route('/login/', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    else:
        u = request.form['username']
        p = request.form['password']
        data = User.query.filter_by(username=u, password=p).first()
        if data is not None:
            session['logged_in'] = True
            return redirect(url_for('index'))
        return render_template('index.html', message="Incorrect Details")


@app.route('/logout', methods=['GET', 'POST'])
def logout():
    session['logged_in'] = False
    return redirect(url_for('index'))


@app.route('/predict_crop', methods=['GET', 'POST'])
def predict_crop_api():
    if request.method == "POST":
        form_values = request.get_data()
        form_values = json.loads(form_values)
        print("form_values: ", form_values)
        response = predict_crop(form_values)
        print("result:", response)
        return jsonify(response)
    
        # return render_template('result.html', jsonfile=json.dumps(response))
    # return "Result"

@app.route('/weather', methods=['GET', 'POST'])
def result1():
    session['logged_in'] = True
    return render_template('weather1.html')

@app.route('/news', methods=['GET', 'POST'])
def news():
    session['logged_in'] = True
    return render_template('news.html')

if __name__ == '__main__':
    app.secret_key = "ThisIsNotASecret:p"
    db.create_all()
    app.run()

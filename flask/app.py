import json
import requests
from flask import Flask, request, jsonify

import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator # scikit-learn
from scipy.stats import norm
from scipy.spatial.distance import cdist
import joblib
from tradition import TraditionalPNN

app = Flask(__name__) 


df = pd.read_csv(r"Dataset3.csv")
diseases = df['prognosis'].unique()


labels=['Acne', 'Alcoholic hepatitis', 'Allergy' ,'Arthritis' ,'Bronchial Asthma',
 'Cervical spondylosis', 'Chicken pox', 'Chronic cholestasis', 'Common Cold',
 'Dengue', 'Diabetes ', 'Dimorphic hemmorhoids(piles)', 'Drug Reaction',
 'Fungal infection' ,'GERD', 'Gastroenteritis' ,'Heart attack', 'Hepatitis B',
 'Hepatitis C' ,'Hepatitis D' ,'Hepatitis E', 'Hypertension ',
 'Hyperthyroidism' ,'Hypoglycemia' ,'Hypothyroidism', 'Impetigo' ,'Jaundice',
 'Malaria' ,'Migraine', 'Osteoarthristis', 'Peptic ulcer disease', 'Pneumonia',
 'Psoriasis', 'Tuberculosis' ,'Typhoid', 'Urinary tract infection',
 'Varicose veins', 'hepatitis A']

symptoms = ['itching', 'skin_rash', 'nodal_skin_eruptions', 'continuous_sneezing', 'shivering', 'chills', 'joint_pain', 'stomach_pain', 'acidity', 'ulcers_on_tongue', 'muscle_wasting', 'vomiting', 'burning_micturition', 'spotting_ urination',
            'fatigue', 'weight_gain', 'anxiety', 'cold_hands_and_feets', 'mood_swings', 'weight_loss', 'restlessness', 'lethargy', 'patches_in_throat', 
            'irregular_sugar_level', 'cough', 'high_fever', 'sunken_eyes', 'breathlessness', 'sweating', 'dehydration',
             'indigestion', 'headache', 'yellowish_skin', 'dark_urine', 'nausea', 'loss_of_appetite', 'pain_behind_the_eyes', 'back_pain', 'constipation', 'abdominal_pain', 
            'diarrhoea', 'mild_fever', 'yellow_urine', 'yellowing_of_eyes', 'acute_liver_failure', 'fluid_overload', 'swelling_of_stomach', 'swelled_lymph_nodes', 'malaise', 'blurred_and_distorted_vision', 
            'phlegm', 'throat_irritation', 'redness_of_eyes', 'sinus_pressure', 'runny_nose', 'congestion', 'chest_pain', 'weakness_in_limbs', 'fast_heart_rate', 'pain_during_bowel_movements', 'pain_in_anal_region', 'bloody_stool', 'irritation_in_anus', 'neck_pain', 'dizziness', 'cramps', 'bruising', 
            'obesity', 'swollen_legs', 'swollen_blood_vessels', 'puffy_face_and_eyes', 'enlarged_thyroid', 'brittle_nails', 'swollen_extremeties', 'excessive_hunger', 'extra_marital_contacts', 'drying_and_tingling_lips', 'slurred_speech', 'knee_pain', 'hip_joint_pain', 'muscle_weakness', 'stiff_neck', 
            'swelling_joints', 'movement_stiffness', 'spinning_movements', 'loss_of_balance', 'unsteadiness', 'weakness_of_one_body_side', 'loss_of_smell', 'bladder_discomfort', 'foul_smell_of urine', 'continuous_feel_of_urine', 
            'passage_of_gases', 'internal_itching', 'toxic_look_(typhos)', 'depression', 'irritability', 'muscle_pain', 'altered_sensorium', 'red_spots_over_body', 'belly_pain', 'abnormal_menstruation', 'dischromic _patches', 'watering_from_eyes', 'increased_appetite', 'polyuria', 'family_history',
              'mucoid_sputum', 'rusty_sputum', 'lack_of_concentration', 'visual_disturbances', 'receiving_blood_transfusion', 'receiving_unsterile_injections', 'coma', 'stomach_bleeding', 'distention_of_abdomen', 'history_of_alcohol_consumption', 'fluid_overload.1', 'blood_in_sputum', 'prominent_veins_on_calf', 'palpitations', 'painful_walking', 
            'pus_filled_pimples', 'blackheads', 'scurring', 'skin_peeling', 'silver_like_dusting', 'small_dents_in_nails', 'inflammatory_nails', 'blister', 'red_sore_around_nose', 'yellow_crust_ooze', 'enlarged_neck']




# Load saved PNN model
pnn = joblib.load('pnn_model.joblib')


# Get the list of symptoms for a given disease
def get_symptoms_for_disease():
    disease_name = input("Enter the name of a disease: ")
    disease_row = df[df["prognosis"] == disease_name]
    symptoms = []
    for column in df.columns[:-1]:
        if disease_row[column].values[0] == 1:
            symptoms.append(column)
    symptoms_formatted = [symptom.replace("_", " ").capitalize() for symptom in symptoms] 
    print("The symptoms of", disease_name, "are:", symptoms_formatted)
    return

# Get the symptoms from the user
def get_symptoms_from_user(symptoms_list):
    user_input = []
    # symptoms_list = input("Enter your symptoms (separated by commas): ").strip().split(',')
    for symptom in symptoms:
        if symptom.strip() in symptoms_list:
            user_input.append(1)
        else:
            user_input.append(0)
    return user_input

# Predict the disease for a given set of symptoms
def predict_disease(input_symptoms):
    user_input = get_symptoms_from_user(input_symptoms)
    predicted_diseases, predicted_probs = pnn.predict(np.array([user_input]))
    predicted_results = list(zip(predicted_diseases[0].astype(int), predicted_probs[0]))
    # print(predicted_diseases)
    # print(predicted_results)
    results = []
    for index, (disease, prob) in enumerate(predicted_results):
        prob = prob*10
        disease_name = labels[int(disease)]
        percent = round(prob * 100, 2)
        # print(f"{index+1}. {disease_name} - {percent}%")
        results.append({"disease" : disease_name, "prob" : percent , "info" : "", "doctors" : [], "symptoms" : [], "link" : ""})
    # print(results)
    return results



@app.route("/")
def home():
    return "Hello, Flask!"

@app.route('/flask/prediction',methods = ['POST'])
def predict():
    data = request.get_json()
    symptoms = data["symptoms"]
    result = predict_disease(symptoms)
    return jsonify({"result" : result})
    # return "hi"

import __main__
if __name__ == "__main__":
    __main__.TraditionalPNN = TraditionalPNN
    app.run(debug=True, host="0.0.0.0", port=8080)

# ## From Node.js to Python
# @app.route('/arraysum', methods=['POST'])
# def array_sum():
#     record = json.loads(request.data)
#     print(record)
    
#     result = 0
#     for item in record['array']:
#         result += item

#     return jsonify({"result" : result})


# ## From Python to Node.js
# @app.route('/arraysum', methods=['GET'])
# def sum_array():
#     array = [1,2,3,4,5,6,7,8,9,10]
#     data = {'array':array}
#     res = requests.post('http://127.0.0.1:3001/arraysum', json=data) 
#     returned_data = res.json() 
    
#     print(returned_data)
#     result = returned_data['result'] 
#     print("Sum of Array from Node.js:", result)

#     return jsonify({"result" : result})

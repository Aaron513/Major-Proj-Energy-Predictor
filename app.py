import pickle
from datetime import datetime

import lightgbm as lgb
import numpy as np
import pandas as pd
from flask import Flask, render_template, request

app = Flask(__name__)

# Load the trained LightGBM model
with open('model.pkl','rb') as f:
    lgbm_model=pickle.load(f)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predictor')
def predictor():
    return render_template('predictor.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/organisers')
def organisers():
    return render_template('organisers.html')

# Your calculation logic for comp value
def calculate_comp(tot_energy, avg_daily_comp):
    if tot_energy > (avg_daily_comp * 1.5):
        return "High"
    elif tot_energy > avg_daily_comp:
        return "Medium"
    else:
        return "Low"

@app.route('/result', methods=['POST'])
def submit():
    # Get form data
    building = float(request.form['building'])
    square_feet = float(request.form['square_feet'])
    res = int(request.form['res'])
    air_temperature = float(request.form['air_temperature'])
    dew_temperature = float(request.form['dew_temperature'])
    wind_speed = float(request.form['wind_speed'])
    primary_use = request.form['use']
    timestamp_str = request.form['timestamp']
    timestamp = datetime.strptime(timestamp_str, '%Y-%m-%dT%H:%M')
    month = timestamp.month
    day = timestamp.day
    hour = timestamp.hour

    # Create dictionary for data
    d = {
        'building': [building],
        'square_feet': [square_feet],
        'meter': [res],
        'air_temperature': [air_temperature],
        'dew_temperature': [dew_temperature],
        'wind_speed': [wind_speed],
        'Month': [month],
        'Day': [day],
        'Hour': [hour]
    }

    # Set primary use to 1
    primary_use_key = f'primary_use_{primary_use}'
    d[primary_use_key] = [1]

    # Set all other primary uses to 0
    all_primary_uses = [
        'Education', 'Entertainment', 'Food',
        'Healthcare', 'Lodging', 'Manufacturing', 'Office',
        'Other', 'Parking', 'Public', 'Religious', 'Retail',
        'Services', 'Technology', 'Utility', 'Warehouse'
    ]

    for use in all_primary_uses:
        if use != primary_use:
            use_key = f'primary_use_{use.replace("/", "_")}'  # Replace "/" with "_"
            d[use_key] = [0]

    #dicts for all meters
    for i in range(4):
        d['meter'] = [i]
        data = pd.DataFrame(d)

        # Make predictions
        s = 0
        for j in range(1, 25):
            data['Hour'] = j
            z = lgbm_model.predict(data)
            s += np.expm1(z)

        # Convert predicted energy to kW/h
        # predicted_energy_kwh = s / 1000
        if i == 0:
            predicted_energy_kwh_scalar_elec = abs(s[0])
        elif i == 1:
            predicted_energy_kwh_scalar_chill = abs(s[0])
        elif i == 2:
            predicted_energy_kwh_scalar_steam = abs(s[0])
        else:
            predicted_energy_kwh_scalar_hot = abs(s[0])

        
    tot_energy = predicted_energy_kwh_scalar_elec + predicted_energy_kwh_scalar_chill + predicted_energy_kwh_scalar_steam + predicted_energy_kwh_scalar_hot
    print(tot_energy)
    # print(predicted_energy_kwh_scalar_elec)
    # print(predicted_energy_kwh_scalar_chill)
    # print(predicted_energy_kwh_scalar_steam)
    # print(predicted_energy_kwh_scalar_hot)

    comp = None
    avg_daily_comp = square_feet / 540
    if tot_energy > (avg_daily_comp * 4):
        comp = "High"
    elif tot_energy > (avg_daily_comp):
        comp = "Medium"
    else:
        comp = "Low"

    print(avg_daily_comp)

    d['meter'] = [res]
    print(d)

    # Create DataFrame
    data = pd.DataFrame(d)

    # Make predictions
    s = 0
    for i in range(1, 25):
        data['Hour'] = i
        z = lgbm_model.predict(data)
        s += np.expm1(z)

    # Convert predicted energy to kW/h
    # predicted_energy_kwh = s / 1000

    predicted_energy_kwh_scalar = abs(s[0])

    return render_template('result.html', predicted_energy_kwh_scalar=predicted_energy_kwh_scalar, comp=comp, tot = tot_energy)

if __name__ == '__main__':
    app.run(debug=True)
from flask import Flask, send_file, request
import matplotlib
matplotlib.use('Agg') 
import matplotlib.pyplot as plt
import io
import requests
import numpy as np
app = Flask(__name__)

NODE_API = 'http://localhost:3000/api/v1/analytics'

@app.route('/chart/progress')
def chart_progress():
    user_id = request.args.get('user_id', None)
    token = request.args.get('token')
    headers = {
        'Authorization': f"Bearer {token}"
    }
    resp = requests.get(f'{NODE_API}/progress', params={'user_id': user_id},headers=headers)
    data = resp.json()
    dates = data['dates']
    completed = data['completed']
    plt.figure(figsize=(8,4))
    plt.plot(dates, completed, marker='o')
    plt.title('Task Completion Progress')
    plt.xlabel('Date')
    plt.ylabel('Tasks Completed')
    plt.tight_layout()
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()
    return send_file(img, mimetype='image/png')

@app.route('/chart/distribution')
def chart_distribution():
    user_id = request.args.get('user_id', None)
    token = request.args.get('token')
    headers = {
        'Authorization': f"Bearer {token}"
    }
    resp = requests.get(f'{NODE_API}/distribution', params={'user_id': user_id},headers=headers)
    data = resp.json()
    labels = data['labels']
    values = data['values']
    plt.figure(figsize=(6,6))
    plt.pie(values, labels=labels, autopct='%1.1f%%', startangle=140)
    plt.title('Task Distribution by Priority')
    plt.tight_layout()
    img = io.BytesIO() 
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()
    return send_file(img, mimetype='image/png')

@app.route('/chart/streak')
def chart_streak():
    user_id = request.args.get('user_id', None)
    token = request.args.get('token')
    headers = {
        'Authorization': f"Bearer {token}"
    }
    resp = requests.get(f'{NODE_API}/streak', params={'user_id': user_id},headers=headers)
    data = resp.json()
    days = data['days']
    streaks = data['streaks']
    plt.figure(figsize=(8,4))
    plt.bar(days, streaks, color='skyblue')
    plt.title('Streak Visualization')
    plt.xlabel('Habit')
    plt.ylabel('Current Streak')
    plt.tight_layout()
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()
    return send_file(img, mimetype='image/png')

@app.route('/chart/time-allocation')
def chart_time_allocation():    
    user_id = request.args.get('user_id', None)
    token = request.args.get('token')
    headers = {
        "Authorization": f"Bearer {token}"
    }
    resp = requests.get(f'{NODE_API}/time-allocation', params={'user_id': user_id},headers=headers)
    data = resp.json()
    categories = data['categories']
    times = np.array(data['times'])
    labels = data['labels']
    plt.figure(figsize=(10,5))
    bottom = np.zeros(len(labels))
    for i, cat_times in enumerate(times):
        plt.bar(labels, cat_times, bottom=bottom, label=categories[i])
        bottom += cat_times
    plt.title('Time Allocation Analysis')
    plt.xlabel('Day')
    plt.ylabel('Task Count (by Priority)')
    plt.legend()
    plt.tight_layout()
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()
    return send_file(img, mimetype='image/png')

@app.route('/chart/overdue-vs-completed')
def chart_overdue_vs_completed():
    user_id = request.args.get('user_id', None)

    token = request.args.get('token')
    print(token)
    headers = {
        'Authorization': f"Bearer {token}"
    }
    resp = requests.get(f'{NODE_API}/overdue-vs-completed', params={'user_id': user_id},headers=headers)
    data = resp.json()
    categories = data['categories']
    values = data['values']
    plt.figure(figsize=(7,3))
    plt.barh(categories, values, color=["#DAA8A8", "#2B5E3D"])
    plt.title('Overdue vs Completed Tasks')
    plt.xlabel('Number of Tasks')
    plt.tight_layout()
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()
    return send_file(img, mimetype='image/png')

if __name__ == '__main__':
    app.run(port=5001,debug=True) 
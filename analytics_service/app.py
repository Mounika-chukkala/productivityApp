from flask import Flask, send_file, request
import matplotlib
matplotlib.use('Agg') 
import matplotlib.pyplot as plt
import io
import os
import requests
import numpy as np
import time
app = Flask(__name__)
from dotenv import load_dotenv
load_dotenv()
NODE_API =  os.environ.get("NODE_API")

@app.route('/chart/progress')
def chart_progress():
    start_time = time.time()
    print(f"[INFO] /chart/progress called for user_id={request.args.get('user_id')}")
    user_id = request.args.get('user_id', None)
    token = request.args.get('token')
    headers = {
        'Authorization': f"Bearer {token}"
    }
    try:
        t0 = time.time()
        resp = requests.get(f'{NODE_API}/progress', params={'user_id': user_id},headers=headers)
        t1 = time.time()
        print(f"[INFO] Node backend /progress took {t1-t0:.2f}s, status={resp.status_code}")
        data = resp.json()
    except Exception as e:
        print(f"[ERROR] Failed to fetch /progress: {e}")
        return "Error fetching progress data", 500
    try:
        t2 = time.time()
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
        t3 = time.time()
        print(f"[INFO] Chart generation took {t3-t2:.2f}s")
    except Exception as e:
        print(f"[ERROR] Failed to generate progress chart: {e}")
        return "Error generating chart", 500
    print(f"[INFO] /chart/progress total time: {time.time()-start_time:.2f}s")
    return send_file(img, mimetype='image/png')

@app.route('/chart/distribution')
def chart_distribution():
    start_time = time.time()
    print(f"[INFO] /chart/distribution called for user_id={request.args.get('user_id')}")
    user_id = request.args.get('user_id', None)
    token = request.args.get('token')
    headers = {
        'Authorization': f"Bearer {token}"
    }
    try:
        t0 = time.time()
        resp = requests.get(f'{NODE_API}/distribution', params={'user_id': user_id},headers=headers)
        t1 = time.time()
        print(f"[INFO] Node backend /distribution took {t1-t0:.2f}s, status={resp.status_code}")
        data = resp.json()
    except Exception as e:
        print(f"[ERROR] Failed to fetch /distribution: {e}")
        return "Error fetching distribution data", 500
    try:
        t2 = time.time()
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
        t3 = time.time()
        print(f"[INFO] Chart generation took {t3-t2:.2f}s")
    except Exception as e:
        print(f"[ERROR] Failed to generate distribution chart: {e}")
        return "Error generating chart", 500
    print(f"[INFO] /chart/distribution total time: {time.time()-start_time:.2f}s")
    return send_file(img, mimetype='image/png')

@app.route('/chart/streak')
def chart_streak():
    start_time = time.time()
    print(f"[INFO] /chart/streak called for user_id={request.args.get('user_id')}")
    user_id = request.args.get('user_id', None)
    token = request.args.get('token')
    headers = {
        'Authorization': f"Bearer {token}"
    }
    try:
        t0 = time.time()
        resp = requests.get(f'{NODE_API}/streak', params={'user_id': user_id},headers=headers)
        t1 = time.time()
        print(f"[INFO] Node backend /streak took {t1-t0:.2f}s, status={resp.status_code}")
        data = resp.json()
    except Exception as e:
        print(f"[ERROR] Failed to fetch /streak: {e}")
        return "Error fetching streak data", 500
    try:
        t2 = time.time()
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
        t3 = time.time()
        print(f"[INFO] Chart generation took {t3-t2:.2f}s")
    except Exception as e:
        print(f"[ERROR] Failed to generate streak chart: {e}")
        return "Error generating chart", 500
    print(f"[INFO] /chart/streak total time: {time.time()-start_time:.2f}s")
    return send_file(img, mimetype='image/png')

@app.route('/chart/time-allocation')
def chart_time_allocation():    
    start_time = time.time()
    print(f"[INFO] /chart/time-allocation called for user_id={request.args.get('user_id')}")
    user_id = request.args.get('user_id', None)
    token = request.args.get('token')
    headers = {
        "Authorization": f"Bearer {token}"
    }
    try:
        t0 = time.time()
        resp = requests.get(f'{NODE_API}/time-allocation', params={'user_id': user_id},headers=headers)
        t1 = time.time()
        print(f"[INFO] Node backend /time-allocation took {t1-t0:.2f}s, status={resp.status_code}")
        data = resp.json()
    except Exception as e:
        print(f"[ERROR] Failed to fetch /time-allocation: {e}")
        return "Error fetching time allocation data", 500
    try:
        t2 = time.time()
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
        t3 = time.time()
        print(f"[INFO] Chart generation took {t3-t2:.2f}s")
    except Exception as e:
        print(f"[ERROR] Failed to generate time allocation chart: {e}")
        return "Error generating chart", 500
    print(f"[INFO] /chart/time-allocation total time: {time.time()-start_time:.2f}s")
    return send_file(img, mimetype='image/png')

@app.route('/chart/overdue-vs-completed')
def chart_overdue_vs_completed():
    start_time = time.time()
    print(f"[INFO] /chart/overdue-vs-completed called for user_id={request.args.get('user_id')}")
    user_id = request.args.get('user_id', None)
    token = request.args.get('token')
    headers = {
        'Authorization': f"Bearer {token}"
    }
    try:
        t0 = time.time()
        resp = requests.get(f'{NODE_API}/overdue-vs-completed', params={'user_id': user_id},headers=headers)
        t1 = time.time()
        print(f"[INFO] Node backend /overdue-vs-completed took {t1-t0:.2f}s, status={resp.status_code}")
        data = resp.json()
    except Exception as e:
        print(f"[ERROR] Failed to fetch /overdue-vs-completed: {e}")
        return "Error fetching overdue vs completed data", 500
    try:
        t2 = time.time()
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
        t3 = time.time()
        print(f"[INFO] Chart generation took {t3-t2:.2f}s")
    except Exception as e:
        print(f"[ERROR] Failed to generate overdue vs completed chart: {e}")
        return "Error generating chart", 500
    print(f"[INFO] /chart/overdue-vs-completed total time: {time.time()-start_time:.2f}s")
    return send_file(img, mimetype='image/png')

if __name__ == '__main__':
    port= int(os.environ.get("PORT", 5000))
    app.run(port=port,debug=True) 
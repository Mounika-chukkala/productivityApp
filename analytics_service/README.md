# Analytics Chart Service for Productivity App

This service provides analytics and visualization charts for your productivity app, using real data from your existing Node.js backend and MongoDB database.

## Features
- Task Completion Progress (Line Chart)
- Task Distribution by Priority (Pie Chart)
- Streak Visualization (Bar Chart)
- Time Allocation Analysis (Stacked Bar Chart)
- Overdue vs Completed Tasks (Horizontal Bar Chart)

## How It Works
- The Python Flask service fetches analytics data from your Node.js backend's `/api/v1/analytics/*` endpoints.
- It generates charts using Matplotlib and serves them as images.
- You can display these charts in your frontend using `<img src="...">` tags.

## Setup

### 1. Install Python Dependencies
```
pip install -r requirements.txt
```

### 2. Start the Python Service
```
python app.py
```
The service will run on `http://localhost:5001` by default.

### 3. Ensure Node.js Backend is Running
- The backend must expose the analytics endpoints under `/api/v1/analytics/`.
- The backend must be running on `http://localhost:5000` (or update `NODE_API` in `app.py` if different).

## Chart Endpoints
Each chart endpoint accepts a `user_id` query parameter:

- **Task Completion Progress:**
  - `GET /chart/progress?user_id=USERID`
- **Task Distribution by Priority:**
  - `GET /chart/distribution?user_id=USERID`
- **Streak Visualization:**
  - `GET /chart/streak?user_id=USERID`
- **Time Allocation Analysis:**
  - `GET /chart/time-allocation?user_id=USERID`
- **Overdue vs Completed Tasks:**
  - `GET /chart/overdue-vs-completed?user_id=USERID`

Replace `USERID` with the actual user's ID.

## Example Usage in Frontend
```html
<img src="http://localhost:5001/chart/progress?user_id=USERID" alt="Task Progress Chart" />
<img src="http://localhost:5001/chart/distribution?user_id=USERID" alt="Task Distribution Chart" />
<img src="http://localhost:5001/chart/streak?user_id=USERID" alt="Streak Chart" />
<img src="http://localhost:5001/chart/time-allocation?user_id=USERID" alt="Time Allocation Chart" />
<img src="http://localhost:5001/chart/overdue-vs-completed?user_id=USERID" alt="Overdue vs Completed Chart" />
```

## Customization
- To use a different backend URL, update the `NODE_API` variable in `app.py`.
- To add new charts, create new endpoints in both the Node.js backend and the Flask service.

## Notes
- The service uses real, live data from your app's database.
- If you add new fields (e.g., category, estimated time), update the backend analytics endpoints and the chart logic accordingly.

--- 
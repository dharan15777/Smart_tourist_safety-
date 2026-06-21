from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import math

app = Flask(__name__)
CORS(app)

# ── Calculate Distance (Haversine) ─────────────────────────
def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = (math.sin(d_lat/2)**2 +
         math.cos(math.radians(lat1)) *
         math.cos(math.radians(lat2)) *
         math.sin(d_lon/2)**2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

# ── Check Inactivity ───────────────────────────────────────
def check_inactivity(history):
    if not history or len(history) < 1:
        return {
            'isInactive': False,
            'hours': 0,
            'severity': 'NORMAL'
        }
    try:
        last = history[-1]
        last_time_str = last.get('timestamp', '')
        if not last_time_str:
            return {'isInactive': False, 'hours': 0, 'severity': 'NORMAL'}

        last_time = datetime.fromisoformat(
            last_time_str.replace('Z', '+00:00')
        )
        now = datetime.now(last_time.tzinfo)
        hours = (now - last_time).total_seconds() / 3600

        return {
            'isInactive': hours > 2,
            'hours':      round(hours, 2),
            'severity':   'CRITICAL' if hours > 4
                          else 'HIGH' if hours > 2
                          else 'NORMAL'
        }
    except Exception as e:
        return {'isInactive': False, 'hours': 0, 'severity': 'NORMAL'}

# ── Check Route Deviation ──────────────────────────────────
def check_deviation(current, planned_route):
    if not current or not planned_route:
        return {
            'isDeviated':  False,
            'distanceKm':  0,
            'severity':    'NORMAL'
        }
    try:
        min_distance = float('inf')
        for point in planned_route:
            d = haversine(
                current.get('lat', 0),
                current.get('lng', 0),
                point.get('lat', 0),
                point.get('lng', 0)
            )
            if d < min_distance:
                min_distance = d

        deviated = min_distance > 5

        return {
            'isDeviated':  deviated,
            'distanceKm':  round(min_distance, 2),
            'severity':    'HIGH'   if min_distance > 10
                           else 'MEDIUM' if deviated
                           else 'NORMAL'
        }
    except Exception as e:
        return {'isDeviated': False, 'distanceKm': 0, 'severity': 'NORMAL'}

# ── Detect Anomaly ─────────────────────────────────────────
def detect_anomaly(history):
    if not history or len(history) < 5:
        return {
            'isAnomaly': False,
            'reason':    'Insufficient data'
        }
    try:
        recent = history[-5:]
        total_distance = 0

        for i in range(1, len(recent)):
            d = haversine(
                recent[i-1].get('lat', 0),
                recent[i-1].get('lng', 0),
                recent[i].get('lat', 0),
                recent[i].get('lng', 0)
            )
            total_distance += d

        if total_distance < 0.05:
            return {
                'isAnomaly':        True,
                'reason':           'No significant movement detected',
                'totalMovementKm':  round(total_distance, 3)
            }

        return {
            'isAnomaly':        False,
            'totalMovementKm':  round(total_distance, 3)
        }
    except Exception as e:
        return {'isAnomaly': False, 'reason': str(e)}

# ── Calculate Safety Score ─────────────────────────────────
def calculate_score(inactivity, deviation, anomaly):
    score = 100

    # Deduct for inactivity
    if inactivity.get('isInactive'):
        hours = inactivity.get('hours', 0)
        score -= min(40, hours * 10)

    # Deduct for deviation
    if deviation.get('isDeviated'):
        km = deviation.get('distanceKm', 0)
        score -= min(30, km * 2)

    # Deduct for anomaly
    if anomaly.get('isAnomaly'):
        score -= 20

    score = max(0, min(100, score))

    if score >= 80:
        label, color = 'SAFE',     '#22C55E'
    elif score >= 60:
        label, color = 'MONITOR',  '#F59E0B'
    elif score >= 40:
        label, color = 'AT RISK',  '#F97316'
    else:
        label, color = 'CRITICAL', '#EF4444'

    return {
        'score': round(score, 1),
        'label': label,
        'color': color
    }

# ── Analyze Single Tourist ─────────────────────────────────
@app.route('/api/ai/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()

        location_history = data.get('locationHistory', [])
        planned_route    = data.get('plannedRoute', [])
        current_location = data.get('currentLocation', {})
        tourist_name     = data.get('name', 'Tourist')

        inactivity = check_inactivity(location_history)
        deviation  = check_deviation(current_location, planned_route)
        anomaly    = detect_anomaly(location_history)
        score      = calculate_score(inactivity, deviation, anomaly)

        return jsonify({
            'success':        True,
            'touristName':    tourist_name,
            'safetyScore':    score,
            'checks': {
                'inactivity': inactivity,
                'deviation':  deviation,
                'anomaly':    anomaly,
            },
            'needsAttention': score['score'] < 60,
            'analyzedAt':     datetime.now().isoformat()
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error':   str(e)
        }), 500

# ── Batch Analyze (for dashboard) ─────────────────────────
@app.route('/api/ai/batch', methods=['POST'])
def batch_analyze():
    try:
        tourists = request.get_json().get('tourists', [])
        results  = []

        for t in tourists:
            inactivity = check_inactivity(t.get('locationHistory', []))
            deviation  = check_deviation(
                t.get('currentLocation', {}),
                t.get('plannedRoute', [])
            )
            anomaly = detect_anomaly(t.get('locationHistory', []))
            score   = calculate_score(inactivity, deviation, anomaly)

            results.append({
                'userId':         t.get('userId'),
                'name':           t.get('name'),
                'safetyScore':    score,
                'needsAttention': score['score'] < 60,
            })

        return jsonify({
            'success':  True,
            'results':  results,
            'total':    len(results),
            'critical': len([r for r in results
                             if r['safetyScore']['score'] < 40])
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error':   str(e)
        }), 500

# ── Health Check ───────────────────────────────────────────
@app.route('/health')
def health():
    return jsonify({
        'status':    'OK',
        'service':   'AI Anomaly Detection',
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    print('🤖 AI Service starting on port 5001')
    app.run(debug=True, port=5001, host='0.0.0.0')
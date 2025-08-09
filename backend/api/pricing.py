# backend/api/pricing.py
from math import radians, sin, cos, acos
from .weather import estimate_wind_component, density_altitude_ft, runway_correction_factor

AIRPORTS = {
    "KTEB": {"lat": 40.85, "lon": -74.06, "rwy": 7000, "fees": 650, "elev_ft": 9},
    "KMIA": {"lat": 25.80, "lon": -80.28, "rwy": 13000, "fees": 450, "elev_ft": 8},
    "KLAS": {"lat": 36.08, "lon": -115.15, "rwy": 14500, "fees": 550, "elev_ft": 2181},
    "KVNY": {"lat": 34.21, "lon": -118.49, "rwy": 8000, "fees": 600, "elev_ft": 799},
    "KORD": {"lat": 41.9786, "lon": -87.9048, "rwy": 13000, "fees": 600, "elev_ft": 672},
    "KDEN": {"lat": 39.8617, "lon": -104.6731, "rwy": 16000, "fees": 600, "elev_ft": 5434},
    "KLAX": {"lat": 33.9416, "lon": -118.4085, "rwy": 12091, "fees": 700, "elev_ft": 125},
    "KSFO": {"lat": 37.6213, "lon": -122.3790, "rwy": 11870, "fees": 700, "elev_ft": 13},
    "KSEA": {"lat": 47.4502, "lon": -122.3088, "rwy": 11901, "fees": 650, "elev_ft": 433},
    "KJFK": {"lat": 40.6413, "lon": -73.7781, "rwy": 14572, "fees": 700, "elev_ft": 13},
    "KATL": {"lat": 33.6407, "lon": -84.4277, "rwy": 12390, "fees": 650, "elev_ft": 1026},
    "EGLL": {"lat": 51.4706, "lon": -0.4619, "rwy": 12000, "fees": 900, "elev_ft": 83},
    "LFPG": {"lat": 49.0097, "lon": 2.5479,  "rwy": 13700, "fees": 850, "elev_ft": 392},
    "LEBL": {"lat": 41.2974, "lon": 2.0833,  "rwy": 11155, "fees": 700, "elev_ft": 14},
    "LIRF": {"lat": 41.8003, "lon": 12.2389, "rwy": 12600, "fees": 750, "elev_ft": 13},
    "EDDF": {"lat": 50.0379, "lon": 8.5622,  "rwy": 13123, "fees": 800, "elev_ft": 364},
}


JETS = {
    "Light": [
        {"model":"Citation CJ3","speed_kts":410,"doc_hr_usd":2800,"min_rwy":4200},
        {"model":"Phenom 300","speed_kts":430,"doc_hr_usd":3000,"min_rwy":4300},
    ],
    "Midsize": [
        {"model":"Lear 60","speed_kts":440,"doc_hr_usd":3800,"min_rwy":5000},
        {"model":"Citation XLS","speed_kts":430,"doc_hr_usd":4000,"min_rwy":5000},
    ],
    "Super Mid": [
        {"model":"Challenger 350","speed_kts":460,"doc_hr_usd":5200,"min_rwy":5500},
        {"model":"Citation Latitude","speed_kts":446,"doc_hr_usd":5000,"min_rwy":5200},
    ],
    "Heavy": [
        {"model":"G450","speed_kts":480,"doc_hr_usd":7800,"min_rwy":6000},
        {"model":"Falcon 900","speed_kts":470,"doc_hr_usd":7600,"min_rwy":6000},
    ],
}

def gc_nm(a, b):
    if a not in AIRPORTS or b not in AIRPORTS: return None
    lat1, lon1 = AIRPORTS[a]["lat"], AIRPORTS[a]["lon"]
    lat2, lon2 = AIRPORTS[b]["lat"], AIRPORTS[b]["lon"]
    rad = lambda d: radians(d)
    deg = acos(sin(rad(lat1))*sin(rad(lat2)) + cos(rad(lat1))*cos(rad(lat2))*cos(rad(lon2-lon1)))
    return 60 * (deg * 180/3.1415926535)

def _find_model(name):
    for cat, models in JETS.items():
        for m in models:
            if m["model"] == name:
                return {**m, "category": cat}
    return None

def calc_price(
    depart, arrive, model,
    avg_wind_kts=0, margin_pct=20, taxi_min=20, reposition_nm=0,
    oat_c_depart=15, oat_c_arrive=15
):
    if depart not in AIRPORTS or arrive not in AIRPORTS:
        return {"error": "Unknown ICAO. Try KTEB, KMIA, KLAS, KVNY."}
    jet = _find_model(model)
    if not jet:
        return {"error": "Unknown jet model."}

    # Weather / performance
    da_dep = density_altitude_ft(AIRPORTS[depart]["elev_ft"], oat_c_depart)
    da_arr = density_altitude_ft(AIRPORTS[arrive]["elev_ft"], oat_c_arrive)
    perf_factor = max(runway_correction_factor(da_dep), runway_correction_factor(da_arr))
    required_runway = int(jet["min_rwy"] * perf_factor)

    rwy_limit = min(AIRPORTS[depart]["rwy"], AIRPORTS[arrive]["rwy"])
    if required_runway > rwy_limit:
        return {"error": f"{model} requires ~{required_runway} ft at current temps/DA; shortest runway is {rwy_limit} ft."}

    # Distance / wind-adjusted time
    dist = gc_nm(depart, arrive)
    spd = jet["speed_kts"]
    wind_ratio = estimate_wind_component(avg_wind_kts, spd)
    air_time_hr = dist / (spd * (1 - wind_ratio))
    taxi_hr = taxi_min / 60.0
    block_hr = air_time_hr + taxi_hr

    repo_hr = reposition_nm / spd if reposition_nm else 0.0
    doc_total = (block_hr + repo_hr) * jet["doc_hr_usd"]
    airport_fees = AIRPORTS[depart]["fees"] + AIRPORTS[arrive]["fees"]
    cost_basis = doc_total + airport_fees
    sell_price = round(cost_basis * (1 + margin_pct/100.0), 2)

    return {
        "route": {"depart": depart, "arrive": arrive, "distance_nm": round(dist)},
        "aircraft": {"category": jet["category"], "model": jet["model"], "speed_kts": spd},
        "assumptions": {
            "avg_wind_kts": avg_wind_kts, "taxi_min": taxi_min, "reposition_nm": reposition_nm,
            "margin_pct": margin_pct, "oat_c_depart": oat_c_depart, "oat_c_arrive": oat_c_arrive,
            "density_altitude_ft": {"depart": da_dep, "arrive": da_arr}, "required_runway_ft": required_runway,
        },
        "time": {"air_time_hr": round(air_time_hr, 2), "taxi_hr": round(taxi_hr, 2), "block_hr": round(block_hr, 2)},
        "costs": {"doc_total": round(doc_total, 2), "airport_fees": airport_fees, "cost_basis": round(cost_basis, 2)},
        "sell_price_usd": sell_price,
    }

import random
import joblib
from pathlib import Path
from sklearn.linear_model import LinearRegression
import numpy as np
from .pricing import calc_price, AIRPORTS, JETS

MODEL_PATH = Path(__file__).resolve().parent / "price_model.joblib"

def _encode_request(depart, arrive, model, avg_wind_kts, oat_c_depart, oat_c_arrive, margin_pct):
    dist = 0
    if depart in AIRPORTS and arrive in AIRPORTS:
        # small duplicate of gc to avoid circular import (or import gc_nm)
        from .pricing import gc_nm
        dist = gc_nm(depart, arrive) or 0
    # Simple feature vector
    return np.array([
        dist,
        avg_wind_kts,
        oat_c_depart,
        oat_c_arrive,
        margin_pct,
        len(model),  # silly proxy for model; replace with one-hot map in real impl
    ], dtype=float)

def train_synthetic(n=500):
    X, y = [], []
    airports = list(AIRPORTS.keys())
    models = [m["model"] for _, group in JETS.items() for m in group]
    for _ in range(n):
        depart, arrive = random.sample(airports, 2)
        model = random.choice(models)
        avg_wind = random.randint(-40, 40)
        oat_dep = random.uniform(-5, 35)
        oat_arr = random.uniform(-5, 35)
        margin = random.choice([10, 15, 20, 25, 30, 35])
        res = calc_price(depart, arrive, model, avg_wind, margin, 20, 0, oat_dep, oat_arr)
        if "sell_price_usd" not in res:  # skip infeasible
            continue
        X.append(_encode_request(depart, arrive, model, avg_wind, oat_dep, oat_arr, margin))
        y.append(res["sell_price_usd"])
    if not X:
        raise RuntimeError("No training samples generated")
    X = np.vstack(X); y = np.array(y)
    model = LinearRegression().fit(X, y)
    MODEL_PATH.unlink(missing_ok=True)
    joblib.dump(model, MODEL_PATH)
    return {"samples": len(y), "coef": model.coef_.tolist(), "intercept": float(model.intercept_)}

def predict_price(depart, arrive, model, avg_wind_kts, oat_c_depart, oat_c_arrive, margin_pct):
    if not MODEL_PATH.exists():
        train_synthetic(600)
    reg = joblib.load(MODEL_PATH)
    x = _encode_request(depart, arrive, model, avg_wind_kts, oat_c_depart, oat_c_arrive, margin_pct).reshape(1, -1)
    return float(reg.predict(x)[0])

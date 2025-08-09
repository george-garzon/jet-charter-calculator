from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .pricing import calc_price, AIRPORTS, JETS
from .ml import predict_price, train_synthetic
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.http import HttpResponse
from .pdf import render_quote_pdf
from .optimizer import optimize_assignment

@api_view(["POST"])
def optimize(request):
    try:
        d = request.data or {}
        aircraft = d.get("aircraft", [])
        legs = d.get("legs", [])
        # quick sanity
        if not aircraft or not legs:
            return Response({"error":"Provide 'aircraft' and 'legs' arrays"}, status=400)
        res = optimize_assignment(aircraft, legs)
        return Response(res, status=200 if "error" not in res else 400)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(["POST"])
def quote_pdf(_request):
    # Expect the same payload as /price; re-run calc to ensure consistency
    d = _request.data or {}
    base = calc_price(
        depart=d.get("depart_icao","").upper(),
        arrive=d.get("arrive_icao","").upper(),
        model=d.get("jet_model",""),
        avg_wind_kts=int(d.get("avg_wind_kts", 0)),
        margin_pct=float(d.get("margin_pct", 20)),
        taxi_min=int(d.get("taxi_min", 20)),
        reposition_nm=float(d.get("reposition_nm", 0)),
        oat_c_depart=float(d.get("oat_c_depart", 15)),
        oat_c_arrive=float(d.get("oat_c_arrive", 15)),
    )
    if "sell_price_usd" not in base:
        return Response(base, status=400)
    return render_quote_pdf(base)

@api_view(["GET"])
def catalog(_request):
    return Response({
        "airports": [{"icao": k, "fees": v["fees"], "rwy": v["rwy"]} for k, v in AIRPORTS.items()],
        "jets": [{"category": cat, "model": m["model"]} for cat, models in JETS.items() for m in models],
    })

@api_view(["POST"])
def price(_request):
    d = _request.data or {}
    out = calc_price(
        depart=d.get("depart_icao","").upper(),
        arrive=d.get("arrive_icao","").upper(),
        model=d.get("jet_model",""),
        avg_wind_kts=int(d.get("avg_wind_kts", 0)),
        margin_pct=float(d.get("margin_pct", 20)),
        taxi_min=int(d.get("taxi_min", 20)),
        reposition_nm=float(d.get("reposition_nm", 0)),
        oat_c_depart=float(d.get("oat_c_depart", 15)),
        oat_c_arrive=float(d.get("oat_c_arrive", 15)),
    )
    return Response(out)

@api_view(["POST"])
def price_with_ml(_request):
    d = _request.data or {}
    base = calc_price(
        depart=d.get("depart_icao","").upper(),
        arrive=d.get("arrive_icao","").upper(),
        model=d.get("jet_model",""),
        avg_wind_kts=int(d.get("avg_wind_kts", 0)),
        margin_pct=float(d.get("margin_pct", 20)),
        taxi_min=int(d.get("taxi_min", 20)),
        reposition_nm=float(d.get("reposition_nm", 0)),
        oat_c_depart=float(d.get("oat_c_depart", 15)),
        oat_c_arrive=float(d.get("oat_c_arrive", 15)),
    )

    if "sell_price_usd" not in base:
        return Response(base)
    ml_pred = predict_price(
        base["route"]["depart"], base["route"]["arrive"], base["aircraft"]["model"],
        base["assumptions"]["avg_wind_kts"], d.get("oat_c_depart", 15),
        d.get("oat_c_arrive", 15), base["assumptions"]["margin_pct"]
    )
    base["ml_prediction_usd"] = round(ml_pred, 2)
    base["ml_delta_usd"] = round(base["sell_price_usd"] - base["ml_prediction_usd"], 2)
    return Response(base)

@api_view(["POST"])
def train_model(_request):
    out = train_synthetic(800)
    return Response(out)

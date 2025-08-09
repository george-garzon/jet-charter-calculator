# Lightweight adapters; later swap real APIs
def estimate_wind_component(avg_wind_kts: int, cruise_speed_kts: int) -> float:
    """
    Return wind_ratio ∈ [-0.25, +0.25] to scale cruise speed.
    Positive = headwind slows you down.
    """
    wr = avg_wind_kts / max(1, cruise_speed_kts)
    return max(-0.25, min(0.25, wr))

def density_altitude_ft(elevation_ft: int, oat_c: float) -> int:
    """
    Approximate density altitude (Ft). Good enough for pricing gates.
    ISA: 15°C at SL, lapse 2°C per 1000 ft.
    """
    isa_at_field = 15 - (2 * (elevation_ft / 1000))
    delta = oat_c - isa_at_field
    # ≈ 120 ft per °C deviation from ISA + field elevation
    return int(elevation_ft + (120 * delta))

def runway_correction_factor(da_ft: int) -> float:
    """
    Crude performance factor: +10% runway per +2000 ft DA above sea level.
    """
    return 1.0 + max(0, (da_ft - 0) / 2000.0) * 0.10

from weasyprint import HTML, CSS
from django.http import HttpResponse
from .pricing import AIRPORTS, gc_nm

def _route_svg(depart, arrive, width=600, height=300):
    # naive projection to SVG coords (normalize lon/lat)
    min_lon = -125; max_lon = -66
    min_lat = 24;   max_lat = 49
    def x(lon): return (lon - min_lon) / (max_lon - min_lon) * width
    def y(lat): return height - (lat - min_lat) / (max_lat - min_lat) * height

    a, b = AIRPORTS[depart], AIRPORTS[arrive]
    x1, y1 = x(a["lon"]), y(a["lat"])
    x2, y2 = x(b["lon"]), y(b["lat"])
    return f"""
    <svg width="{width}" height="{height}" viewBox="0 0 {width} {height}">
      <rect width="100%" height="100%" fill="#f7fafc"/>
      <circle cx="{x1}" cy="{y1}" r="4" fill="#111"/><text x="{x1+6}" y="{y1-6}" font-size="12">{depart}</text>
      <circle cx="{x2}" cy="{y2}" r="4" fill="#111"/><text x="{x2+6}" y="{y2-6}" font-size="12">{arrive}</text>
      <line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#1a73e8" stroke-width="2"/>
    </svg>
    """

def render_quote_pdf(quote_data: dict) -> HttpResponse:
    depart = quote_data["route"]["depart"]; arrive = quote_data["route"]["arrive"]
    dist = quote_data["route"]["distance_nm"]
    model = quote_data["aircraft"]["model"]
    total = quote_data["sell_price_usd"]
    svg = _route_svg(depart, arrive)
    html = f"""
    <html>
    <head>
      <meta charset="utf-8"/>
      <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; }}
        .box {{ padding: 24px; }}
        .header {{ display:flex; justify-content:space-between; align-items:center; }}
        .card {{ border:1px solid #e5e7eb; border-radius:12px; padding:16px; margin-top:12px; }}
        h1 {{ margin:0 0 8px 0; }}
        .total {{ font-size: 20px; font-weight: 600; }}
      </style>
    </head>
    <body>
      <div class="box">
        <div class="header">
          <h1>Charter Quote</h1>
          <div class="total">${total}</div>
        </div>
        <div class="card">
          <div><b>Route:</b> {depart} → {arrive} • {dist} nm</div>
          <div><b>Aircraft:</b> {model}</div>
        </div>
        <div class="card">{svg}</div>
        <div class="card">
          <b>Breakdown</b>
          <ul>
            <li>DOC: ${quote_data["costs"]["doc_total"]}</li>
            <li>Airport Fees: ${quote_data["costs"]["airport_fees"]}</li>
            <li>Cost Basis: ${quote_data["costs"]["cost_basis"]}</li>
            <li>Margin: {quote_data["assumptions"]["margin_pct"]}%</li>
          </ul>
        </div>
      </div>
    </body>
    </html>
    """
    pdf = HTML(string=html).write_pdf(stylesheets=[CSS(string="")])
    resp = HttpResponse(pdf, content_type="application/pdf")
    resp["Content-Disposition"] = f'inline; filename="quote_{depart}_{arrive}.pdf"'
    return resp

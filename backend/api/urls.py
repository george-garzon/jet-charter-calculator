from django.urls import path
from .views import catalog, price, price_with_ml, train_model,quote_pdf, optimize

urlpatterns = [
    path("catalog", catalog),
    path("price", price),
    path("price-ml", price_with_ml),
    path("ml/train", train_model),
    path("quote.pdf", quote_pdf),
    path("optimizer/run", optimize)
]

# -*- coding: utf-8 -*-
{
    "name": "Product Price Checker & Product Discount Checker",
    "summary": """
        Display Customer Check Product Price and discount By Barcode Only
    """,
    "version": "18.0.0.0.0",
    "description": """
        Module use customer for check :
        - Product Price
        - Discount Product
        - Product Pricelist (Fix price sale)

    """,    
    "author": "ara soft",
    "maintainer": "ARA SOFT",
    "license" :  "OPL-1",
    "website": "",
    'images': ['static/description/banner_price_checker_v18.png'],
    "category": "Sales",
    "depends": [
        "product",
        "stock",
        "sale_management",
        "loyalty",
    ],
    "data": [
        "security/security.xml",
        "views/product_price_checker_view.xml",
        "views/res_config_settings_views.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "ara_product_price_checker/static/src/xml/*.*",
            "ara_product_price_checker/static/src/js/*.*",
        ],
    },   
    "installable": True,
    "application": True,
    "price"                 :  52.10,
    "currency"              :  "USD",
    "pre_init_hook"         :  "pre_init_check",
}

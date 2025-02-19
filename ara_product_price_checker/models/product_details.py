from odoo import api, fields, models, _
from odoo.exceptions import ValidationError
from odoo.tools import format_amount

class ProductPricelistItem(models.Model):
    _inherit = "product.pricelist.item"
    
    def get_pricelist(self, val):
        search_val = self.search([('product_tmpl_id', '=', val)], limit=1)
        if search_val:
            return {
                'product_tmpl_id': search_val.product_tmpl_id.id,
            }
        return False

class ProductTemplate(models.Model):
    _inherit = "product.template"

    def _construct_tax_string_custom(self, price):
        currency = self.currency_id
        res = self.taxes_id.compute_all(price, product=self, partner=self.env['res.partner'])
        joined = []
        included = res['total_included']
        if currency.compare_amounts(included, price):
            joined.append(_('%s Incl. Taxes', format_amount(self.env, included, currency)))
        excluded = res['total_excluded']
        if currency.compare_amounts(excluded, price):
            joined.append(_('%s Excl. Taxes', format_amount(self.env, excluded, currency)))
        if joined:
            tax_string = f"{', '.join(joined)}"
        else:
            tax_string = " "
        return tax_string

class ProductProduct(models.Model):
    _inherit = "product.product"

    @api.model
    def get_product_details(self, barcode):
        if not barcode:
            return False
        product = self.env['product.product'].sudo().search([('barcode', '=', barcode)])
        if not product:
            return False
        for product in product:
            IrDefaultGet = self.env['ir.default'].sudo()._get
            checker_pricelist = IrDefaultGet('res.config.settings', "checker_pricelist_id")
            search_pricelist = self.env['product.pricelist.item'].sudo().search([('product_tmpl_id', '=', product.product_tmpl_id.id),
                                                                                 ('date_start', '<=', fields.Date.today()),
                                                                                 ('date_end', '>=', fields.Date.today()),
                                                                                 ('pricelist_id', '=', checker_pricelist)], limit=1)
            search_loyalty = self.env['loyalty.rule'].sudo().search([('product_ids', 'in', product.id),
                                                                     ('active', '=', True),
                                                                     ('program_id.date_from', '<=', fields.Date.today()),  # Tanggal mulai harus sebelum atau sama dengan hari ini
                                                                     ('program_id.date_to', '>=', fields.Date.today())  # Tanggal selesai harus setelah atau sama dengan hari ini
                                                                     ])
            if search_pricelist:
                vals = {
                    'product_id':  product.id, 
                    'product_tmpl_id': product.product_tmpl_id.id,
                    'pricelist' : "{:,.2f}".format(search_pricelist[0].fixed_price).replace(",", ".") if search_pricelist else None,
                    'product_name' : product.name,
                    'product_description_sale' : product.description_sale,
                    'product_barcode': product.barcode,
                    'product_code': product.default_code,
                    'product_currency_id': product.currency_id.symbol,
                    'product_uom_id': product.uom_id.name,
                } 
            if not search_pricelist:
                vals = {
                    'product_id':  product.id, 
                    'product_tmpl_id': product.product_tmpl_id.id,
                    'product_name' : product.name,
                    'product_description_sale' : product.description_sale,
                    'product_barcode': product.barcode,
                    'product_code': product.default_code,
                    'product_currency_id': product.currency_id.symbol,
                    'product_uom_id': product.uom_id.name,
                } 
            if search_loyalty:
                vals['loyalty'] = [loyalty.program_id.name for loyalty in search_loyalty]
            if checker_pricelist:
                price = self.env['product.pricelist'].search([('id', '=', checker_pricelist)])._get_product_price(product, 1, False)
                tax_string = product.product_tmpl_id._construct_tax_string_custom(price)
                vals['product_price'] = "{:,.2f}".format(product.list_price).replace(",", ".")
                vals['product_price_tax'] = tax_string
                print(vals['product_price']) 
            else:
                vals['product_price'] = "{:,.2f}".format(product.list_price).replace(",", ".")
                vals['product_price_tax'] = product.tax_string  
                print(vals['product_price'])     
            return vals

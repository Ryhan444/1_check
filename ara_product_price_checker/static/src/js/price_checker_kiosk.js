/* @odoo-module */

import { Component, onWillStart, onMounted, useRef, onWillUpdateProps, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from '@web/core/utils/hooks';

export class ProductPriceChecker extends Component {
    static props = ["*"];
    static template = "product_price_checker.ProductPriceChecker";

    setup() {
        this.orm = useService("orm");
        this.checker_input_ref = useRef("checker_input");
        this.checker_clock_ref = useRef("checker_clock");
        
        this.state = useState({
            'product_id': '',
            'product_name': '',
            'product_description_sale': '',
            'product_price': '',
            'product_price_tax': '',
            'product_barcode': '',
            'product_code': '',
            'product_currency_id': '',
            'product_uom_id': '',
        });

        onMounted(async () => {
            this.start_focus();  
            this.checker_input_ref.el.addEventListener('input', () => this.onChangeInput());
            this.checker_input_ref.el.addEventListener('keydown', (event) => {
                if (event.key === "Enter") {
                    console.log("Enter detected, processing input...");
                    this.onChangeInput();
                }
            });
            this.setupAutoClear(); 
        });
    }
    setupAutoClear() {
        setInterval(() => {
            this.clearInput();
        }, 10000); // 10 seconds
    }
    clearInput() {
        this.checker_input_ref.el.value = '';
        this.state.product_id="";
        this.state.product_name="";
        this.state.product_description_sale="";
        this.state.product_price="";
        this.state.product_price_tax="";
        this.state.product_barcode="";
        this.state.product_code= "";
        this.state.product_currency_id="";
        this.state.product_uom_id="";
        this.state.product_pricelist ="";
        this.state.product_loyalty = "";
        this.onChangeInput();
        this.start_focus();
    }
    onClickButton0(){
        this.checker_input_ref.el.value = this.checker_input_ref.el.value + 0;
    }
    onClickButton1(){
        this.checker_input_ref.el.value = this.checker_input_ref.el.value + 1;
    }
    onClickButton2(){
        this.checker_input_ref.el.value = this.checker_input_ref.el.value + 2;
    }
    onClickButton3(){
        this.checker_input_ref.el.value = this.checker_input_ref.el.value + 3;
    }
    onClickButton4(){
        this.checker_input_ref.el.value = this.checker_input_ref.el.value + 4;
    }
    onClickButton5(){
        this.checker_input_ref.el.value = this.checker_input_ref.el.value + 5;
    }
    onClickButton6(){
        this.checker_input_ref.el.value = this.checker_input_ref.el.value + 6;
    }
    onClickButton7(){
        this.checker_input_ref.el.value = this.checker_input_ref.el.value + 7;
    }
    onClickButton8(){
        this.checker_input_ref.el.value = this.checker_input_ref.el.value + 8;
    }
    onClickButton9(){
        this.checker_input_ref.el.value = this.checker_input_ref.el.value + 9;
    }
    onClickButtonC(){
        this.checker_input_ref.el.value = '';
        this.start_focus();
        this.onClickButtonK();
    }
    onClickButtonB(){
        var value = this.checker_input_ref.el.value;
        if (value){
            this.checker_input_ref.el.value = value.substr(0, value.length - 1);
        }
        this.start_focus();
    }
    onChangeInput(){
        var value = this.checker_input_ref.el.value;
        if (value != undefined || value != ""){
            // Hapus karakter newline atau carriage return
            value = value.replace(/\r?\n|\r/g, '');
            this.checker_input_ref.el.value = value;
            this.get_product_details();
        }        
    }
    onClickButtonK(){
        this.get_product_details();
        // this.onClickButtonC();
    }
    start_focus(){
        var self = this;
        setTimeout(function(){
            const originalValue = self.checker_input_ref.el.value;
            self.checker_input_ref.el.value = '';
            self.checker_input_ref.el.focus();
            self.checker_input_ref.el.value = originalValue;
            self.checker_input_ref.el.focus();
        }, 0);
        self.checker_input_ref.el.focus();
    }
    start_clock () {
        var self = this;
        this.clock_start = setInterval(function() {
            self.checker_clock_ref.el.textContent = new Date().toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit', second:'2-digit'});
        }, 500);
        self.checker_clock_ref.el.textContent = new Date().toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit', second:'2-digit'});
    }
    async get_product_details(){        
        var self = this;
        var val = self.checker_input_ref.el.value;
        var product = false;
        if(val != undefined || val != ""){
            product = await self.orm.silent.call("product.product", "get_product_details", [val]);                      
        }
        self.render_html(product, val);
    }
    async render_html(product, val){
        var self = this;
        if(product && product['product_id'] !=false ){
            self.state.product_id=product['product_id'];
            self.state.product_name=product['product_name'];
            self.state.product_description_sale=product['product_description_sale'];
            self.state.product_price=product['product_price'];
            self.state.product_price_tax=product['product_price_tax'];
            self.state.product_barcode=product['product_barcode'];
            self.state.product_code=product['product_code'];
            self.state.product_currency_id=product['product_currency_id'];
            self.state.product_uom_id=product['product_uom_id'];
            self.state.product_pricelist = product['pricelist'];
            self.state.product_loyalty = product['loyalty'];
        }
        else{
            self.state.product_id="";
            self.state.product_name="";
            self.state.product_description_sale="";
            self.state.product_price="";
            self.state.product_price_tax="";
            self.state.product_barcode="";
            self.state.product_code= "";
            self.state.product_currency_id="";
            self.state.product_uom_id="";
            self.state.product_pricelist ="";
            self.state.product_loyalty = "";
        }
        setTimeout(function(){
            const originalValue = self.checker_input_ref.el.value;
            self.checker_input_ref.el.value = '';
            self.checker_input_ref.el.focus();
            self.checker_input_ref.el.value = originalValue;
        }, 0);
    }
}

ProductPriceChecker.components = {}
registry.category("actions").add("product_price_checker", ProductPriceChecker);

/**
 * Created by Анастасия on 20.03.2017.
 */
$(function() {
    $('#commentForm').validate({
        rules: {
            name: {
                required: true,
                minlength: 2
            },
            email: {
                required: true,
                email: true
            }
        },
        messages: {
            name: {
                required: "Введите ваше имя для связи с вами",
                minlength: jQuery.validator.format("Имя должно содержать не менее {0} символов")
            },
            tel: {
                required: "Введите ваш телефон для связи с вами"
},

            email: {
                required: "Введите ваш email для связи с вами",
                email: "Ваш email должен быть введен в формате name@domain.com"
            }
        },
        submitHandler: function(form, e) {
            e.preventDefault();
            $('#myModal').modal();
        }
    });

    $("#phone").mask("+7 (999) 999-9999");
});

new Vue ({
    el: '.app',

    data: {
        products: [
            {
                group: 'Короед',
                items: [
                    {id: 1, name:'Фракция 1,5-2,0 мм', expense: "300", bulk: '', amount: 1, price: '100',  checked: false,
                        netto: 1000},
                    {id: 2, name:'Фракция 2,0-2,5 мм', expense: "500", bulk: '', amount: 1, price: '200',  checked: false,
                        netto: 4000}
                ]
            },
            {
                group: 'Шуба',
                items: [
                    {id: 3, name:'Фракция 1,5-2,0 мм', expense: "800", bulk: '', amount: 1, price: '300',  checked: false,
                        netto: 2000},
                    {id: 4, name:'Фракция 2,0-2,5 мм', expense: "850", bulk: '', amount: 1, price: '400', checked: false,
                        netto: 3000}
                ]
            },
            {
                group: 'Клей',
                items: [
                    {id: 5, name:'ПВА', expense: "800", bulk: '', amount: 1, price: '150',  checked: false,
                        netto: 5000},
                    {id: 6, name:'Силикатный', expense: "850", bulk: '', amount: 1, price: '250',  checked: false,
                        netto: 5000}
                ]
            }
        ],

        totalSum: 0
    },

    methods: {
        changeAmount: function(id, amount) {
            for (var i = 0; i < this.products.length; i++){
                for (var j = 0; j < this.products[i].items.length; j++) {
                    if (this.products[i].items[j].id == id) {
                        this.products[i].items[j].amount += amount;
                        this.products[i].items[j].checked = true;
                        if (this.products[i].items[j].amount < 1) {
                            this.products[i].items[j].amount = 1;
                        }
                        this.products[i].items[j].bulk = Number(this.products[i].items[j].amount) * Number(this.products[i].items[j].netto);
                    }
                }
            }
            this.calculation();
        },

        calculation: function() {
            var totalSum = 0;
            for (var i = 0; i < this.products.length; i++){
                for (var j = 0; j < this.products[i].items.length; j++) {
                    if (this.products[i].items[j].checked) {
                        totalSum += this.products[i].items[j].amount * this.products[i].items[j].price;

                    }
                }
            }
            this.totalSum = totalSum;
        },

        calcExpense: function(id) {
            for (var i = 0; i < this.products.length; i++){
                for (var j = 0; j < this.products[i].items.length; j++) {
                    if (this.products[i].items[j].id == id) {
                        this.products[i].items[j].checked = true;
                        this.products[i].items[j].amount = Math.ceil(this.products[i].items[j].bulk / this.products[i].items[j].netto);
                    }
                }
            }
            this.calculation();
        }

    }
});



var Calculator = function (arguments) {
    if (this.orderInfo = [], "undefined" != typeof arguments) {
        var t = this;
        for (var e in arguments)this[e] = arguments[e];
        $(t.scope + " input, " + t.scope + " select").bind("keyup change", function () {
            t.getTotalCost()
        }), $(document).on("click", "#check-order", function () {
            t.orderModal()
        }), $(document).on("click", "#make-order", function (e) {
            e.preventDefault(), t.makeOrder()
        }), $(document).on("click", ".print-order", function (e) {
            e.preventDefault(), t.printOrder()
        }), $(t.scope + " #add-to-cart").on("click", function () {
            t.addToCart()
        }), $(document).on("click", ".remove-from-cart", function () {
            t.removeFromCart($(this).attr("data-order-id")), t.reloadModal()
        }), t.updateCart()
    }
};
Storage.prototype.setObj = function (t, e) {
    return this.setItem(t, JSON.stringify(e))
}, Storage.prototype.getObj = function (t) {
    return JSON.parse(this.getItem(t))
}, Calculator.prototype.error = function (t) {
    $("#calculator-error-message").html("<b>Ошибка:</b> " + t).removeClass("hidden"), $("#price-output").empty().parent().addClass("hidden")
}, Calculator.prototype.debugInfo = function (t) {
    this.orderInfo.push(t), "#debug" == window.location.hash && console.log(t)
}, Calculator.prototype.warning = function (t) {
    $("#calculator-warning-message").html("<b>Внимание:</b> " + t).removeClass("hidden")
}, Calculator.prototype.validator = function () {
    return {
        isInt: function (t) {
            return t % 1 === 0
        }, isPositive: function (t) {
            return t > 0
        }
    }
}, Calculator.prototype.clean = function () {
    console.clear(), $(this.scope + " #total-cost").empty().parent().addClass("hidden"), $(this.scope + " #calculator-error-message").addClass("hidden"), $(this.scope + " #calculator-warning-message").addClass("hidden")
}, Calculator.prototype.compose = function (t, e, i) {
    "undefined" == typeof t && (t = this.getSize()), "undefined" == typeof e && (e = 4);
    var i = i || [312, 442], s = Math.floor(i[0] / (t.width + e)) * Math.floor(i[1] / (t.height + e)),
        a = Math.floor(i[0] / (t.height + e)) * Math.floor(i[1] / (t.width + e));
    return this.debugInfo("Изделий на лист: " + Math.max(s, a)), Math.max(s, a)
}, Calculator.prototype.countPrintPrice = function (t, e) {
    for (var i = 0; i < t.length; i++)t[i].value = t[i].cost;
    return this.countRangeCoefficient(t, e) * this.data.sets.usd * e
}, Calculator.prototype.countCuttingPrice = function (t, e) {
    for (var i = this.data.postpress.cutting, s = 0; s < i.length; s++) {
        var a = i[s].quantityRange.split("-");
        if (t >= a[0] && t <= a[1])for (var o = 0; o < i[s].sheetRanges.length; o++) {
            var r = i[s].sheetRanges[o].range.split("-");
            if (e >= r[0] && e <= r[1])return e > 100 ? i[s].sheetRanges[o].cost * (Math.ceil(e / 99) - 1) : Number(i[s].sheetRanges[o].cost)
        }
    }
    return 0
}, Calculator.prototype.countLaminationPrice = function (t, e) {
    t = $(t).val().split(","), lamination = this.data.postpress.lamination.ranges[t[0]], cost = this.data.postpress.lamination.ranges[t[0]][t[1]] * this.data.sets.usd, rates = [];
    for (var i in lamination.rates)rates.push({range: i, value: lamination.rates[i]});
    return laminationСoefficient = this.countRangeCoefficient(rates, e), laminationCost = laminationСoefficient * cost * e, laminationReserve = Math.max(laminationCost / e * 2, laminationCost / 100 * 3), this.debugInfo("Запас на ламинации " + laminationReserve), laminationCost += laminationReserve, laminationCost = Math.max(laminationCost, this.data.postpress.lamination.min), this.debugInfo("Цена за ламинацию " + laminationCost), laminationCost
}, Calculator.prototype.countCreasePrice = function (t) {
    function e(e) {
        ranges = [];
        for (var i in e)ranges.push({range: i, value: e[i]});
        return self.countRangeCoefficient(ranges, t)
    }

    if (self = this, t < 1 || !this.validator().isInt(t))throw new this.error("Неверное количество бигов.");
    return this.debugInfo("======Биговка======"), bindingEdgeWidth = this.bindingEdgeWidth(), crossBindingEdgeWidth = this.crossBindingEdgeWidth(), autoCreasingCost = e(this.data.postpress.crease.auto) * t + Number(this.data.postpress.crease.fitting), manualCreasingCost = e(this.data.postpress.crease.manual) * t, this.debugInfo("Ширина стороны биговки " + bindingEdgeWidth + " ширина противоположной стороны " + crossBindingEdgeWidth), bindingEdgeWidth > 150 && bindingEdgeWidth < 320 && crossBindingEdgeWidth > 200 ? (this.debugInfo("Моргана стоимость " + autoCreasingCost), this.debugInfo("Ручная стоимость " + manualCreasingCost), autoCreasingCost <= manualCreasingCost ? (this.debugInfo("Биговка на моргане"), creaseCost = autoCreasingCost) : (creaseCost = manualCreasingCost, this.debugInfo("Ручная биговка"))) : (creaseCost = manualCreasingCost, this.debugInfo("Ручная биговка")), this.debugInfo("Количеcтво бигов " + t), creaseCostReserve = Math.max(creaseCost / 100 * this.data.postpress.crease.reserve, creaseCost / t * 2), this.debugInfo("Запас на биговке " + creaseCostReserve), creaseCost = Math.max(creaseCost + creaseCostReserve, this.data.postpress.crease.min), this.debugInfo("Цена за биговку " + creaseCost), this.debugInfo("=================="), creaseCost
}, Calculator.prototype.countDrillingPrice = function (t) {
    ranges = [], drillingRanges = this.data.postpress.drilling.ranges;
    for (var e in drillingRanges)ranges.push({range: e, value: drillingRanges[e]});
    return drillingCost = Math.max(this.countRangeCoefficient(ranges, t) * t, this.data.postpress.drilling.min), this.debugInfo("Цена за сверление " + drillingCost), drillingCost
}, Calculator.prototype.countSpringPrice = function (t, e, i) {
    this.debugInfo("======Пружина======"), e = e || this.thickness, i = i || this.quantity, springsSorted = [];
    for (var s in t)springsSorted.push(Number(s));
    springsSorted.sort(function (t, e) {
        return t - e
    });
    for (var s = 0; s < springsSorted.length; s++)if (this.thickness <= t[springsSorted[s]].thickness) {
        matchedSpring = t[springsSorted[s]], matchedSpring.springDiameter = springsSorted[s];
        break
    }
    var a = this.data.postpress.coefficients.spring;
    ranges = [];
    for (var s in a)ranges.push({range: s, value: a[s]});
    if (springCoefficient = this.countRangeCoefficient(ranges, i), this.$totalCost && this.$totalCost.append('<h4 class="text-right">Диаметр пружины ' + matchedSpring.springDiameter + " мм</h4>"), this.debugInfo("Коефициент пружины " + springCoefficient), this.debugInfo("Диаметр пружины " + matchedSpring.springDiameter), bindingEdgeWidth = this.bindingEdgeWidth(), this.debugInfo("Ширина стороны скрепления " + bindingEdgeWidth), t === this.data.supplies.spring.plastic) {
        if (bindingEdgeWidth > 297)throw new this.error("Максимальная длина пластиковой пружины 297мм");
        springsQuantity = Math.ceil(i / Math.floor(297 / bindingEdgeWidth)), springCost = springCoefficient * matchedSpring.cps * springsQuantity * this.data.sets.usd
    } else ringsAmount = Math.floor(bindingEdgeWidth / matchedSpring.step * i), this.debugInfo("Колчичество колец " + ringsAmount), springCost = springCoefficient * ringsAmount * matchedSpring.cpr * this.data.sets.usd;
    return this.debugInfo("Стоимость пружины " + springCost), this.debugInfo("================="), springCost
}, Calculator.prototype.bindingEdgeWidth = function () {
    return size = this.getSize(), "long" == $("#binding-edge").val() ? Math.max(size.width, size.height) : Math.min(size.width, size.height)
}, Calculator.prototype.crossBindingEdgeWidth = function () {
    return size = this.getSize(), "long" == $("#binding-edge").val() ? Math.min(size.width, size.height) : Math.max(size.width, size.height)
}, Calculator.prototype.orderModal = function () {
    "undefined" != typeof sessionStorage.orders && (this.reloadModal(), $("#order").modal())
}, Calculator.prototype.reloadModal = function () {
    orders = sessionStorage.getObj("orders"), list = $("#orders-list").empty(), cost = 0;
    for (var t = 0; t < orders.length; t++)list.append('<div class="item"><div class="remove-from-cart text-danger" data-order-id="' + t + '">&times;</div><div class="title">' + orders[t].details.join(".<br>") + '</div><div class="cost">Сумма ' + orders[t].cost + " грн, c НДС " + this.getCostWithVAT(orders[t].cost) + " грн</div></div>"), cost += Number(orders[t].cost);
    $("#order #total").empty(), $("#order .order-cart h2").empty(), cost < 100 && !list.is(':contains("Визитные карточки")') ? $("#order #total").html('<p class="minimal">Уважаемый заказчик! К сожалению, Ваш заказ меньше суммы минимального заказа. Если у Вас нет необходимости в печати другой продукции, стоимость Вашего заказа составит <b>100</b> грн</p>') : $("#order #total").text("Итого " + cost + " грн, c НДС " + this.getCostWithVAT(cost) + " грн"), this.orderCost = cost, orders.length || $("#order").modal("hide")
}, Calculator.prototype.countRangeCoefficient = function (t, e) {
    for (var i = 0; i < t.length; i++) {
        var s = t[i].range.split("-"), a = Number(s[0]), o = Number(s[1]);
        if (e >= a && e <= o) {
            var r = t[i].value;
            if (o == 1 / 0)return t[i].value;
            var n = t[i + 1].value, h = (r - n) / 100, l = 100 / (o - a) * (e - a);
            return t[i].value - h * l
        }
    }
}, Calculator.prototype.getSize = function () {
    var t = $("#size").val();
    "custom" == t ? t = {
        width: $(this.scope + " #custom-size-width").val(),
        height: $(this.scope + " #custom-size-height").val()
    } : (sizes = t.split("x"), t = {width: sizes[0], height: sizes[1]});
    for (var e in t)if (t[e] = Number(t[e]), t[e] < 1 || isNaN(t[e]))throw new this.error("Указан неправильный размер");
    return t
}, Calculator.prototype.getTotal = function () {
    return this.total.toFixed(0)
}, Calculator.prototype.getTotalWithVAT = function () {
    return (this.total + this.total / 100 * this.data.sets.vat).toFixed(0)
}, Calculator.prototype.getCostWithVAT = function (t) {
    return t = Number(t), (t + t / 100 * this.data.sets.vat).toFixed(0)
}, Calculator.prototype.addToCart = function () {
    "undefined" == typeof sessionStorage.orders && sessionStorage.setObj("orders", []), orders = sessionStorage.getObj("orders"), orders.push(this.order), sessionStorage.setObj("orders", orders), $(".added-message").fadeToggle(500).delay(2e3).fadeOut(), this.updateCart()
}, Calculator.prototype.removeFromCart = function (t) {
    orders = sessionStorage.getObj("orders"), orders.splice(t, 1), sessionStorage.setObj("orders", orders), this.updateCart()
}, Calculator.prototype.updateCart = function () {
    if ("undefined" != typeof sessionStorage.orders) {
        $(".cart").empty(), orders = sessionStorage.getObj("orders"), cost = 0;
        for (var t = 0; t < orders.length; t++)cost += Number(orders[t].cost);
        orders.length ? ($(".cart").append('<div class="message">В корзине ' + orders.length + " товаров на сумму " + cost + ' грн.</div class="message"><div class="btn btn-success" id="check-order">Оформить заказ</div>'), $(".cart").removeClass("hidden")) : $(".cart").addClass("hidden")
    }
}, Calculator.prototype.makeOrder = function () {
    form = $("#order-form");
    var t = new FormData(form[0]);
    return order = [], self = this, $.each(form.find(".item"), function (t, e) {
        orderData = [$(e).find(".title").text(), $(e).find(".cost").text()].join("<br>"), order.push(++t + ". " + orderData + "<br>")
    }), this.orderCost < this.data.sets.min ? order.push("Минимальный заказ " + this.data.sets.min + " грн.") : order.push($("#order-form #total").text()), $('#order-form [name="file"]').prop("files").length && (fileSize = $('#order-form [name="file"]').prop("files")[0].size / 1024 / 1024, fileSize > 10) ? void alert("Размер файла превышает 10мб. Попробуйте загрузить на файлообменник.") : $.trim($('#order-form [name="name"]').val()) ? $.trim($('#order-form [name="phone"]').val()) ? $.trim($('#order-form [name="email"]').val()) ? form[0].checkValidity() ? ($("#make-order").button("loading"), t.append("order", order.join("<br>")), void $.ajax({
        url: "/make-order",
        type: "POST",
        data: t,
        async: !1,
        cache: !1,
        contentType: !1,
        processData: !1,
        success: function (t) {
            t.success ? ($("#order .cart").fadeOut(), $("#order .success-msg").fadeIn(), $("#order").one("hidden.bs.modal", function () {
                sessionStorage.setObj("orders", []), self.updateCart(), $("#order .cart").show(), $("#order .success-msg").hide()
            })) : (console.log(t), alert("Ошибка. " + t.msg))
        }
    }).always(function () {
        $("#make-order").button("reset")
    })) : void alert("Не допустимый E-mail.") : void alert("E-mail не заполнен.") : void alert("Телефон не заполнен.") : void alert("Имя не заполнено.")
}, Calculator.prototype.printOrder = function () {
    form = $("#order-form");
    new FormData(form[0]);
    order = [], $.each(form.find(".item"), function (t, e) {
        orderData = [$(e).find(".title").text(), $(e).find(".cost").text()].join("<br>"), order.push(++t + ". " + orderData)
    }), this.orderCost < this.data.sets.min && order.join().indexOf("Визитные карточки") === -1 && order.push("Минимальный заказ " + this.data.sets.min + " грн."), order.push("<hr>"), "" !== $('#order-form [name="name"]').val() && order.push("Имя:" + $('#order-form [name="name"]').val()), "" !== $('#order-form [name="phone"]').val() && order.push("Телефон:" + $('#order-form [name="phone"]').val()), "" !== $('#order-form [name="email"]').val() && order.push("E-mail:" + $('#order-form [name="email"]').val()), "" !== $('#order-form [name="body"]').val() && order.push("Комментарий:" + $('#order-form [name="body"]').val());
    var t = window.open("", "", "height=0,width=0");
    t.document.write("<html><head><title></title>"), t.document.write("</head><body >"), t.document.write(order.join("<br>")), t.document.write("</body></html>"), t.document.close(), t.focus(), t.print(), t.close()
}, $(function () {
    $('[data-toggle="popover"]').popover({
        trigger: "hover",
        html: !0
    }), $('#order-form [name="name"], #order-form [name="phone"], #order-form [name="email"]').on("keyup", function (t) {
        t.preventDefault(), $input = $(t.target), $.trim($input.val()) ? $input.closest(".form-group").removeClass("has-error").addClass("has-success") : $input.closest(".form-group").removeClass("has-success").addClass("has-error")
    })
}), BindingCalculator = function (arguments) {
    Calculator.call(this, arguments)
}, BindingCalculator.prototype = new Calculator, BindingCalculator.prototype.getTotalCost = function () {
    if (this.clean(), console.clear(), this.quantity = $("#quantity").val(), this.thickness = Number($(this.scope + " #thickness").val().replace(",", ".")), this.quantity < 1 || !this.validator().isInt(this.quantity))throw new this.error("Неправильный формат данных в поле: Тираж");
    if (this.total = 0, fastening = $("#fastening-method").val(), 0 == fastening || 1 == fastening) {
        if (0 == fastening ? (springs = this.data.supplies.spring.metall, maxThickness = 22) : (maxThickness = 45, springs = this.data.supplies.spring.plastic), this.thickness > maxThickness)throw new this.error("Ваше изделие толще " + maxThickness + " миллиметров, это максимальная допустимая толщина для этого вида скрепления, Пожалуйста, выберите выберите другой вид переплета");
        springCost = this.countSpringPrice(springs), punchingAmount = Math.ceil(this.thickness / this.data.postpress["punching-width"]) * this.quantity, punchingCost = punchingAmount * this.data.postpress.punching, this.debugInfo("Количество хрумов " + punchingAmount), this.debugInfo("Стоимость хрумов " + punchingCost), fasteningCost = this.data.postpress.fastening * this.quantity, this.debugInfo("Стоимость за закрытие пружины " + fasteningCost), this.total += springCost + fasteningCost + punchingCost
    }
    if (2 == fastening) {
        if (this.thickness > 6)throw new this.error("Ваша будущая книга толще 6-ти миллиметров, это максимальная допустимая толщина для этого вида скрепления, Пожалуйста, выберите другой вид переплета");
        stapleRanges = this.data.postpress.staple, ranges = [];
        for (var t in stapleRanges)ranges.push({range: t, value: stapleRanges[t]});
        stapleCoefficient = this.countRangeCoefficient(ranges, this.quantity), stapleCost = stapleCoefficient * this.quantity, this.total += stapleCost
    }
    if (3 == fastening) {
        if (this.thickness < 2)throw new this.error("Ваше изделие тоньше 2-х миллиметров, это минимальная допустимая толщина для этого вида скрепления, Пожалуйста, выберите другой вид переплета");
        if (this.thickness > 50)throw new this.error("Ваша будущая книга толще 50-ти миллиметров, это максимальная допустимая толщина для этого вида скрепления, Пожалуйста, выберите другой вид переплета");
        thermoRanges = this.data.postpress.thermo, ranges = [];
        for (var t in thermoRanges)ranges.push({range: t, value: thermoRanges[t]});
        thermoCoefficient = this.countRangeCoefficient(ranges, this.quantity), thermoCost = thermoCoefficient * this.quantity, this.debugInfo("Цена за термопереплет " + thermoCost), this.total += this.countDrillingPrice(this.thickness * this.quantity * $("#rings-bolts").val()), this.total += thermoCost
    }
    if (4 == fastening) {
        if (this.thickness < 5)throw new this.error("Ваше изделие тоньше 5-и миллиметров, это минимальная допустимая толщина для этого вида скрепления, Пожалуйста, выберите другой вид переплета");
        if (this.thickness > 63)throw new this.error("Ваше изделие толще 63-х миллиметров, это максимальная допустимая толщина для этого вида скрепления, Пожалуйста, выберите другой вид переплета");
        bolts = this.data.supplies.bolt;
        for (var t in bolts)if (boltThicknessRange = bolts[t].thickness.split("-"), boltThicknessRange[0] <= this.thickness && boltThicknessRange[1] >= this.thickness) {
            matchedBolt = bolts[t];
            break
        }
        if ("undefined" == typeof matchedBolt)throw new this.error("Не все толщины книг можно переплести болтами - болт имеет фиксированную длину. Попробуйте выбрать другой вид переплета.");
        boltRanges = this.data.postpress.coefficients["bolt-rings"], ranges = [];
        for (var t in boltRanges)ranges.push({range: t, value: boltRanges[t]});
        boltCoefficientCost = this.countRangeCoefficient(ranges, $("#rings-bolts").val() * this.quantity), boltCost = matchedBolt.cost * this.data.sets.usd * boltCoefficientCost * this.quantity * $("#rings-bolts").val(), this.total += this.countDrillingPrice(this.thickness * this.quantity * $("#rings-bolts").val()), this.debugInfo("Цена за болты " + boltCost), this.total += boltCost
    }
    if (5 == fastening) {
        if (this.thickness > 70)throw new this.error("Ваше изделие толще 70-ти миллиметров, это максимальная допустимая толщина для этого вида скрепления, Пожалуйста, выберите другой вид переплета");
        rings = this.data.supplies.ring;
        for (var t in rings)if (this.thickness < rings[t].thickness) {
            matchedRing = rings[t];
            break
        }
        ringRanges = this.data.postpress.coefficients["bolt-rings"], ranges = [];
        for (var t in ringRanges)ranges.push({range: t, value: ringRanges[t]});
        ringCoefficientCost = this.countRangeCoefficient(ranges, $("#rings-bolts").val() * this.quantity), ringCost = matchedRing.cost * this.data.sets.usd * ringCoefficientCost * this.quantity * $("#rings-bolts").val(), this.total += this.countDrillingPrice(this.thickness * this.quantity * $("#rings-bolts").val()), this.debugInfo("Цена за кольца " + ringCost), this.total += ringCost
    }
    var e = $(this.scope + " #total-cost");
    return e.append('<h4 class="text-right">Цена: ' + this.getTotal() + " грн.</h4>"), e.append('<h4 class="text-right">Цена с НДС: ' + this.getTotalWithVAT() + " грн.</h4>"), e.closest(".hidden").removeClass("hidden"), this.saveOrder(), this
}, BindingCalculator.prototype.saveOrder = function () {
    var t = function () {
        return "custom" !== $("#size").val() ? $("#size :selected").text() : [$("#custom-size-width").val(), $("#custom-size-height").val()].join("x")
    }();
    $("#fastening-method").val();
    var e = ["Переплет", "Тираж: " + this.quantity, "Формат изделия в готовом виде: " + t, "Вид переплета: " + $("#fastening-method option:selected").text(), "Толщина изделияе: " + $("#thickness").val() + "мм", "Положение переплета: " + $("#binding-edge option:selected").text()];
    $("#fastening-method").val() > 3 && (rb = $("#rings-bolts"), e.push(rb.prev().text() + " " + rb.val())), this.order = {
        cost: this.getTotal(),
        details: e
    }
}, BlankCalculator = function (arguments) {
    Calculator.call(this, arguments)
}, BlankCalculator.prototype = new Calculator, BlankCalculator.prototype.getTotalCost = function () {
    if (this.clean(), this.quantity = Number($(this.scope + " #quantity").val()), this.quantity < 1 || !this.validator().isInt(this.quantity))throw new this.error("Неправильный формат данных в поле тираж");
    if (0 == $("#print-method").val()) {
        var t = this.compose({width: 210, height: 297}), e = Math.ceil(this.quantity / t),
            i = 0 == $("#colors").val() ? 1 : 2, s = this.countPrintPrice(this.data.digital.prices.color, e * i),
            a = Number($(this.scope + " #materials").val()) * e;
        this.material = $("#materials :selected").text(), this.total = s + a;
        var o = this.countCuttingPrice(t, e);
        this.total += o
    } else this.material = $("#offset-materials :selected").text(), this.quantity = Number($("#offset-quantity option:selected").text()), this.total = Number($("#offset-quantity").val());
    this.totalWithVAT = this.total + this.total / 100 * this.data.sets.vat;
    var r = $(this.scope + " #total-cost");
    return r.append('<h4 class="text-right">Цена: ' + this.total.toFixed(0) + " грн.</h4>"), r.append('<h4 class="text-right">Цена с НДС: ' + this.totalWithVAT.toFixed(0) + " грн.</h4>"), r.closest(".hidden").removeClass("hidden"), this.saveOrder(), this
}, BlankCalculator.prototype.saveOrder = function () {
    var t = (function () {
        return "custom" !== $("#size").val() ? $("#size :selected").text() : [$("#custom-size-width").val(), $("#custom-size-height").val()].join("x")
    }(), 0 == $("#print-method").val() ? "цифровая" : "оффсетная");
    order = ["Бланки А4", "Способ печати: " + t + " печать", "Тираж: " + this.quantity, "Материал: " + this.material], this.order = {
        cost: this.getTotal(),
        details: order
    }
};
var BookCalculator = function (arguments) {
    Calculator.call(this, arguments)
};
BookCalculator.prototype = new Calculator, BookCalculator.prototype.thicknessCount = function () {
    var t = 0;
    if (sheetQuantity = $(this.scope + " #sheet-quantity").val(), 2 == $(this.scope + " #fastening-method").val())for (; sheetQuantity % 4 !== 0;)sheetQuantity++;
    return inArray(Number($(this.scope + " #block-colors").val()), [2, 4]) && (sheetQuantity /= 2, 2 == $("#fastening-method").val() && (sheetQuantity /= 2)), sheetQuantity = Math.ceil(sheetQuantity), t += Number($("#block-materials :selected").data("thickness")) * sheetQuantity, "without" !== $("#block-lamination").val() && (t += this.laminationThickness("#block-lamination") * sheetQuantity), $("#cover").val() > 0 && (coverTickness = $("#cover-materials :selected").data("thickness"), "without" !== $("#cover-lamination").val() && (coverTickness += this.laminationThickness("#cover-lamination")), 3 == $("#fastening-method").val() && (coverTickness *= 2), t += coverTickness), $("#backing").val() > 0 && (t += $("#backing-materials :selected").data("thickness"), "without" !== $("#backing-lamination").val() && (t += this.laminationThickness("#backing-lamination"))), t
}, BookCalculator.prototype.laminationThickness = function (t) {
    return id = $(t).val().split(","), Number(this.data.postpress.lamination.ranges[id[0]].thickness)
}, BookCalculator.prototype.laminationCostCount = function (t, e) {
    t = $(t).val().split(","), lamination = this.data.postpress.lamination.ranges[t[0]], cost = this.data.postpress.lamination.ranges[t[0]][t[1]] * this.data.sets.usd, rates = [];
    for (var i in lamination.rates)rates.push({range: i, value: lamination.rates[i]});
    return coefficient = this.countRangeCoefficient(rates, e), cost = coefficient * cost * e, laminationReserve = Math.max(cost / e, cost / 100 * 3), cost += laminationReserve, Math.max(cost, this.data.postpress.lamination.min)
}, BookCalculator.prototype.coverWidth = function () {
    this.getSize();
    if (coverWidth = this.thicknessCount(), console.log(coverWidth), 2 == $("#fastening-method").val() && coverWidth > 8)throw new this.error("Ваше будущее изделие толще 8-ми миллиметров, это максимальная допустимая толщина для этого вида скрепления, Пожалуйста, выберите бумагу тоньше, или уменьшите количество страниц, или выберите другой вид переплета");
    return coverWidth += 2 * bindingWidth(), coverWidth
}, BookCalculator.prototype.creaseCount = function (t, e, i) {
    function s(t) {
        ranges = [];
        for (var i in t)ranges.push({range: i, value: t[i]});
        return self.countRangeCoefficient(ranges, e)
    }

    return creaseCost = 0, self = this, bindingEdgeWidth = this.bindingEdgeWidth(), crossBindingEdgeWidth = this.crossBindingEdgeWidth(), 2 == $("#fastening-method").val() && (crossBindingEdgeWidth *= 2), 3 == $("#fastening-method").val() && (crossBindingEdgeWidth = 2 * crossBindingEdgeWidth + this.thickness), (inArray($(t + "-materials option:selected").data("id"), ["m200", "m300", "m350", "d160", "d200", "d300"]) || "without" !== $(t + "-lamination").val()) && ("#block" == t ? this.debugInfo("----------- Биговка блока ----------- ") : "#cover" == t && this.debugInfo("----------- Биговка обложки ----------- "), autoCreasingCost = s(this.data.postpress.crease.auto) * e + Number(this.data.postpress.crease.fitting), manualCreasingCost = s(this.data.postpress.crease.manual) * e, bindingEdgeWidth > 150 && bindingEdgeWidth < 320 && crossBindingEdgeWidth > 200 && autoCreasingCost <= manualCreasingCost ? (this.debugInfo("Биговка на моргане"), creaseCost = autoCreasingCost) : (creaseCost = manualCreasingCost, this.debugInfo("Ручная биговка")), this.debugInfo("Количеcтво бигов " + e), creaseCostReserve = Math.max(creaseCost / 100 * this.data.postpress.crease.reserve, creaseCost / e * 2), this.debugInfo("Запас на биговке " + creaseCostReserve), creaseCost = Math.max(creaseCost + creaseCostReserve, this.data.postpress.crease.min), this.debugInfo("Цена за биговку " + creaseCost)), creaseCost
}, BookCalculator.prototype.stapleCompose = function () {
    if (compose = this.compose({
            width: 2 * this.crossBindingEdgeWidth(),
            height: this.bindingEdgeWidth()
        }), 0 == compose)throw new this.error("Формат изделия в развороте должен быть не более 308х438 мм");
    return compose
}, BookCalculator.prototype.thermoCompose = function () {
    if (size = this.getSize(), longEdge = Math.max(size.width, size.height), shortEdge = Math.min(size.width, size.height), "long" == $("#binding-edge").val() ? shortEdge = 2 * shortEdge + (this.thickness + 1) : longEdge = 2 * longEdge + (this.thickness + 1), compose = this.compose({
            width: longEdge,
            height: shortEdge
        }), 0 == compose)throw new this.error("Формат изделия в развороте, c учетом корешка должен быть не более 308х438 мм. Попробуйте уменьшить количество страниц в блоке, выбрать более тонкую бумагу ");
    return compose
}, BookCalculator.prototype.getSpringCoefficient = function () {
    var t = this.data.postpress.coefficients.spring, e = this.quantity;
    ranges = [];
    for (var i in t)ranges.push({range: i, value: t[i]});
    return this.countRangeCoefficient(ranges, e)
}, BookCalculator.prototype.countTotalPrices = function (t, e) {
    return compose = this.compose(this.getSize()), 2 == $("#fastening-method").val() && (compose = this.stapleCompose()), 3 == $("#fastening-method").val() && "#cover-materials" === t[1] && (compose = this.thermoCompose()), this.debugInfo("Копий на листе " + compose), totalCost = 0, colors = $(t[0]).val(), totalSheets = this.quantity, "#block-colors" === t[0] && (totalSheets *= this.sheetQuantity, inArray(Number(colors), [2, 4]) && (totalSheets /= 2), 2 == $("#fastening-method").val() && (totalSheets /= 2)), totalSheets = Math.ceil(totalSheets / compose), printClicks = totalSheets, inArray(Number(colors), [2, 4]) && (printClicks *= 2), printPrice = 0, colors > 0 && (inArray(Number(colors), [1, 2]) ? printPrice = this.countPrintPrice(this.data.digital.prices.color, printClicks) : printPrice = this.countPrintPrice(this.data.digital.prices.grayscale, 2 * printClicks), this.debugInfo("Всего прогонов (кликов) SRA3 " + printClicks), this.debugInfo("Цена за печать " + printPrice)), this.debugInfo("Всего листов SRA3 " + totalSheets), paperPrice = $(t[1] + " option:selected").val() * totalSheets, laminationPrice = 0, "without" !== $(t[2]).val() && (laminationPrice = this.laminationCostCount(t[2], totalSheets), totalCost += laminationPrice), this.debugInfo("Цена за бумагу " + paperPrice), totalCost + printPrice + paperPrice
}, BookCalculator.prototype.getTotalCost = function () {
    if (this.clean(), this.quantity = Number($(this.scope + " #quantity").val()), this.sheetQuantity = Number($(this.scope + " #sheet-quantity").val()), this.total = 0, this.quantity < 1 || !this.validator().isInt(this.quantity))throw new this.error("Неправильный формат данных в поле тираж");
    if (this.sheetQuantity < 1 || !this.validator().isInt(this.sheetQuantity))throw new this.error("Неправильный формат данных в поле тираж");
    this.thickness = this.thicknessCount(), thickness = this.thickness, bindingEdgeWidth = this.bindingEdgeWidth(), fasteningMethod = Number($("#fastening-method").val());
    var t = $(this.scope + " #total-cost");
    if (this.$totalCost = t, inArray(fasteningMethod, [0])) {
        if (this.debugInfo("----------- Переплет на металлическую пружину -----------"), thickness > 22)throw new this.error("Толщина: " + this.thickness.toFixed(2) + " мм. Ваше будущее изделие толще 22-х миллиметров, это максимальная допустимая толщина для этого вида скрепления, Пожалуйста, выберите бумагу тоньше, или уменьшите количество страниц, или выберите другой вид переплета");
        springCost = this.countSpringPrice(this.data.supplies.spring.metall, thickness), punchingAmount = Math.ceil(thickness / this.data.postpress["punching-width"]) * this.quantity, punchingCost = punchingAmount * this.data.postpress.punching, this.debugInfo("Количество хрумов " + punchingAmount), this.debugInfo("Стоимость хрумов " + punchingCost), fasteningCost = this.data.postpress.fastening * this.quantity, this.debugInfo("Стоимость за закрытие пружины " + fasteningCost), this.total += springCost + fasteningCost + punchingCost
    }
    if (inArray(fasteningMethod, [1])) {
        if (this.debugInfo("----------- Переплет на пластиковую пружину -----------"), thickness > 45)throw new this.error("Толщина: " + this.thickness.toFixed(2) + " мм. Ваше будущее изделие толще 45-ти миллиметров, это максимальная допустимая толщина для этого вида скрепления, Пожалуйста, выберите бумагу тоньше, или уменьшите количество страниц, или выберите другой вид переплета");
        springCost = this.countSpringPrice(this.data.supplies.spring.plastic, thickness), punchingAmount = Math.ceil(thickness / this.data.postpress["punching-width"]) * this.quantity, punchingCost = punchingAmount * this.data.postpress.punching, this.debugInfo("Количество хрумов " + punchingAmount), this.debugInfo("Стоимость хрумов " + punchingCost), fasteningCost = this.data.postpress.fastening * this.quantity, this.debugInfo("Стоимость за закрытие пружины " + fasteningCost), this.total += springCost + fasteningCost + punchingCost
    }
    if (inArray(fasteningMethod, [2])) {
        if (thickness *= 2, this.thickness = thickness, this.debugInfo("----------- Переплет на скобы -----------"), this.thickness > 6)throw new this.error("Толщина: " + thickness.toFixed(2) + " мм. Ваше будущее изделие толще 6-ти миллиметров, это максимальная допустимая толщина для этого вида скрепления, Пожалуйста, выберите бумагу тоньше, или уменьшите количество страниц, или выберите другой вид переплета");
        for ($("#sheet-quantity").val() % 4 !== 0 && this.warning("Число страниц блока изделия должно быть кратно 4-м, Если число страниц Вашей изделия не делится на 4 без остатка, то в конце изделия будут автоматически добавлены чистые страницы"); this.sheetQuantity % 4 !== 0;)this.sheetQuantity++;
        stapleRanges = this.data.postpress.staple, ranges = [];
        for (var e in stapleRanges)ranges.push({range: e, value: stapleRanges[e]});
        stapleCostPerBook = this.countRangeCoefficient(ranges, this.quantity), this.debugInfo("Цена за степлирование " + stapleCostPerBook * this.quantity), this.total += stapleCostPerBook * this.quantity, this.total += this.creaseCount("#block", this.sheetQuantity / 2 * this.quantity), $("#cover").val() > 0 && (this.total += this.creaseCount("#cover", this.quantity))
    }
    if (inArray(fasteningMethod, [3])) {
        if (this.debugInfo("----------- Термопереплет -----------"), thickness < 2)throw new this.error("Толщина: " + this.thickness.toFixed(2) + " мм. Ваше будущее изделие тоньше 2-х миллиметров, это минимальная допустимая толщина для этого вида скрепления, Пожалуйста, выберите бумагу толще, или увеличте количество страниц, или выберите другой вид переплета");
        if (thickness > 50)throw new this.error("Толщина: " + this.thickness.toFixed(2) + " мм. Ваше будущее изделие толще 50-ти миллиметров, это максимальная допустимая толщина для этого вида скрепления, Пожалуйста, выберите бумагу тоньше, или уменьшите количество страниц, или выберите другой вид переплета");
        thermoRanges = this.data.postpress.thermo, ranges = [];
        for (var e in thermoRanges)ranges.push({range: e, value: thermoRanges[e]});
        thermoCostPerBook = this.countRangeCoefficient(ranges, this.quantity), this.debugInfo("Цена за термопереплет " + thermoCostPerBook * this.quantity), this.total += thermoCostPerBook * this.quantity, this.total += this.creaseCount("#cover", 4 * this.quantity)
    }
    if (inArray(fasteningMethod, [4])) {
        if (this.debugInfo("----------- Переплет на болты -----------"), thickness < 5)throw new this.error("Толщина: " + this.thickness.toFixed(2) + " мм. Ваше будущее изделие тоньше 5-и миллиметров, это минимальная допустимая толщина для этого вида скрепления, Пожалуйста, выберите бумагу толще, или увеличтете количество страниц, или выберите другой вид переплета");
        if (thickness > 63)throw new this.error("Толщина: " + this.thickness.toFixed(2) + " мм. Ваше будущее изделие толще 63-х миллиметров, это максимальная допустимая толщина для этого вида скрепления, Пожалуйста, выберите бумагу тоньше, или уменьшите количество страниц, или выберите другой вид переплета");
        bolts = this.data.supplies.bolt;
        for (var e in bolts)if (boltThicknessRange = bolts[e].thickness.split("-"), boltThicknessRange[0] <= thickness && boltThicknessRange[1] >= thickness) {
            matchedBolt = bolts[e];
            break
        }
        if ("undefined" == typeof matchedBolt)throw new this.error("Толщина: " + this.thickness.toFixed(2) + " мм. Не все толщины можно переплести болтами - болт имеет фиксированную длину. Попробуйте выбрать другую плотность бумаги.");
        boltRanges = this.data.postpress.coefficients["bolt-rings"], ranges = [];
        for (var e in boltRanges)ranges.push({range: e, value: boltRanges[e]});
        boltCoefficientCost = this.countRangeCoefficient(ranges, $("#rings-bolts").val() * this.quantity), boltCost = matchedBolt.cost * this.data.sets.usd * boltCoefficientCost * this.quantity * $("#rings-bolts").val(), this.total += this.countDrillingPrice(this.thickness * this.quantity * $("#rings-bolts").val()), this.debugInfo("Цена за болты " + boltCost),
            this.total += boltCost
    }
    if (inArray(fasteningMethod, [5])) {
        if (this.debugInfo("----------- Переплет на кольца -----------"), thickness > 70)throw new this.error("Толщина: " + this.thickness.toFixed(2) + " мм. Ваше будущее изделие толще 70-ти миллиметров, это максимальная допустимая толщина для этого вида скрепления, Пожалуйста, выберите бумагу тоньше, или уменьшите количество страниц, или выберите другой вид переплета");
        rings = this.data.supplies.ring;
        for (var e in rings)if (thickness < rings[e].thickness) {
            matchedRing = rings[e];
            break
        }
        ringRanges = this.data.postpress.coefficients["bolt-rings"], ranges = [];
        for (var e in ringRanges)ranges.push({range: e, value: ringRanges[e]});
        ringCoefficientCost = this.countRangeCoefficient(ranges, $("#rings-bolts").val() * this.quantity), ringCost = matchedRing.cost * this.data.sets.usd * ringCoefficientCost * this.quantity * $("#rings-bolts").val(), this.total += this.countDrillingPrice(this.thickness * this.quantity * $("#rings-bolts").val()), this.total += ringCost
    }
    if (this.debugInfo("--------------------------------"), this.debugInfo("Общая толщина " + thickness + " мм"), this.debugInfo("Сторона скрепления " + bindingEdgeWidth), this.debugInfo("----------- Расчет стоимости блока -----------"), blockPrintPrice = this.countTotalPrices(["#block-colors", "#block-materials", "#block-lamination"]), this.total += blockPrintPrice, $("#cover").val() > 0 && (this.debugInfo("----------- Расчет стоимости обложки -----------"), coverPrintPrice = this.countTotalPrices(["#cover-colors", "#cover-materials", "#cover-lamination"]), this.total += coverPrintPrice), $("#backing").val() > 0 && (this.debugInfo("----------- Расчет стоимости подложки -----------"), backingPrintPrice = this.countTotalPrices(["#backing-colors", "#backing-materials", "#backing-lamination"]), this.total += backingPrintPrice), $transparencies = $("#transparencies"), $transparencies.val() > 0) {
        if (compose = this.compose(this.getSize(), 0, [420, 297]), !compose)throw new this.error("Размер изделия превышает максимально возможную ширину пленки. 420 x 297");
        transparenciesPrice = this.data.supplies.transparencies / compose * this.quantity * this.data.sets.usd, 2 == Number($transparencies.val()) && (transparenciesPrice *= 2), this.debugInfo("Цена за пленку " + transparenciesPrice), this.total += transparenciesPrice
    }
    return this.debugInfo("----------- Цена -----------"), this.debugInfo("Цена без НДС " + this.getTotal()), t.append('<h4 class="text-right">Толщина изделия: ' + thickness.toFixed(2) + " мм</h4>"), t.append('<h4 class="text-right">Цена: ' + this.getTotal() + " грн.</h4>"), t.append('<h4 class="text-right">Цена с НДС: ' + this.getTotalWithVAT() + " грн.</h4>"), t.closest(".hidden").removeClass("hidden"), this.saveOrder(), this
}, BookCalculator.prototype.saveOrder = function () {
    function t() {
        return size = $("#size").val(), "custom" !== size ? size : [$("#custom-size-width").val(), $("#custom-size-height").val()].join("x")
    }

    order = [], order.push("Книга: " + this.quantity + " шт"), order.push("Вид переплета: " + $("#fastening-method :selected").text()), order.push("Размер готового изделия: " + t() + " мм"), order.push("Положение переплета: " + $("#binding-edge :selected").text()), blockLamination = "without" !== $("#block-lamination").val() ? ", ламинация " + $("#block-lamination :selected").text() : "", order.push("Блок: " + $("#sheet-quantity").val() + "стр., " + $("#block-materials :selected").text() + ", цветность " + $("#block-colors :selected").text() + blockLamination), $("#cover").val() > 0 && (coverLamination = "without" !== $("#cover-lamination").val() ? ", ламинация " + $("#cover-lamination :selected").text() : "", order.push("Обложка: " + $("#cover-materials :selected").text() + ", цветность " + $("#cover-colors :selected").text() + coverLamination)), $("#backing").val() > 0 && (backingLamination = "without" !== $("#backing-lamination").val() ? ", ламинация " + $("#backing-lamination :selected").text() : "", order.push("Подложка: " + $("#backing-materials :selected").text() + ", цветность " + $("#backing-colors :selected").text() + coverLamination)), $("#transparencies").val() > 0 && order.push("Прозрачная пленка: " + $("#transparencies :selected").text()), $("#fastening-method").val() > 3 && order.push($("#rings-bolts").parent().find("label").text() + " " + $("#rings-bolts").val() + " шт"), this.order = {
        cost: this.getTotal(),
        details: order
    }
};
var BuisnessCardsCalculator = function (arguments) {
    Calculator.call(this, arguments)
};
BuisnessCardsCalculator.prototype = new Calculator, BuisnessCardsCalculator.prototype.getTotalCost = function () {
    this.clean(), this.prices = this.data.products.buisnessCards[$("#material").val()], this.quantity = Number($(this.scope + " #quantity").val());
    var t, e = this.quantity / 100;
    t = "0" == $(this.scope + " #colors").val() ? this.prices["4+0"] : this.prices["4+4"], this.quantity > 100 && (t -= t / 100 * (e * this.prices.step)), this.total = t * e;
    var i = $(this.scope + " #total-cost");
    return $(this.scope + " #lamination").val() > 0 && (laminationMaterial = $(this.scope + " #lamination option:selected"), ranges = [3, 2], laminationMaterial.text().indexOf("24-32") > -1 && (ranges = [10, 5]), coefficient = this.quantity / 1e3 * ((ranges[0] - ranges[1]) / 100) * 100, factor = ranges[0] - coefficient, this.lamiataionCost = laminationMaterial.val() * factor * (this.quantity / 100 * 5), this.total += this.lamiataionCost, i.append('<h4 class="text-right">Цена за ламинацию: ' + this.lamiataionCost.toFixed(0) + " грн.</h4>")), $(this.scope + " #corner-round").prop("checked") && (this.quantity > 100 ? this.roundCost = (30 - Math.floor(.3 * (e * this.prices.step))) * e : this.roundCost = 30, this.total += this.roundCost, i.append('<h4 class="text-right">Цена за скругление: ' + this.roundCost.toFixed(0) + " грн.</h4>")), $(this.scope + " #design").prop("checked") && (this.designCost = Number(this.data.sets.design), "1" == $(this.scope + " #colors").val() && (this.designCost = 2 * this.designCost), this.total += this.designCost, i.append('<h4 class="text-right">Цена за разработку макета: ' + this.designCost.toFixed(0) + " грн.</h4>")), $(this.scope + " #delivery").prop("checked") && (this.deliveryCost = Number(this.data.sets.delivery), this.total += this.deliveryCost, i.append('<h4 class="text-right">Цена за доставку: ' + this.deliveryCost.toFixed(0) + " грн.</h4>")), i.append('<h4 class="text-right">Цена: ' + this.total.toFixed(0) + " грн.</h4>"), this.totalWithVAT = this.total + this.total / 100 * this.data.sets.vat, i.append('<h4 class="text-right">Цена c НДС: ' + this.totalWithVAT.toFixed(0) + " грн.</h4>"), i.closest(".hidden").removeClass("hidden"), this.saveOrder(), this
}, BuisnessCardsCalculator.prototype.saveOrder = function () {
    var t = ["Визитные карточки. Материал: " + this.data.products.buisnessCards[$("#material").val()].title, "Тираж: " + this.quantity + " шт"];
    $("#lamination").val() > 0 && t.push("Ламинация " + $("#lamination option:selected").text()), void 0 !== this.roundCost && t.push("Скругление"), void 0 !== this.designCost && t.push("Разработка макета"), void 0 !== this.deliveryCost && t.push("Доставка"), this.order = {
        cost: this.getTotal(),
        details: t
    }
};
var CalendarCalculator = function (t) {
    Calculator.call(this, t)
};
CalendarCalculator.prototype = new Calculator, CalendarCalculator.prototype.laminationCostCount = function (t, e) {
    t = $(t).val().split(","), lamination = this.data.postpress.lamination.ranges[t[0]], cost = this.data.postpress.lamination.ranges[t[0]][t[1]] * this.data.sets.usd, rates = [];
    for (var i in lamination.rates)rates.push({range: i, value: lamination.rates[i]});
    return coefficient = this.countRangeCoefficient(rates, e), cost = coefficient * cost * e, laminationReserve = Math.max(cost / e, cost / 100 * 3), cost += laminationReserve, Math.max(cost, this.data.postpress.lamination.min)
}, CalendarCalculator.prototype.getWideSize = function (t, e) {
    if (t = $(t).val(), sizes = t.split("x"), t = {
            width: Number(sizes[0]),
            height: Number(sizes[1])
        }, $selectedMaterial = $(this.scope + " " + e + " option:selected"), t.maxWidth = $selectedMaterial.data("maxwidth"), t.widthRanges = String($selectedMaterial.data("width")), t.width > t.maxWidth && t.height > t.maxWidth)throw new this.error("Размеры изделия превышают ширину материала");
    if (isNaN(t.width) || isNaN(t.height) || !this.validator().isPositive(t.width) || !this.validator().isPositive(t.height))throw new this.error("Указаны неверные размеры");
    return t
}, CalendarCalculator.prototype.getSize = function (t, e, i) {
    var s = $(t).val();
    "custom" == s ? s = {
        width: $(e + " .width").val(),
        height: $(e + " .height").val()
    } : (sizes = s.split("x"), s = {width: sizes[0], height: sizes[1]});
    for (var a in s)if (s[a] = Number(s[a]), 0 === s[a] || isNaN(s[a]))throw new this.error("Указан неправильный размер");
    if ("#calendar-type-3-custom-size-2" == e && (baseSize = this.getSize("#calendar-type-3-size", "#calendar-type-3-custom-size", !0), maxBaseSize = Math.max(baseSize.width, baseSize.height), minBaseSize = Math.min(baseSize.width, baseSize.height), maxSize = Math.max(s.width, s.height), minSize = Math.min(s.width, s.height), maxSize > maxBaseSize || minSize > minBaseSize))throw new this.error("Размер перекидных листов не может превышать размер основы");
    if ("#calendar-type-3-size" == t && !i && (s = {
            width: Math.max(s.width, s.height),
            height: Math.min(s.width, s.height)
        }, "long" == $("#calendar-type-3-binding-edge").val() ? s.height = 2 * s.height + s.height / 5 * 3 : s.width = 2 * s.width + s.width / 5 * 3, s.width > "438" || s.height > "438" || s.width > "308" && s.height > "308"))throw new this.error("Размер основы в развороте превышает максимально допустимые размеры 438x308 мм. Размер основы. " + s.width + "x" + s.height);
    if (s.width > "438" || s.height > "438" || s.width > "308" && s.height > "308")throw new this.error("Размер изделия превышает максимально допустимые размеры 438x308 мм. ");
    return s
}, CalendarCalculator.prototype.composeWide = function (t, e, i) {
    return shortSide = Math.min(e.width, e.height), longSide = Math.max(e.width, e.height), t === longSide ? (printQuadrature = shortSide * longSide * i, wasteQuadrature = 0) : t < longSide ? (maxFill = Math.floor(t / shortSide), materialWidth = Math.ceil(i / maxFill) * longSide, materialQuadrature = t * materialWidth, printQuadrature = shortSide * longSide * i, wasteQuadrature = materialQuadrature - printQuadrature) : t > longSide && (shortSideFill = Math.floor(t / shortSide), shortSideWidth = Math.ceil(i / shortSideFill) * longSide, shortSideMaterialQuadrature = t * shortSideWidth, longSideFill = Math.floor(t / longSide), longSideWidth = Math.ceil(i / longSideFill) * shortSide, longSideMaterialQuadrature = t * longSideWidth, shortSideMaterialQuadrature > longSideMaterialQuadrature ? materialQuadrature = longSideMaterialQuadrature : materialQuadrature = shortSideMaterialQuadrature, printQuadrature = shortSide * longSide * i, wasteQuadrature = materialQuadrature - printQuadrature), {
        printQuadrature: printQuadrature,
        wasteQuadrature: wasteQuadrature
    }
}, CalendarCalculator.prototype.getTotalCost = function () {
    if (this.clean(), this.quantity = $("#quantity").val(), this.total = 0, this.quantity < 1 || !this.validator().isInt(this.quantity))throw new this.error("Неправильный формат данных в поле: Тираж");
    if (type = Number($("#calendar-types").val()), 0 === type || 1 === type) supplies = this.data.supplies.calendar, windowCost = Number(supplies.window) * Number(supplies.windowRate) * this.data.sets.usd * this.quantity, this.debugInfo("Цена за окошки " + windowCost), $("#calendar-type-0-grid-material").val() > 0 ? (material = this.data.digital.materials[6], this.debugInfo("Материал сетки " + material.name), personalMaterialCost = material.pp * this.data.sets.euro * 12 * this.quantity, personalPrintCost = this.countPrintPrice(this.data.digital.prices.color, 12 * this.quantity), this.debugInfo("Персональные сетки. Цена за печать  " + personalPrintCost + " за бумагу " + personalMaterialCost), blockCost = personalMaterialCost + personalPrintCost) : blockCost = Number(supplies.block) * Number(supplies.blockRate) * this.quantity, this.debugInfo("Цена за блок " + blockCost), cringleCost = Number(this.data.supplies.cringle) * this.quantity, this.debugInfo("Цена за люверсы " + cringleCost), this.total += cringleCost + windowCost + blockCost, this.thickness = 2, this.bindingEdgeWidth = function () {
        return 297
    }, "without" !== $("#calendar-type-0-lamination").val() && (laminationPrice = this.laminationCostCount("#calendar-type-0-lamination", 2 * this.quantity), this.debugInfo("Цена за ламинацию " + laminationPrice), this.total += laminationPrice), springCost = this.countSpringPrice(this.data.supplies.spring.metall, this.thickness, 3 * this.quantity), punchingAmount = Math.ceil(this.thickness / this.data.postpress["punching-width"]) * this.quantity * 3, fasteningCost = this.data.postpress.fastening * this.quantity * 3, punchingCost = punchingAmount * this.data.postpress.punching, this.debugInfo("Закрытий: " + 3 * this.quantity + " цена: " + fasteningCost), this.debugInfo("Хрумов " + punchingAmount + " цена: " + punchingCost), printPrice = this.countPrintPrice(this.data.digital.prices.color, this.quantity * (type + 1)), this.debugInfo("Цена за печать " + printPrice), materialPrice = Number($(this.scope + " #calendar-type-0-material").val()) * this.quantity * 2, this.debugInfo("Цена за бумагу " + materialPrice), this.total += springCost + fasteningCost + punchingCost + materialPrice + printPrice; else if (2 == type) totalSheets = Math.ceil(this.quantity / this.compose(this.getSize("#calendar-type-2-size", "#calendar-type-2-custom-size"))), printPrice = this.countPrintPrice(this.data.digital.prices.color, totalSheets), this.debugInfo("Цена за печать " + printPrice), materialPrice = Number($(this.scope + " #calendar-type-2-material").val()) * totalSheets, this.debugInfo("Цена за бумагу " + materialPrice), this.bindingEdgeWidth = function () {
        return size = this.getSize("#calendar-type-2-size", "#calendar-type-2-custom-size"), Math.min(size.width, size.height)
    }, this.crossBindingEdgeWidth = function () {
        return size = this.getSize("#calendar-type-2-size", "#calendar-type-2-custom-size"), Math.max(size.width, size.height)
    }, "without" !== $("#calendar-type-2-lamination").val() && (laminationPrice = this.laminationCostCount("#calendar-type-2-lamination", totalSheets), this.debugInfo("Цена за ламинацию " + laminationPrice), this.total += laminationPrice), creasePrice = this.countCreasePrice(4 * this.quantity), tapePasting = this.data.postpress["pasting-adhesive-tape"] * this.quantity, this.total += creasePrice + printPrice + materialPrice + tapePasting; else if (3 == type) {
        if (this.bindingEdgeWidth = function () {
                return size = this.getSize("#calendar-type-3-size", "#calendar-type-3-custom-size", !0), "long" == $("#calendar-type-3-binding-edge").val() ? Math.max(size.width, size.height) : Math.min(size.width, size.height)
            }, this.crossBindingEdgeWidth = function () {
                return size = this.getSize("#calendar-type-3-size", "#calendar-type-3-custom-size", !0), "long" == $("#calendar-type-3-binding-edge").val() ? width = Math.min(size.width, size.height) : width = Math.max(size.width, size.height), 2 * width + width / 5 * 3
            }, baseHeight = Number(this.crossBindingEdgeWidth()), baseSize = this.getSize("#calendar-type-3-size", "#calendar-type-3-custom-size"), baseTotalSheets = Math.ceil(this.quantity / this.compose(baseSize)), baseMaterialPrice = Number($(this.scope + " #calendar-type-3-material").val()) * baseTotalSheets, this.debugInfo("Основа: Цена за бумагу " + baseMaterialPrice), $("#calendar-type-3-color").val() > 0 && (basePrintPrice = this.countPrintPrice(this.data.digital.prices.color, baseTotalSheets), this.debugInfo("Основа: Цена за печать " + basePrintPrice), this.total += basePrintPrice), baseCreasePrice = this.countCreasePrice(2 * this.quantity), this.total += baseCreasePrice + baseMaterialPrice, "without" !== $("#calendar-type-3-lamination").val() && (laminationPrice = this.laminationCostCount("#calendar-type-3-lamination", baseTotalSheets), this.debugInfo("Основа: Цена за ламинацию " + laminationPrice), this.total += laminationPrice), blockSheetsQuantity = Number($("#calendar-type-3-block-quantity").val()), blockSheetsQuantity > 14)throw new this.error("Максимально возможное количество листов для блока 14");
        blockCompose = this.compose(this.getSize("#calendar-type-3-size-2", "#calendar-type-3-custom-size-2")), blockTotalSheets = Math.ceil(this.quantity / blockCompose) * blockSheetsQuantity, this.debugInfo("Блок: количество печатных листов " + blockTotalSheets), blockMaterialPrice = Number($(this.scope + " #calendar-type-3-material-2").val()) * blockTotalSheets, this.debugInfo("Блок: Цена за бумагу " + blockMaterialPrice), $("#calendar-type-3-color-2").val() > 0 && (blockTotalSheets *= 2, this.debugInfo("Количество прогонов" + blockTotalSheets)), blockPrintPrice = this.countPrintPrice(this.data.digital.prices.color, blockTotalSheets), this.debugInfo("Блок: Цена за печать " + blockPrintPrice), blockCuttingPrice = this.countCuttingPrice(blockCompose, blockTotalSheets), this.debugInfo("Блок: Цена за порезку " + blockCuttingPrice), this.thickness = 4, springCost = this.countSpringPrice(this.data.supplies.spring.metall, this.thickness, this.quantity), punchingAmount = Math.ceil(this.thickness / this.data.postpress["punching-width"]) * this.quantity, fasteningCost = this.data.postpress.fastening * this.quantity, punchingCost = punchingAmount * this.data.postpress.punching, this.debugInfo("Закрытий: " + this.quantity + " цена: " + fasteningCost), this.debugInfo("Хрумов " + punchingAmount + " цена: " + punchingCost), this.total += blockPrintPrice + blockCuttingPrice + punchingCost + blockMaterialPrice
    } else if (4 == type)if ($("#calendar-type-4-size").prop("selectedIndex") > 1) {
        material = $("#calendar-type-4-wide-materials option:selected"), size = this.getWideSize("#calendar-type-4-size", "#calendar-type-4-wide-materials");
        for (var t = size.widthRanges.split(","), e = [], i = 0; i < t.length; i++)e[i] = this.composeWide(Number(t[i]), size, this.quantity), e[i].maxWidth = Number(t[i]);
        var s = 1 / 0, a = 0;
        for (var o in e)e[o].wasteQuadrature < s && (s = e[o].wasteQuadrature, a = o);
        composed = e[a], materialPrice = composed.wasteQuadrature * Number(material.val()), printPrice = composed.printQuadrature * (Number(material.data("pcost")) + Number(material.val())), this.total = materialPrice + printPrice
    } else totalSheets = Math.ceil(this.quantity / this.compose(this.getSize("#calendar-type-4-size"))), printPrice = this.countPrintPrice(this.data.digital.prices.color, totalSheets), this.debugInfo("Цена за печать " + printPrice), materialPrice = Number($(this.scope + " #calendar-type-4-materials").val()) * totalSheets, "without" !== $("#calendar-type-4-lamination").val() && (laminationPrice = this.laminationCostCount("#calendar-type-4-lamination", totalSheets), this.debugInfo("Цена за ламинацию " + laminationPrice), this.total += laminationPrice), this.total += printPrice + materialPrice;
    var r = $(this.scope + " #total-cost");
    return r.append('<h4 class="text-right">Цена: ' + this.getTotal() + " грн.</h4>"), r.append('<h4 class="text-right">Цена с НДС: ' + this.getTotalWithVAT() + " грн.</h4>"), r.closest(".hidden").removeClass("hidden"), this.saveOrder(), this
}, CalendarCalculator.prototype.saveOrder = function () {
    var t = ["Календари", "Тип: " + $("#calendar-types option:selected").text(), "Тираж: " + this.quantity];
    switch (Number($("#calendar-types").val())) {
        case 0:
        case 1:
            t.push("Материал основы: " + $("#calendar-type-0-material option:selected").text()), "without" !== $("#calendar-type-0-lamination").val() && t.push("Ламинация: " + $("#calendar-type-0-lamination option:selected").text()), t.push("Тип сетки: " + $("#calendar-type-0-grid-material option:selected").text());
            break;
        case 2:
            size = this.getSize("#calendar-type-2-size", "#calendar-type-2-custom-size"), t.push("Формат: " + size.width + "x" + size.height), t.push("Материал основы: " + $("#calendar-type-2-material option:selected").text()), "without" !== $("#calendar-type-2-lamination").val() && t.push("Ламинация: " + $("#calendar-type-2-lamination option:selected").text());
            break;
        case 3:
            size = this.getSize("#calendar-type-2-size", "#calendar-type-2-custom-size"), t.push("Формат основы в развороте: " + size.width + "x" + size.height), size = this.getSize("#calendar-type-2-size", "#calendar-type-2-custom-size", !0), t.push("Формат основы в готовом виде: " + size.width + "x" + size.height), t.push("Расположение переплета: " + $("#calendar-type-3-binding-edge option:selected").text()), "without" !== $("#calendar-type-3-lamination").val() && t.push("Ламинация основы: " + $("#calendar-type-3-lamination option:selected").text()), t.push("Цветность основы: " + $("#calendar-type-3-color option:selected").text()), t.push("Материал перекидных листов: " + $("#calendar-type-3-material-2 option:selected").text()), size = this.getSize("#calendar-type-3-size-2", "#calendar-type-3-custom-size-2"), t.push("Формат перекидных листов: " + size.width + "x" + size.height), t.push("Количесвто перекидных листов: " + $("#calendar-type-3-block-quantity").val()), t.push("Цветность перекидных листов: " + $("#calendar-type-3-color-2 option:selected").text());
            break;
        case 4:
            $("#calendar-type-4-size").prop("selectedIndex") > 1 ? (size = this.getWideSize("#calendar-type-4-size", "#calendar-type-4-wide-materials"), t.push("Формат: " + size.width + "x" + size.height), t.push("Материал: " + $("#ccalendar-type-4-materials option:selected").text()), "without" !== $("#calendar-type-4-lamination").val() && t.push("Ламинация основы: " + $("#calendar-type-3-lamination option:selected").text())) : (size = this.getSize("#calendar-type-4-size"), t.push("Формат: " + size.width + "x" + size.height), t.push("Материал: " + $("#calendar-type-4-wide-materials option:selected").text()))
    }
    this.order = {cost: this.getTotal(), details: t}
}, CanvasCalculator = function (arguments) {
    Calculator.call(this, arguments)
}, CanvasCalculator.prototype = new Calculator, CanvasCalculator.prototype.getSize = function () {
    var t = $("#size").val();
    $("#underframe").val() > 0 && (t = $("#underframe-size").val()), "custom" == t ? t = {
        width: Number($(this.scope + " #custom-size-width").val().replace(",", ".")),
        height: Number($(this.scope + " #custom-size-height").val().replace(",", "."))
    } : (sizes = t.split("x"), t = {width: Number(sizes[0]), height: Number(sizes[1])});
    var e = $(this.scope + " #materials option:selected");
    if (t.maxWidth = e.data("maxwidth"), $("#material-help").html("Максимальная ширина " + t.maxWidth + " м"), t.widthRanges = String(e.data("width")), t.width > t.maxWidth && t.height > t.maxWidth)throw new this.error("Размеры изделия превышают ширину материала");
    if (isNaN(t.width) || isNaN(t.height) || !this.validator().isPositive(t.width) || !this.validator().isPositive(t.height))throw new this.error("Указаны неверные размеры");
    return t
}, CanvasCalculator.prototype.compose = function (t, e, i) {
    var e = e || this.getSize();
    return shortSide = Math.min(e.width, e.height), longSide = Math.max(e.width, e.height), t === longSide ? (printQuadrature = shortSide * longSide * i, wasteQuadrature = 0) : t < longSide ? (maxFill = Math.floor(t / shortSide), materialWidth = Math.ceil(i / maxFill) * longSide, materialQuadrature = t * materialWidth, printQuadrature = shortSide * longSide * i, wasteQuadrature = materialQuadrature - printQuadrature) : t > longSide && (shortSideFill = Math.floor(t / shortSide), shortSideWidth = Math.ceil(i / shortSideFill) * longSide, shortSideMaterialQuadrature = t * shortSideWidth, longSideFill = Math.floor(t / longSide), longSideWidth = Math.ceil(i / longSideFill) * shortSide, longSideMaterialQuadrature = t * longSideWidth, shortSideMaterialQuadrature > longSideMaterialQuadrature ? materialQuadrature = longSideMaterialQuadrature : materialQuadrature = shortSideMaterialQuadrature, printQuadrature = shortSide * longSide * i, wasteQuadrature = materialQuadrature - printQuadrature), {
        printQuadrature: printQuadrature,
        wasteQuadrature: wasteQuadrature
    }
}, CanvasCalculator.prototype.underframeStretchCost = function () {
    return materialPrice = .2 * Number($("#materials :selected").val()), id = $("#underframe-size :selected").data("id"), data = this.data.postpress.underframe[id], stretchCost = data.price * data.rate * this.data.sets.usd + materialPrice, this.debugInfo("Цена за натяжку " + stretchCost), stretchCost
}, CanvasCalculator.prototype.getTotalCost = function () {
    if (this.clean(), this.quantity = Number($("#quantity").val()), !this.validator().isInt(this.quantity) && !this.validator().isPositive(this.quantity))throw new this.error("Неправильный формат данных в поле тираж");
    var t = $("#materials :selected");
    this.size = this.getSize();
    for (var e = this.size.widthRanges.split(","), i = [], s = 0; s < e.length; s++)i[s] = this.compose(Number(e[s]), this.size, this.quantity), i[s].maxWidth = Number(e[s]);
    var a = 1 / 0, o = 0;
    for (var r in i)i[r].wasteQuadrature < a && (a = i[r].wasteQuadrature, o = r);
    this.composed = i[o];
    var n = this.composed.wasteQuadrature * Number(t.val()),
        h = this.composed.printQuadrature * (Number(t.data("pcost")) + Number(t.val()));
    this.total = n + h, this.debugInfo("Цена без скидки " + this.total), $("#underframe").val() > 0 && (this.total += this.underframeStretchCost() * this.quantity);
    var l = this.countDiscount(this.total);
    this.total = this.total - this.total / 100 * l;
    var c = $(this.scope + " #total-cost");
    return c.append('<h4 class="text-right">Цена: ' + this.getTotal() + " грн.</h4>"), c.append('<h4 class="text-right">Цена c НДС: ' + this.getTotalWithVAT() + " грн.</h4>"), this.saveOrder(), c.closest(".hidden").removeClass("hidden"), this
}, CanvasCalculator.prototype.countDiscount = function (t) {
    var e = 15, i = .05, s = (e - i) / 100, a = 1e4, o = 500, r = (a - o) / 100, n = 0;
    if (t >= o && t <= a) {
        var h = t - o;
        n = h / r * s + i
    } else t > a && (n = e);
    return this.debugInfo("Скидка в % " + n), n
}, CanvasCalculator.prototype.saveOrder = function () {
    order = ["Печать холста", "Тираж: " + this.quantity, "Формат: " + this.size.width + "x" + this.size.height + " м", "Материал: " + $("#materials :selected").text() + "Ширина " + this.composed.maxWidth + " м"], $("#underframe").val() > 0 && order.push("Натяжка на подрамник"), this.order = {
        cost: this.getTotal(),
        details: order
    }
};
var CreaseCalculator = function (arguments) {
    Calculator.call(this, arguments)
};
CreaseCalculator.prototype = new Calculator, CreaseCalculator.prototype.getSize = function () {
    var t = $("#size").val();
    "custom" == t ? t = {
        width: $(this.scope + " #custom-size-width").val(),
        height: $(this.scope + " #custom-size-height").val()
    } : (sizes = t.split("x"), t = {width: sizes[0], height: sizes[1]});
    for (var e in t)if (t[e] = Number(t[e]), t[e] < 1 || isNaN(t[e]))throw new this.error("Указан неправильный размер");
    if (t.width > 320 && t.height > 320 || t.width > 445 || t.height > 445)throw new this.error("Максимальный размер изделия для биговки не должен превышать размеры 320х445 мм");
    return t
}, CreaseCalculator.prototype.bindingEdgeWidth = function () {
    return size = this.getSize(), "long" == $("#binding-edge").val() ? Math.max(size.width, size.height) : Math.min(size.width, size.height)
}, CreaseCalculator.prototype.crossBindingEdgeWidth = function () {
    return size = this.getSize(), "long" == $("#binding-edge").val() ? Math.min(size.width, size.height) : Math.max(size.width, size.height)
}, CreaseCalculator.prototype.countCreaseCost = function (t) {
    function e(e) {
        ranges = [];
        for (var i in e)ranges.push({range: i, value: e[i]});
        return self.countRangeCoefficient(ranges, t)
    }

    return creaseCost = 0, self = this, bindingEdgeWidth = this.bindingEdgeWidth(), crossBindingEdgeWidth = this.crossBindingEdgeWidth(), autoCreasingCost = e(this.data.postpress.crease.auto) * t + Number(this.data.postpress.crease.fitting), manualCreasingCost = e(this.data.postpress.crease.manual) * t, bindingEdgeWidth > 150 && bindingEdgeWidth < 320 && crossBindingEdgeWidth > 200 && autoCreasingCost <= manualCreasingCost ? (this.debugInfo("Биговка на моргане"), creaseCost = autoCreasingCost) : (creaseCost = manualCreasingCost, this.debugInfo("Ручная биговка")), this.debugInfo("Количеcтво бигов " + t), creaseCostReserve = Math.max(creaseCost / 100 * this.data.postpress.crease.reserve, creaseCost / t * 2), this.debugInfo("Запас на биговке " + creaseCostReserve), creaseCost = Math.max(creaseCost + creaseCostReserve, this.data.postpress.crease.min), this.debugInfo("Цена за биговку " + creaseCost), creaseCost
}, CreaseCalculator.prototype.getTotalCost = function () {
    if (this.clean(), quantity = $("#quantity").val(), creaseQuantity = $("#crease-quantity").val(), quantity < 1 || !this.validator().isInt(quantity))throw new this.error("Неправильный формат данных в поле: Тираж");
    if (creaseQuantity < 1 || !this.validator().isInt(creaseQuantity))throw new this.error("Неправильный формат данных в поле: Количесво биговок");
    this.total = this.countCreaseCost(quantity * creaseQuantity);
    var t = $(this.scope + " #total-cost");
    return t.append('<h4 class="text-right">Цена: ' + this.getTotal() + " грн.</h4>"), t.append('<h4 class="text-right">Цена с НДС: ' + this.getTotalWithVAT() + " грн.</h4>"), t.closest(".hidden").removeClass("hidden"), this.saveOrder(), this
}, CreaseCalculator.prototype.saveOrder = function () {
    var t = function () {
            return "custom" !== $("#size").val() ? $("#size :selected").text() : [$("#custom-size-width").val(), $("#custom-size-height").val()].join("x")
        }(),
        e = ["Биговка. ", "Формат: " + t, "Тираж: " + $("#quantity").val(), "Количество бигов: " + $("#crease-quantity").val()];
    this.order = {cost: this.getTotal(), details: e}
}, CuttingCalculator = function (arguments) {
    Calculator.call(this, arguments)
}, CuttingCalculator.prototype = new Calculator, CuttingCalculator.prototype.getTotalCost = function () {
    if (this.clean(), this.pieces = $("#piece-per-sheet").val(), this.pieces < 1 || !this.validator().isInt(this.pieces))throw new this.error("Неправильный формат данных в поле: Изделий на листе");
    if (this.sheets = $("#sheets").val(), this.sheets < 1 || !this.validator().isInt(this.sheets))throw new this.error("Неправильный формат данных в поле: Количество листов");
    this.total = this.countCuttingPrice(this.pieces, this.sheets);
    var t = $(this.scope + " #total-cost");
    return t.append('<h4 class="text-right">Цена: ' + this.getTotal() + " грн.</h4>"), t.append('<h4 class="text-right">Цена с НДС: ' + this.getTotalWithVAT() + " грн.</h4>"), t.closest(".hidden").removeClass("hidden"), this.saveOrder(), this
}, CuttingCalculator.prototype.saveOrder = function () {
    var t = ["Порезка. ", "Изделий на листе: " + this.pieces, "Количество листов: " + this.sheets];
    this.order = {cost: this.getTotal(), details: t}
};
var DigitalCalculator = function (arguments) {
    Calculator.call(this, arguments)
};
DigitalCalculator.prototype = new Calculator, DigitalCalculator.prototype.getSize = function () {
    var t = $("#size").val();
    "custom" == t ? t = {
        width: $(this.scope + " #custom-size-width").val(),
        height: $(this.scope + " #custom-size-height").val()
    } : "no-cutting" == t ? t = {width: 308, height: 438} : (sizes = t.split("x"), t = {
        width: sizes[0],
        height: sizes[1]
    });
    for (var e in t) {
        if (t[e] = Number(t[e]), t[e] < 1 || isNaN(t[e]))throw new this.error("Указан неправильный размер");
        if (t[e] < 30)throw new this.error("Минимальные размеры изделия не должны быть меньше 30 мм")
    }
    if (t.width > 308 && t.height > 308 || t.width > 438 || t.height > 438)throw new this.error("Изделие не помещается на печатный лист.");
    return t
}, DigitalCalculator.prototype.getTotalCost = function () {
    if (this.clean(), console.clear(), this.quantity = Number($(this.scope + " #quantity").val()), this.quantity < 1 || !this.validator().isInt(this.quantity))throw new this.error("Неправильный формат данных в поле тираж");
    if (size = this.getSize(), compose = this.compose(size), $(this.scope + " #lamination").prop("selectedIndex") > 2 && (compose = this.compose(size, 4, [305, 428]), this.warning("Ламинация плотнее 32 мк идет в форматах не более А3 (420х297). Пожалуйста, учитывайте это при создании макетов"), 0 == compose))throw new this.error("Изделие не поместится в ламинационную пленку");
    if (colors = $("#colors").val(), sides = 1, 1 != colors && 3 != colors || (sides = 2), totalSheets = Math.ceil(this.quantity / compose), prices = this.data.digital.prices.color, printClicks = totalSheets * sides, colors > 1 && (prices = this.data.digital.prices.grayscale, printClicks *= 2), printPrice = this.countPrintPrice(prices, printClicks), this.debugInfo("Цена за печать " + printPrice), materialPrice = Number($(this.scope + " #materials").val()) * totalSheets, this.debugInfo("Цена за бумагу " + materialPrice), this.total = printPrice + materialPrice, "no-cutting" !== $(this.scope + " #size").val()) {
        var t = this.countCuttingPrice(compose, totalSheets);
        this.debugInfo("Цена за порезку " + t), this.total += t
    }
    "without" !== $(this.scope + " #lamination").val() && (laminationPrice = this.countLaminationPrice("#lamination", totalSheets), this.total += laminationPrice, this.debugInfo("Цена за ламинацию " + laminationPrice)), "without" !== $(this.scope + " #binding-edge").val() && (creasePrice = this.countCreasePrice(this.quantity * $("#crease-quantity").val()), this.total += creasePrice, this.debugInfo("Цена за биговку " + creasePrice));
    var e = $(this.scope + " #total-cost");
    return "no-cutting" !== $(this.scope + " #size").val() && e.append('<h4 class="text-right">Количество изделий на лист ' + compose + "</h4>"), e.append('<h4 class="text-right">Количество листов ' + totalSheets + "</h4>"), e.append('<h4 class="text-right">Цена: ' + this.getTotal() + " грн.</h4>"), e.append('<h4 class="text-right">Цена с НДС: ' + this.getTotalWithVAT() + " грн.</h4>"), e.closest(".hidden").removeClass("hidden"), this.saveOrder(), this
}, DigitalCalculator.prototype.saveOrder = function () {
    var t = function () {
        return "custom" !== $("#size").val() ? $("#size :selected").text() : [$("#custom-size-width").val(), $("#custom-size-height").val()].join("x")
    }();
    order = ["Цифровая печать", "Тираж: " + this.quantity, "Формат: " + t, "Цветность: " + $("#colors :selected").text(), "Материал: " + $("#materials :selected").text()], "without" !== $(this.scope + " #lamination").val() && order.push("Ламинация: " + $("#lamination :selected").text()), "without" !== $(this.scope + " #binding-edge").val() && (order.push("Биговка : " + $("#binding-edge :selected").text()), order.push("Количество бигов: " + $("#crease-quantity").val())), this.order = {
        cost: this.getTotal(),
        details: order
    }
};
var DigitalCutCalculator = function (arguments) {
    Calculator.call(this, arguments)
};
DigitalCutCalculator.prototype = new Calculator, DigitalCutCalculator.prototype.getSize = function () {
    size = {width: $(this.scope + " #custom-size-width").val(), height: $(this.scope + " #custom-size-height").val()};
    for (var t in size) {
        if (size[t] = Number(size[t]), size[t] < 1 || isNaN(size[t]))throw new this.error("Указан неправильный размер");
        if (size[t] < 10)throw new this.error("Минимальные размеры изделия не должны быть меньше 10 мм")
    }
    if (size.width > 308 && size.height > 308 || size.width > 438 || size.height > 438)throw new this.error("Изделие не помещается на лист.");
    return size
}, DigitalCutCalculator.prototype.getTotalCost = function () {
    if (this.clean(), this.quantity = Number($(this.scope + " #quantity").val()), this.quantity < 1 || !this.validator().isInt(this.quantity))throw new this.error("Неправильный формат данных в поле тираж");
    cutting = this.data.postpress["digital-cutting"], size = this.getSize(), compose = this.compose(size), this.totalSheets = Math.ceil(this.quantity / compose), ranges = [], console.log(cutting.rates);
    for (var t in cutting.rates)ranges.push({range: t, value: cutting.rates[t]});
    rangeCoefficient = this.countRangeCoefficient(ranges, compose), this.debugInfo("Коефициент изделий на листе " + rangeCoefficient), materialsCoefficient = Number($("#materials").val()), this.debugInfo("Коефициент материала " + materialsCoefficient), digitalCutPrice = cutting["per-page"] * this.totalSheets * rangeCoefficient * materialsCoefficient, this.debugInfo("Цена за высечку " + digitalCutPrice), this.total = digitalCutPrice, this.total = this.total * cutting["outset-cut-rate"][$("#cut-form").val()], "none" != $("#cut-inner-form").val() && (this.total = this.total * cutting["inset-cut-rate"][$("#cut-inner-form").val()]), this.total < cutting.min && (this.total = Number(cutting.min));
    var e = $(this.scope + " #total-cost");
    return "no-cutting" !== $(this.scope + " #size").val() && e.append('<h4 class="text-right">Количество изделий на лист ' + compose + "</h4>"), e.append('<h4 class="text-right">Количество листов ' + this.totalSheets + "</h4>"), e.append('<h4 class="text-right">Цена: ' + this.getTotal() + " грн.</h4>"), e.append('<h4 class="text-right">Цена с НДС: ' + this.getTotalWithVAT() + " грн.</h4>"), e.closest(".hidden").removeClass("hidden"), this.saveOrder(), this
}, DigitalCutCalculator.prototype.saveOrder = function () {
    var t = function () {
        return [$("#custom-size-width").val(), $("#custom-size-height").val()].join("x")
    }();
    order = ["Цифровая прорезка", "Тираж: " + this.quantity, "Количество листов: " + this.totalSheets, "Формат: " + t, "Материал: " + $("#materials :selected").text(), "Форма высечки: " + $("#cut-form :selected").text(), "Внутренние елементы: " + $("#cut-inner-form :selected").text()], this.order = {
        cost: this.getTotal(),
        details: order
    }
}, DrillingCalculator = function (arguments) {
    Calculator.call(this, arguments)
}, DrillingCalculator.prototype = new Calculator, DrillingCalculator.prototype.getTotalCost = function () {
    if (this.clean(), this.quantity = Number($(this.scope + " #quantity").val()), this.holes = Number($(this.scope + " #holes-quantity").val()), this.thickness = Number($(this.scope + " #thickness").val().replace(",", ".")), this.quantity < 1 || !this.validator().isInt(this.quantity))throw new this.error("Неправильный формат данных в поле: Тираж");
    if (this.holes < 1 || !this.validator().isInt(this.holes))throw new this.error("Неправильный формат данных в поле: Количество отверстий");
    if (isNaN(this.thickness))throw new this.error("Неправильный формат данных в поле: Толщина изделия");
    this.total = this.countDrillingPrice(this.thickness * this.quantity * this.holes);
    var t = $(this.scope + " #total-cost");
    return t.append('<h4 class="text-right">Цена: ' + this.getTotal() + " грн.</h4>"), t.append('<h4 class="text-right">Цена с НДС: ' + this.getTotalWithVAT() + " грн.</h4>"), t.closest(".hidden").removeClass("hidden"), this.saveOrder(), this
}, DrillingCalculator.prototype.saveOrder = function () {
    order = ["Сверление", "Тираж: " + this.quantity, "Количество отверстий: " + this.holes, "Толщина изделия: " + this.thickness + " мм", "Диаметр сверления: " + $("#diameter :selected").text()], this.order = {
        cost: this.getTotal(),
        details: order
    }
}, EnvelopesCalculator = function (arguments) {
    Calculator.call(this, arguments)
}, EnvelopesCalculator.prototype = new Calculator, EnvelopesCalculator.prototype.getTotalCost = function () {
    if (this.clean(), this.quantity = $("#quantity").val(), this.quantity < 1 || !this.validator().isInt(this.quantity))throw new this.error("Неправильный формат данных в поле: Тираж");
    $envelope = $("#envelope :selected"), this.total = $envelope.val() * this.quantity * this.data.sets.euro, this.total += this.countPrintPrice(this.data.digital.prices.color, Math.ceil(this.quantity * $envelope.data("prate")));
    var t = $(this.scope + " #total-cost");
    return t.append('<h4 class="text-right">Цена: ' + this.getTotal() + " грн.</h4>"), t.append('<h4 class="text-right">Цена с НДС: ' + this.getTotalWithVAT() + " грн.</h4>"), t.closest(".hidden").removeClass("hidden"), this.saveOrder(), this
}, EnvelopesCalculator.prototype.saveOrder = function () {
    var t = ["Конверты", "Формат: " + $("#envelope :selected").text(), "Тираж: " + this.quantity];
    this.order = {cost: this.getTotal(), details: t}
}, BlankCalculator = function (arguments) {
    Calculator.call(this, arguments)
}, BlankCalculator.prototype = new Calculator, BlankCalculator.prototype.getTotalCost = function () {
    if (this.clean(), this.quantity = Number($(this.scope + " #quantity").val()), this.quantity < 1 || !this.validator().isInt(this.quantity))throw new this.error("Неправильный формат данных в поле тираж");
    if (0 == $("#print-method").val()) {
        var t = this.compose({width: 210, height: 297}), e = Math.ceil(this.quantity / t),
            i = 0 == $("#colors").val() ? 1 : 2, s = this.countPrintPrice(this.data.digital.prices.color, e * i),
            a = Number($(this.scope + " #materials").val()) * e;
        this.material = $("#materials :selected").text(), this.total = s + a;
        var o = this.countCuttingPrice(t, e);
        this.total += o
    } else this.material = $("#offset-materials :selected").text(), this.quantity = Number($("#offset-quantity option:selected").text()), this.total = Number($("#offset-quantity").val());
    this.totalWithVAT = this.total + this.total / 100 * this.data.sets.vat;
    var r = $(this.scope + " #total-cost");
    return r.append('<h4 class="text-right">Цена: ' + this.total.toFixed(0) + " грн.</h4>"), r.append('<h4 class="text-right">Цена с НДС: ' + this.totalWithVAT.toFixed(0) + " грн.</h4>"), r.closest(".hidden").removeClass("hidden"), this.saveOrder(), this
}, BlankCalculator.prototype.saveOrder = function () {
    var t = (function () {
        return "custom" !== $("#size").val() ? $("#size :selected").text() : [$("#custom-size-width").val(), $("#custom-size-height").val()].join("x")
    }(), 0 == $("#print-method").val() ? "цифровая" : "оффсетная");
    order = ["Бланки А4", "Способ печати: " + t + " печать", "Тираж: " + this.quantity, "Материал: " + this.material], this.order = {
        cost: this.getTotal(),
        details: order
    }
}, FolderCalculator = function (arguments) {
    Calculator.call(this, arguments)
}, FolderCalculator.prototype = new Calculator, FolderCalculator.prototype.getSize = function () {
    return {width: 305, height: 436}
}, FolderCalculator.prototype.getTotalCost = function () {
    if (this.clean(), console.clear(), this.quantity = $("#quantity").val(), this.quantity < 1 || !this.validator().isInt(this.quantity))throw new this.error("Неправильный формат данных в поле: Тираж");
    printPrice = this.countPrintPrice(this.data.digital.prices.color, this.quantity * (Number($("#color").val()) + 1)), this.debugInfo("Цена за печать " + printPrice), materialPrice = $("#materials :selected").val() * this.quantity, this.debugInfo("Цена за бумагу " + materialPrice), this.total = printPrice + materialPrice, $lamination = $("#lamination").val(), "without" !== $lamination && (laminationPrice = this.countLaminationPrice("#lamination", this.quantity), this.debugInfo("Цена за ламинацию " + laminationPrice), this.total += laminationPrice), $("#folder-type").val() > 0 ? creasePrice = this.countCreasePrice(2 * this.quantity, this.data.postpress.crease.auto) : creasePrice = this.countCreasePrice(this.quantity, this.data.postpress.crease.auto), this.total += creasePrice, cuttingPrice = this.countCuttingPrice(1, this.quantity), this.debugInfo("Цена за порезку " + cuttingPrice), this.total += cuttingPrice, $("#folder-pocket").val() > 0 && (this.debugInfo("------------- Карман -------------"), pocketMaterialPrice = $("#materials :selected").val() * Math.ceil(this.quantity / 4), this.debugInfo("Цена за бумагу для карманов " + materialPrice), $("#folder-color").val() > 0 && (pocketPrintPrice = this.countPrintPrice(this.data.digital.prices.color, this.quantity * Number($("#folder-color").val())), this.debugInfo("Цена за печать карманов " + pocketPrintPrice), this.total += pocketPrintPrice), 2 == $("#folder-pocket").val() && (cuttingPrice = this.data.postpress.folders["pocket-cutting"] * this.quantity, this.debugInfo("Цена за просечку карманов " + cuttingPrice), this.total += cuttingPrice), "without" !== $lamination && (laminationPrice = this.countLaminationPrice("#lamination", Math.ceil(this.quantity / 4)), this.debugInfo("Цена за ламинацию карманов " + laminationPrice), this.total += laminationPrice), cuttingPrice = this.countCuttingPrice(4, this.quantity), this.debugInfo("Цена за порезку " + cuttingPrice), this.total += cuttingPrice, $("#folder-type").val() > 0 ? (creasePrice = this.countCreasePrice(4 * this.quantity, this.data.postpress.crease.manual), foldingPrice = this.data.postpress.folders.folding.bulk * this.quantity) : (creasePrice = this.countCreasePrice(2 * this.quantity, this.data.postpress.crease.manual), foldingPrice = this.data.postpress.folders.folding.flat * this.quantity), this.debugInfo("Цена за сборку " + foldingPrice), this.total += creasePrice + foldingPrice);
    var t = $(this.scope + " #total-cost");
    return t.append('<h4 class="text-right">Цена: ' + this.getTotal() + " грн.</h4>"), t.append('<h4 class="text-right">Цена с НДС: ' + this.getTotalWithVAT() + " грн.</h4>"), t.closest(".hidden").removeClass("hidden"), this.saveOrder(), this
}, FolderCalculator.prototype.saveOrder = function () {
    console.log(this);
    var t = ["Папки", "Тираж: " + this.quantity, "Материал: " + $("#materials option:selected").text(), "Цветность: " + $("#color option:selected").text(), "Тип папки: " + $("#folder-type option:selected").text(), "Карман: " + $("#folder-pocket option:selected").text(), "Ламинация: " + $("#lamination option:selected").text()];
    console.log(this), this.order = {cost: this.getTotal(), details: t}
}, LaminationCalculator = function (arguments) {
    Calculator.call(this, arguments)
}, LaminationCalculator.prototype = new Calculator, LaminationCalculator.prototype.getTotalCost = function () {
    if (this.clean(), this.pieces = $("#piece-per-sheet").val(), $lamination = $("#lamination-material"), this.quantity = $("#quantity").val(), this.quantity < 1 || !this.validator().isInt(this.quantity))throw new this.error("Неправильный формат данных в поле: Тираж");
    $lamination.prop("selectedIndex") > 1 && this.warning("Ламинация плотнее 32 мк идет в форматах не более А3 (420х297). Пожалуйста, учитывайте это при создании макетов"), this.total = this.countLaminationPrice("#lamination-material", this.quantity);
    var t = $(this.scope + " #total-cost");
    return t.append('<h4 class="text-right">Цена: ' + this.getTotal() + " грн.</h4>"), t.append('<h4 class="text-right">Цена с НДС: ' + this.getTotalWithVAT() + " грн.</h4>"), t.closest(".hidden").removeClass("hidden"), this.saveOrder(), this
}, LaminationCalculator.prototype.saveOrder = function () {
    var t = ["Ламинация", "Количество: " + this.quantity, "Плотность ламинационной пленки: " + $("#lamination-material option:selected").text()];
    this.order = {cost: this.getTotal(), details: t}
}, OffsetCalculator = function (arguments) {
    Calculator.call(this, arguments)
}, OffsetCalculator.prototype = new Calculator, OffsetCalculator.prototype.getTotalCost = function () {
    this.clean(), console.log("count", $("#amount").val());
    var t = $(this.scope + " #total-cost");
    return this.product = $("#product option:selected").text(), this.material = $("#materials option:selected").text(), this.amount = $("#amount option:selected").text(), this.total = $("#amount").val() * this.data.sets.incrase, t.append('<h4 class="text-right">Цена: ' + this.total.toFixed(0) + " грн.</h4>"), this.totalWithVAT = this.total + this.total / 100 * this.data.sets.vat, t.append('<h4 class="text-right">Цена с НДС: ' + this.totalWithVAT.toFixed(0) + " грн.</h4>"), t.closest(".hidden").removeClass("hidden"), this.saveOrder(), this
}, OffsetCalculator.prototype.saveOrder = function () {
    var t = ["Офсетная печать", "Продукция: " + this.product, "Материал: " + this.material, "Тираж: " + this.amount];
    this.order = {cost: this.getTotal(), details: t}
}, PosterCalculator = function (arguments) {
    Calculator.call(this, arguments)
}, PosterCalculator.prototype = new Calculator, PosterCalculator.prototype.getDigitalSize = function () {
    var t = $("#size").val();
    "no-cutting" == t ? t = {width: 308, height: 438} : (sizes = t.split("x"), t = {width: sizes[0], height: sizes[1]});
    for (var e in t) {
        if (t[e] = Number(t[e]), t[e] < 1 || isNaN(t[e]))throw new this.error("Указан неправильный размер");
        if (t[e] < 30)throw new this.error("Минимальные размеры изделия не должны быть меньше 30 мм")
    }
    if (t.width > 308 && t.height > 308 || t.width > 438 || t.height > 438)throw new this.error("Изделие не помещается на печатный лист.");
    return t
}, PosterCalculator.prototype.getWideSize = function () {
    var t = $("#wide-size").val();
    "custom" == t ? t = {
        width: Number($(this.scope + " #custom-size-width").val().replace(",", ".")),
        height: Number($(this.scope + " #custom-size-height").val().replace(",", "."))
    } : (sizes = t.split("x"), t = {width: Number(sizes[0]), height: Number(sizes[1])});
    var e = $(this.scope + " #wide-materials option:selected");
    if (t.maxWidth = e.data("maxwidth"), $("#material-help").html("Максимальная ширина " + t.maxWidth + " м"), t.widthRanges = String(e.data("width")), t.width > t.maxWidth && t.height > t.maxWidth)throw new this.error("Размеры изделия превышают ширину материала");
    if (isNaN(t.width) || isNaN(t.height) || !this.validator().isPositive(t.width) || !this.validator().isPositive(t.height))throw new this.error("Указаны неверные размеры");
    return t
}, PosterCalculator.prototype.composeWide = function (t, e, i) {
    return shortSide = Math.min(e.width, e.height), longSide = Math.max(e.width, e.height), t === longSide ? (printQuadrature = shortSide * longSide * i, wasteQuadrature = 0) : t < longSide ? (maxFill = Math.floor(t / shortSide), materialWidth = Math.ceil(i / maxFill) * longSide, materialQuadrature = t * materialWidth, printQuadrature = shortSide * longSide * i, wasteQuadrature = materialQuadrature - printQuadrature) : t > longSide && (shortSideFill = Math.floor(t / shortSide), shortSideWidth = Math.ceil(i / shortSideFill) * longSide, shortSideMaterialQuadrature = t * shortSideWidth, longSideFill = Math.floor(t / longSide), longSideWidth = Math.ceil(i / longSideFill) * shortSide, longSideMaterialQuadrature = t * longSideWidth, shortSideMaterialQuadrature > longSideMaterialQuadrature ? materialQuadrature = longSideMaterialQuadrature : materialQuadrature = shortSideMaterialQuadrature, printQuadrature = shortSide * longSide * i, wasteQuadrature = materialQuadrature - printQuadrature), {
        printQuadrature: printQuadrature,
        wasteQuadrature: wasteQuadrature
    }
}, PosterCalculator.prototype.getTotalCost = function () {
    if (this.clean(), this.quantity = Number($(this.scope + " #quantity").val()), this.quantity < 1 || !this.validator().isInt(this.quantity))throw new this.error("Неправильный формат данных в поле тираж");
    if (0 == $("#print-method").val()) {
        var t = this.compose(this.getDigitalSize()), e = Math.ceil(this.quantity / t),
            i = this.countPrintPrice(this.data.digital.prices.color, e),
            s = Number($(this.scope + " #materials").val()) * e;
        if (this.material = $("#materials :selected").text(), this.total = i + s, "no-cutting" !== $(this.scope + " #size").val()) {
            var a = this.countCuttingPrice(t, e);
            this.total += a
        }
    } else {
        this.material = $("#wide-materials :selected"), this.size = this.getWideSize();
        for (var o = this.size.widthRanges.split(","), t = [], r = 0; r < o.length; r++)t[r] = this.composeWide(Number(o[r]), this.size, this.quantity), t[r].maxWidth = Number(o[r]);
        var n = 1 / 0, h = 0;
        for (var l in t)t[l].wasteQuadrature < n && (n = t[l].wasteQuadrature, h = l);
        this.composed = t[h];
        var s = this.composed.wasteQuadrature * Number(this.material.val()),
            i = this.composed.printQuadrature * (Number(this.material.data("pcost")) + Number(this.material.val()));
        this.total = s + i
    }
    this.totalWithVAT = this.total + this.total / 100 * this.data.sets.vat;
    var c = $(this.scope + " #total-cost");
    return c.append('<h4 class="text-right">Цена: ' + this.total.toFixed(0) + " грн.</h4>"), c.append('<h4 class="text-right">Цена с НДС: ' + this.totalWithVAT.toFixed(0) + " грн.</h4>"), c.closest(".hidden").removeClass("hidden"), this.saveOrder(), this
}, PosterCalculator.prototype.saveOrder = function () {
    var t = function () {
        return 0 == $("#print-method").val() ? $("#size :selected").text() : "custom" !== $("#wide-size").val() ? $("#size :selected").text() : [$("#custom-size-width").val(), $("#custom-size-height").val()].join("x") + " м"
    }();
    0 == $("#print-method").val() ? material = $("#materials :selected").text() : material = $("#wide-materials :selected").text(), order = ["Плакаты", "Способ печати: " + $("#print-method :selected").text(), "Формат: " + t, "Тираж: " + this.quantity, "Материал: " + material], this.order = {
        cost: this.getTotal(),
        details: order
    }
}, StampingCalculator = function (arguments) {
    Calculator.call(this, arguments)
}, StampingCalculator.prototype = new Calculator, StampingCalculator.prototype.getSize = function () {
    size = {width: $(this.scope + " #custom-size-width").val(), height: $(this.scope + " #custom-size-height").val()};
    for (var t in size)if (size[t] = Number(size[t]), size[t] < 1 || isNaN(size[t]))throw new this.error("Указан неправильный размер");
    if (Math.max(size.width, size.height) > 200)throw new this.error("Максимально возможный размер для клише 200х200");
    return size
}, StampingCalculator.prototype.getTotalCost = function () {
    this.clean(), this.quantity = Number($(this.scope + " #quantity").val()), this.size = this.getSize(), this.square = (this.size.width + 20) * (this.size.height + 20) / 100, stampingType = $("#stamping-type").val(), prices = this.data.postpress.stamping.prices;
    for (var t in prices)range = t.split("-"), this.square >= range[0] && this.square <= range[1] && (price = prices[t]);
    price = price[stampingType], stacks = Math.ceil(this.quantity / 100), stampingWorkCost = Number(price.first) + (stacks - 1) * Number(price.next), this.debugInfo("Цена за работу " + stampingWorkCost), this.total = stampingWorkCost;
    var e = $(this.scope + " #total-cost");
    return 0 == $("#form-exist").val() && (clicheCostPerCm = this.data.postpress.stamping.cliche["3mm"], 3 == $("#stamping-type") && (clicheCostPerCm = this.data.postpress.stamping.cliche["7mm"]), clicheCost = this.square * clicheCostPerCm * this.data.sets.usd, clicheCost < this.data.postpress.stamping.cliche.min && (clicheCost = this.data.postpress.stamping.cliche.min), clicheCost += Number(this.data.sets.delivery), this.total += clicheCost, e.append('<h4 class="text-right">Цена за клише: ' + clicheCost.toFixed(0) + " грн.</h4>")), e.append('<h4 class="text-right">Цена: ' + this.getTotal() + " грн.</h4>"), e.append('<h4 class="text-right">Цена с НДС: ' + this.getTotalWithVAT() + " грн.</h4>"), e.closest(".hidden").removeClass("hidden"), this.saveOrder(), this
}, StampingCalculator.prototype.saveOrder = function () {
    order = ["Тиснение", "Тираж: " + this.quantity, "Размеры клише: " + this.size.width + "x" + this.size.height + "мм", "Тип тиснения: " + $("#stamping-type option:selected").text(), "Наличие клише: " + $("#form-exist :selected").text()], this.order = {
        cost: this.getTotal(),
        details: order
    }
}, WideCalculator = function (arguments) {
    Calculator.call(this, arguments)
}, WideCalculator.prototype = new Calculator, WideCalculator.prototype.getSize = function () {
    var t = $("#size").val();
    "custom" == t ? t = {
        width: Number($(this.scope + " #custom-size-width").val().replace(",", ".")),
        height: Number($(this.scope + " #custom-size-height").val().replace(",", "."))
    } : (sizes = t.split("x"), t = {width: Number(sizes[0]), height: Number(sizes[1])});
    var e = $(this.scope + " #materials option:selected");
    if (t.maxWidth = e.data("maxwidth"), $("#material-help").html("Максимальная ширина " + t.maxWidth + " м"), t.widthRanges = String(e.data("width")), t.width > t.maxWidth && t.height > t.maxWidth)throw new this.error("Размеры изделия превышают максимальную ширину материала");
    if (isNaN(t.width) || isNaN(t.height) || !this.validator().isPositive(t.width) || !this.validator().isPositive(t.height))throw new this.error("Указаны неверные размеры");
    return t
}, WideCalculator.prototype.compose = function (t, e, i) {
    var e = e || this.getSize();
    return shortSide = Math.min(e.width, e.height), longSide = Math.max(e.width, e.height), t === longSide ? (printQuadrature = shortSide * longSide * i, wasteQuadrature = 0) : t < longSide ? (maxFill = Math.floor(t / shortSide), materialWidth = Math.ceil(i / maxFill) * longSide, materialQuadrature = t * materialWidth, printQuadrature = shortSide * longSide * i, wasteQuadrature = materialQuadrature - printQuadrature) : t > longSide && (shortSideFill = Math.floor(t / shortSide), shortSideWidth = Math.ceil(i / shortSideFill) * longSide, shortSideMaterialQuadrature = t * shortSideWidth, longSideFill = Math.floor(t / longSide), longSideWidth = Math.ceil(i / longSideFill) * shortSide, longSideMaterialQuadrature = t * longSideWidth, shortSideMaterialQuadrature > longSideMaterialQuadrature ? materialQuadrature = longSideMaterialQuadrature : materialQuadrature = shortSideMaterialQuadrature, printQuadrature = shortSide * longSide * i, wasteQuadrature = materialQuadrature - printQuadrature), {
        printQuadrature: printQuadrature,
        wasteQuadrature: wasteQuadrature
    }
}, WideCalculator.prototype.getTotalCost = function () {
    if (this.clean(), this.quantity = Number($("#quantity").val()), !this.validator().isInt(this.quantity) && !this.validator().isPositive(this.quantity))throw new this.error("Неправильный формат данных в поле тираж");
    var t = $("#materials :selected");
    this.size = this.getSize();
    for (var e = this.size.widthRanges.split(","), i = [], s = 0; s < e.length; s++)i[s] = this.compose(Number(e[s]), this.size, this.quantity), i[s].maxWidth = Number(e[s]);
    var a = 1 / 0, o = 0;
    for (var r in i)i[r].wasteQuadrature < a && (a = i[r].wasteQuadrature, o = r);
    this.composed = i[o], this.debugInfo("Оптимальная ширина рулона " + this.composed.maxWidth + " м"), this.debugInfo("Квадратура запечатки " + this.composed.printQuadrature + " м2"), this.debugInfo("Квадратура незапечатанной расходной бумаги " + this.composed.wasteQuadrature + " м2");
    var n = this.composed.wasteQuadrature * Number(t.val());
    this.debugInfo("Цена расходной бумаги " + n);
    var h = this.composed.printQuadrature * Number(t.data("pcost")),
        l = this.composed.printQuadrature * Number(t.val());
    this.debugInfo("Цена печати " + h), this.debugInfo("Цена бумаги " + (l + n)), this.total = l + h + n;
    var c = 0;
    $("#postpress").hasClass("hidden") ? ($("#pocket-check").is(":checked") && (pocketPrice = $("#pocket-check").val() * $("#pocket").val().replace(",", "."), c += pocketPrice, this.debugInfo("Цена за проварку " + pocketPrice)), $("#cringle-check").is(":checked") && (cringlePrice = $("#cringle-check").val() * $("#cringle").val(), c += cringlePrice, this.debugInfo("Цена за люверсы" + cringlePrice))) : (postpressCost = this.composed.printQuadrature * Number($("#postpress-select").val()), this.total += postpressCost, this.debugInfo("Цена за " + $("#postpress-select option:selected").text() + " " + postpressCost)), this.total += c * this.quantity, this.totalWithVAT = this.total + this.total / 100 * this.data.sets.vat;
    var d = this.countDiscount(this.total);
    this.totalWithDiscount = this.total - this.total / 100 * d, this.debugInfo("Общая сумма " + this.total + " грн"), this.debugInfo("Скидка от суммы " + d + "% " + (this.totalWithDiscount - this.total) + " грн");
    var u = $(this.scope + " #total-cost");
    return this.totalWithDiscount = this.totalWithDiscount.toFixed(0), this.totalWithVAT = parseFloat(this.totalWithDiscount) + this.totalWithDiscount / 100 * this.data.sets.vat, u.append('<h4 class="text-right">Цена: ' + this.totalWithDiscount + " грн.</h4>"), u.append('<h4 class="text-right">Цена c НДС: ' + this.totalWithVAT.toFixed(0) + " грн.</h4>"), this.saveOrder(), u.closest(".hidden").removeClass("hidden"), this
}, WideCalculator.prototype.countDiscount = function (t) {
    discountData = this.data.wide.discount;
    var e = Number(discountData.maxPercent), i = Number(discountData.minPercent), s = (e - i) / 100,
        a = Number(discountData.maxSum), o = Number(discountData.minSum), r = (a - o) / 100, n = 0;
    if (t >= o && t <= a) {
        var h = t - o;
        n = h / r * s + i
    } else t > a && (n = e);
    return n
}, WideCalculator.prototype.saveOrder = function () {
    order = ["Широкоформатная печать", "Тираж: " + this.quantity, "Формат: " + this.size.width + "x" + this.size.height + " м", "Материал: " + $("#materials :selected").text() + "Ширина " + this.composed.maxWidth];
    var t = "";
    $("#postpress").hasClass("hidden") ? ($("#pocket-check").is(":checked") && (t = t + "Проварка карманов " + $("#pocket").val() + " м. "), $("#cringle-check").is(":checked") && (t = t + "Установка люверсов " + $("#cringle").val() + " шт. дистанция между люверсами " + $("#cringle-range").val() + " м")) : t = $("#postpress-select :selected").text(), $("#postpress").val() > 0 && order.push("Постпечать: " + t), this.order = {
        cost: this.totalWithDiscount,
        details: order
    }
}, WoblerCalculator = function (arguments) {
    Calculator.call(this, arguments)
}, WoblerCalculator.prototype = new Calculator, WoblerCalculator.prototype.getTotalCost = function () {
    if (this.clean(), this.quantity = Number($(this.scope + " #quantity").val()), this.quantity < 1 || !this.validator().isInt(this.quantity))throw new this.error("Неправильный формат данных в поле тираж");
    var t = this.compose(this.getSize());
    this.totalSheets = Math.ceil(this.quantity / t);
    var e = this.countPrintPrice(this.data.digital.prices.color, this.totalSheets),
        i = Number($(this.scope + " #materials").val()) * this.totalSheets;
    this.total = e + i;
    var s = this.countCuttingPrice(t, this.totalSheets);
    if (this.total += s, "without" !== $("#lamination").val() && (laminationPrice = this.countLaminationPrice("#lamination", this.totalSheets), this.debugInfo("Цена за ламинацию " + laminationPrice), this.total += laminationPrice), 0 == $("#wobler-form").val()) {
        cutting = this.data.postpress["digital-cutting"], ranges = [];
        for (var a in cutting.rates)ranges.push({range: a, value: cutting.rates[a]});
        rangeCoefficient = this.countRangeCoefficient(ranges, t), materialsCoefficient = Number(cutting.materials[2].rate), "without" !== $("#lamination").val() && (materialsCoefficient = Number(cutting.materials[3].rate)), digitalCutPrice = cutting["per-page"] * this.totalSheets * rangeCoefficient * materialsCoefficient, this.debugInfo("Цена за высечку " + digitalCutPrice), digitalCutPrice < cutting.min && (digitalCutPrice = Number(cutting.min)), this.total += digitalCutPrice
    }
    wobblerStem = this.data.supplies["wobbler-stem"], ranges = [];
    for (var a in wobblerStem.rates)ranges.push({range: a, value: wobblerStem.rates[a]});
    rangeCoefficient = this.countRangeCoefficient(ranges, this.quantity), wobblerStemPrice = wobblerStem.price * rangeCoefficient * this.data.sets.usd * this.quantity, this.total += wobblerStemPrice;
    var o = $(this.scope + " #total-cost");
    return o.append('<h4 class="text-right">Цена: ' + this.getTotal() + " грн.</h4>"), o.append('<h4 class="text-right">Цена с НДС: ' + this.getTotalWithVAT() + " грн.</h4>"), o.closest(".hidden").removeClass("hidden"), this.saveOrder(), this
}, WoblerCalculator.prototype.saveOrder = function () {
    var t = function () {
        return "custom" !== $("#size").val() ? $("#size :selected").text() : [$("#custom-size-width").val(), $("#custom-size-height").val()].join("x")
    }();
    order = ["Воблеры", "Тираж: " + this.quantity, "Формат: " + t, "Материал: " + $(this.scope + " #materials option:selected").text(), "Форма: " + $(this.scope + " #wobler-form option:selected").text()], this.order = {
        cost: this.getTotal(),
        details: order
    }
};
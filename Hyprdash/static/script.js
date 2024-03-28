$(document).ready(function() {
    function isNumberKey(evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode == 46) return true;
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    }

    function createColorPicker(deleteButton, defaultColor, defaultOpacity) {
        var colorPickerLabel = $("<label>").addClass("color-picker");
        var colorInput = $("<input>").attr("type", "color").on("input", function() {
            $(this).attr("title", $(this).val());
        });
        var transparencySlider = $("<label>").addClass("transparency-slider");
        var transparencyInput = $("<input>").attr({
            "type": "range",
            "min": 0,
            "max": 255,
            "step": 1
        }).on("input", function() {
            $(this).next().val($(this).val());
            $(this).parent().prev().css("opacity", $(this).val() / 255);
        });
        var transparencyNumberInput = $("<input>").attr("type", "text").on("focusout", function() {
            if (!$(this).val()) {
                $(this).val(0);
                $(this).prev().val(0);
            }
        }).on("keypress", function() {
            return isNumberKey(event);
        }).on("input", function() {
            var min = parseFloat($(this).prev().attr("min"));
            var max = parseFloat($(this).prev().attr("max"));
            if (min <= $(this).val() && $(this).val() <= max)
                $(this).prev().val($(this).val());
            else
                $(this).val($(this).prev().val());
            $(this).parent().prev().css("opacity", $(this).val() / 255);
        });
        var colorRemoveButton = $("<input>").attr({
            "type": "button",
            "value": "Remove Color"
        }).on("click", function() {
            $(this).parent().parent().remove();
        });

        if (defaultColor) colorInput.val(defaultColor);

        if (defaultOpacity) {
            transparencyInput.val(defaultOpacity);
            colorInput.css("opacity", defaultOpacity / 255);
            transparencyNumberInput.val(defaultOpacity);
        } else {
            transparencyInput.val(255);
            transparencyNumberInput.val(255);
        }

        colorInput.attr("title", colorInput.val());
        transparencySlider.append(transparencyInput);
        transparencySlider.append(transparencyNumberInput);
        if (deleteButton) transparencySlider.append(colorRemoveButton);
        colorPickerLabel.append(colorInput);
        colorPickerLabel.append(transparencySlider);
        return colorPickerLabel;
    }

    function createBoolSwitch(defaultValue) {
        var switchLabel = $("<label>").addClass("switch");
        var checkboxInput = $("<input>").attr({
            "type": "checkbox",
            "checked": defaultValue
        });
        var switchSlider = $("<span>").addClass("switch-slider");
        switchLabel.append(checkboxInput);
        switchLabel.append(switchSlider);
        return switchLabel;
    }

    function createRange(defaultValue, min, max, step) {
        var rangeLabel = $("<label>").addClass("slider");
        var rangeInput = $("<input>").attr({
            "type": "range",
            "min": min,
            "max": max,
            "step": step,
            "value": defaultValue
        }).on("input", function() {
            $(this).next().val($(this).val());
        });
        var numberInput = $("<input>").attr({
            "type": "text",
            "value": defaultValue
        }).on("focusout", function() {version
            if (!$(this).val()) {
                $(this).val(0);
                $(this).prev().val(0);
            }
        }).on("keypress", function() {
            return isNumberKey(event);
        }).on("input", function() {
            var min = parseFloat($(this).prev().attr("min"));
            var max = parseFloat($(this).prev().attr("max"));
            if (min <= $(this).val() && $(this).val() <= max)
                $(this).prev().val($(this).val());
            else
                $(this).val($(this).prev().val());
        });
        rangeLabel.append(rangeInput);
        rangeLabel.append(numberInput);
        return rangeLabel;
    }

    function createSelect(defaultValue, optionList) {
        var selectLabel = $("<label>").addClass("selection");
        var select = $("<select>");
        optionList.forEach(element => {
            if (typeof element === 'string' || element instanceof String) element = element.split("|");
            var option = $("<option>").text(element[0]).val(element[1]);
            select.append(option);
        });
        selectLabel.append(select);
        if (defaultValue) select.find("option[value='" + defaultValue + "']").prop("selected", true);
        return selectLabel;
    }

    function convertToColor(colors) {
        let colorArray = []
        colors.split(" ").forEach(color => {
            if (color.substring(0,2) == "0x") { //LEGACY COLOR
                colorArray.push(["#" + color.substring(2, color.length-2), parseInt(color.substring(color.length-2, color.length), 16)]);
            }
            else if (color.substring(0,5) == "rgba(") { //RGBA COLOR
                colorArray.push(["#" + color.substring(5,color.length -3), parseInt(color.substring(color.length -3, color.length -1), 16)]);
            }
            else if (color.substring(0,4) == "rgb(") { //RGB COLOR
                colorArray.push(["#" + color.substring(4,color.length -1), 255]);
            }
        });
        return colorArray;
    }

    function showModal(data) {
        $("#modal-widget > #window > #content").html(data);
        $("#modal-widget").css("display", "flex");
    }

    //RUN AT LOAD
    $.getJSON("/request/data", function(data){
        console.log(data)
        $("#modal-widget > #window-background").on("click", function() {
            $(this).parent().css("display", "none");
        });
        $("#welcome-widget > #user #username").text(data['user']['username'].charAt(0).toUpperCase() + data['user']['username'].slice(1));
        $("#welcome-widget > #user small > #hostname").text(data['system-info'].split("\nNode name: ")[1].split("\n")[0]);
        $("#welcome-widget > #user small > #info").on("click", function() {
            showModal(data['system-info'].replaceAll("\n", "<br>"));
        });
        $("#save-button").on("click", function() {
            $("#save-button").prop('disabled', true);
            let changes = {'config': {}};
            $(".form-widget").each(function() {
                if ($(this).hasClass("bool")) {
                    isChecked = $($(this).find("input[type=checkbox]")).is(":checked");
                    id = $(this).attr("id");
                    if (data['config'][id] != isChecked) changes['config'][id] = isChecked;
                }
                else if ($(this).hasClass("range")) {
                    value = $($(this).find("input[type=range]")).val();
                    id = $(this).attr("id");
                    if (data['config'][id] != value) changes['config'][id] = value;
                }
                else if ($(this).hasClass("select")) {
                    value = $($(this).find(":selected")).val();
                    id = $(this).attr("id");
                    if (data['config'][id] != value) changes['config'][id] = value;
                }
            });
            console.log(changes)
            $.ajax({
                url: "/receive/test",
                type: "POST",
                async: false,
                cache: false,
                timeout: 30000,
                contentType: "application/json",
                data: JSON.stringify(changes),
                dataType: "json",
                success: function(msg) {
                    console.log(msg)
                    $("#save-button").prop('disabled', false);
                },
                fail: function() {
                    console.log("womp womp")
                }
            });
            
        });

        $(".form-widget.bool").each(function() {
            if ($(this).children("div#action").length > 0) return;
            $(this).append($("<div id='action'></div>"));
            $($(this).find("div#action")).append(createBoolSwitch(data['config'][$(this).attr("id")]));
        });
        $(".form-widget.range").each(function() {
            if ($(this).children("div#action").length > 0) return;
            const properties = $(this).attr("data").split(",");
            $(this).removeAttr("data");
            $(this).append($("<div id='action'></div>"));
            $($(this).find("div#action")).append(createRange(data['config'][$(this).attr("id")], properties[0], properties[1], properties[2]));
        });
        $(".form-widget.select").each(function() {
            if ($(this).children("div#action").length > 0) return;
            const options = $(this).attr("data").split(",");
            $(this).removeAttr("data");
            $(this).append($("<div id='action'></div>"));
            $($(this).find("div#action")).append(createSelect(data['config'][$(this).attr("id")], options));
        });
        $(".form-widget.color").each(function() {
            let colors = convertToColor(data['config'][$(this).attr("id")]);
            if (colors.length == 0) return;
            $(this).append($("<div id='action'></div>"));
            if (colors.length == 1) {
                $($(this).find("div#action")).append(createColorPicker(false, colors[0][0], colors[0][1]));
            }
            else {
                var addButtonLabel = $("<label>").addClass("add-color");
                var addButton = $("<button>").addClass("material-symbols-outlined").text("add").on("click", function(){
                    $(this.parentNode.nextElementSibling).append(createColorPicker(true, null, null));
                });
                $(addButtonLabel).append($(addButton));
                $($(this).find("div#action")).append($(addButtonLabel));
                $($(this).find("div#action")).append($("<div id='colors-container'></div>"));
                colors.forEach(color => {
                    $($(this).find("div#colors-container")).append(createColorPicker(true, color[0], color[1]))
                });
            }
        });
    })
});
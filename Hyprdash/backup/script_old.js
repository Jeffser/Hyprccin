function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode == 46) return true;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}
function createColorPicker(deleteButton, defaultColor, defaultOpacity) {
    var colorPickerLabel = document.createElement("label");
    colorPickerLabel.className = "color-picker";
    var colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.addEventListener("input", function(){this.title=this.value});
    var transparencySlider = document.createElement("label");
    transparencySlider.className = "transparency-slider";
    var transparencyInput = document.createElement("input");
    transparencyInput.addEventListener("input", function(){this.nextElementSibling.value=this.value; this.parentNode.previousElementSibling.style.opacity = this.value / 255});
    transparencyInput.type = "range";
    transparencyInput.min = 0;
    transparencyInput.max = 255;
    transparencyInput.step = 1;
    var transparencyNumberInput = document.createElement("input");
    transparencyNumberInput.addEventListener("focusout", function(){if (!this.value) {this.value=0; this.previousElementSibling.value=0}});
    transparencyNumberInput.addEventListener("keypress", function(){return isNumberKey(event)});
    transparencyNumberInput.type = "text";
    transparencyNumberInput.addEventListener("input", function(){
        if (parseFloat(this.previousElementSibling.min) <= this.value && this.value <= parseFloat(this.previousElementSibling.max))
            this.previousElementSibling.value=this.value;
        else
            this.value = this.previousElementSibling.value;
        this.parentNode.previousElementSibling.style.opacity = this.value / 255;
    });
    colorRemoveButton = document.createElement("input");
    colorRemoveButton.type = "button";
    colorRemoveButton.value = "Remove Color";
    colorRemoveButton.addEventListener("click", function(){
        this.parentNode.parentNode.remove()
    });

    if (defaultColor) colorInput.value = defaultColor;

    if (defaultOpacity) {
        transparencyInput.value = defaultOpacity;
        colorInput.style.opacity = defaultOpacity / 255;
        transparencyNumberInput.value = defaultOpacity;
    }
    else {
        transparencyInput.value = 255;
        transparencyNumberInput.value = 255;
    }

    colorInput.title = colorInput.value;
    transparencySlider.append(transparencyInput);
    transparencySlider.append(transparencyNumberInput);
    if (deleteButton) transparencySlider.append(colorRemoveButton);
    colorPickerLabel.append(colorInput)
    colorPickerLabel.append(transparencySlider);
    return colorPickerLabel;
}
function createGradient(colorList) {
    var addColorLabel = document.createElement("label");
    addColorLabel.className = "add-color";
    var addColorButton = document.createElement("button");
    addColorButton.className = "material-symbols-outlined";
    addColorButton.addEventListener("click", function(){
        this.parentNode.nextElementSibling.append(createColorPicker(true, null, null));
    });
    addColorButton.innerText = "add";
    var colorsContainer = document.createElement("div");
    colorsContainer.id = "colors-container";
    colorList.forEach(element => {
        colorsContainer.append(createColorPicker(true, element[0], element[1]));
    });
    addColorLabel.append(addColorButton);
    return [addColorLabel, colorsContainer];
}
function createBoolSwitch(defaultValue) {
    var switchLabel = document.createElement("label");
    switchLabel.className = "switch";
    var checkboxInput = document.createElement("input");
    checkboxInput.type = "checkbox"
    checkboxInput.checked = defaultValue;
    var switchSlider = document.createElement("span");
    switchSlider.className = "switch-slider";
    switchLabel.append(checkboxInput);
    switchLabel.append(switchSlider);
    return switchLabel;
}
function createRange(defaultValue, min, max, step) {
    var rangeLabel = document.createElement("label");
    rangeLabel.className = "slider";
    var rangeInput = document.createElement("input");
    rangeInput.type = "range";
    rangeInput.min = min;
    rangeInput.max = max;
    rangeInput.step = step;
    rangeInput.value = defaultValue;
    rangeInput.addEventListener("input", function(){
        this.nextElementSibling.value = this.value;
    });
    var numberInput = document.createElement("input");
    numberInput.type = "text";
    numberInput.value = defaultValue;
    numberInput.addEventListener("focusout", function(){
        if (!this.value) {
            this.value = 0;
            this.previousElementSibling.value = 0;
        }
    });
    numberInput.addEventListener("keypress", function(){isNumberKey(event)});
    numberInput.addEventListener("input", function(){
        if (parseFloat(this.previousElementSibling.min) <= this.value && this.value <= parseFloat(this.previousElementSibling.max))
            this.previousElementSibling.value = this.value;
        else
            this.value = this.previousElementSibling.value;
    });
    rangeLabel.append(rangeInput);
    rangeLabel.append(numberInput);
    return rangeLabel;
}
function createSelect(defaultValue, optionList) {
    var selectLabel = document.createElement("label");
    selectLabel.className = "selection";
    var select = document.createElement("select");
    optionList.forEach(element => {
        var option = document.createElement("option");
        option.innerText = element[0];
        option.value = element[1];
        select.append(option);
    });
    selectLabel.append(select);
    if (defaultValue) select.querySelector("option[value=" + defaultValue + "]").selected = "selected";
    return selectLabel;
}
window.addEventListener("load", function(){
    const data = [
        {
            "type": "bool",
            "title": "Window drop shadow",
            "variable": "decoration:drop-shadow",
            "default": true
        },
        {
            "type": "range",
            "title": "Gaps in",
            "variable": "general:gaps-in",
            "default": 5,
            "min": 0,
            "max": 20,
            "step": 1
        },
        {
            "type": "select",
            "title": "Layout",
            "variable": "general:layout",
            "default": "master",
            "options": [
                ["Dwindle", "dwindle"],
                ["Master", "master"]
            ]
        },
        {
            "type": "color",
            "title": "Shadow color",
            "variable": "decoration:col.shadow",
            "default": ["#AA00BB", 100]
        },
        {
            "type": "gradient",
            "title": "Active window border color",
            "variable": "col.active_border",
            "default": [
                ["#AABBCC", 100],
                ["#00FF39", 255],
                ["#2364AA", 200]
            ]
        }
    ];
    data.forEach(element => {
        var widgetDiv = this.document.createElement("div");
        widgetDiv.classList.add("form-widget");
        widgetDiv.classList.add(element["type"]);
        var textDiv = this.document.createElement("div");
        textDiv.id = "text";
        var textH1 = this.document.createElement("h1");
        textH1.innerText = element["title"];
        var textSmall = this.document.createElement("small");
        textSmall.innerText = element["variable"];
        textDiv.append(textH1);
        textDiv.append(textSmall);
        widgetDiv.append(textDiv);
        var actionDiv = this.document.createElement("div");
        actionDiv.id = "action";
        widgetDiv.append(actionDiv);

        switch (element["type"]) {
            case "bool":             
                actionDiv.append(createBoolSwitch(element["default"]));        
                break;
            case "range":
                actionDiv.append(createRange(element["default"], element["min"], element["max"], element["step"]));
                break;
            case "select":
                actionDiv.append(createSelect(element["default"], element["options"]));
                break;
            case "color":
                actionDiv.append(createColorPicker(false, element["default"][0], element["default"][1]));
                break;
            case "gradient":
                widgetDiv.classList.add("color")
                var resultElements = createGradient(element["default"]);
                actionDiv.append(resultElements[0], resultElements[1]);
        }

        
        document.getElementById("widget-container").append(widgetDiv);
    });
});
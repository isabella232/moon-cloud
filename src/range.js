const defaultParams = {
  blockName: "pricing-range",
  sessions: [10, 20, 50, 100, 500, 1000, "∞"],
  defaultSession: 50,
  defaultMonth: "6",
  months: [
    {
      title: "1 month",
      value: 1
    },
    {
      title: "2 months",
      value: 2
    },
    {
      title: "3 months",
      value: 3
    },
    {
      title: "6 months",
      value: 6
    },
    {
      title: "12 months",
      value: 12
    }
  ],
  price: 5,
  title: "Parallel Sessions"
};

class Range {
  constructor(selector, params = {}) {
    if (!selector) {
      throw new Error("No target element specified");
    }
    this.params = Object.assign({}, defaultParams, params);
    this.blockName = params.blockName;
    this.selector = selector;
    this.rangeContainer = null;
    this.months = this.params.months;
    this.values = this.params.sessions;
    this.month = this.params.defaultMonth;
    this.session = this.params.defaultSession;
    this.price = this.params.price;
    this.value = null;
    this.contactUsMode = false;

    this.valueItems = new Map();

    this.createRange();
    this.createValue();
    this.createDuration();

    this.setSession(this.session);

    this.setValue();
  }

  toggleContactUs(contactUsVisible = true) {
    if (contactUsVisible === this.contactUsMode) {
      return;
    }

    this.contactUsMode = contactUsVisible;

    if (contactUsVisible) {
      this.toggleContainer.classList.add("pricing-range__toggle-container_contact-us");
    } else {
      this.toggleContainer.classList.remove("pricing-range__toggle-container_contact-us");
    }
  }

  setValue() {
    if (this.session === "∞") {
      this.toggleContactUs();
      this.priceInput.value = "infinity";

      return;
    }

    this.toggleContactUs(false);
    this.value = this.price * Number(this.month) * this.session;
    if (this.odometer) {
      this.odometer.update(this.value);
    }

    this.priceInput.value = this.value;
  }

  createRange() {
    this.rangeContainer = this.selector.querySelector(".pricing-range__range");
    this.rangeSelect = this.selector.querySelector(".pricing-range__range-select");
    this.rangeLine = this.rangeContainer.querySelector(".pricing-range__range-line");
    this.toggleContainer = document.querySelector(".pricing-range__toggle-container");

    this.values.forEach((value) => {
      const valueMapItem = this.createRangeItem(value);
      this.valueItems.set(value, valueMapItem);

      this.rangeLine.appendChild(valueMapItem.container);
    });

    this.title = document.createElement("p");
    this.title.classList.add("range-item-container");
    this.title.classList.add("pricing-range__title");
    this.title.innerText = this.params.title;

    this.rangeLine.appendChild(this.title);

    this.createRangeSelect();
  }

  createRangeSelect() {
    this.rangeSelect = this.selector.querySelector(".pricing-range__range-select");

    this.values.forEach((value) => {
      const element = document.createElement("option");
      element.setAttribute("value", value);
      element.innerText = value;
      this.rangeSelect.appendChild(element);
    });

    this.rangeSelect.addEventListener("change", (event) => {
      const value = event.target.value;

      this.setSession(value);
      this.setValue();
    });

    this.setSession(this.session);
  }

  createDuration() {
    this.durationContainer = this.selector.querySelector(".pricing-range__duration");

    this.months.forEach((month) => {
      const element = document.createElement("option");
      element.setAttribute("value", month.value);
      element.innerText = month.title;
      this.durationContainer.appendChild(element);
    });

    this.durationContainer.addEventListener("change", (event) => {
      this.month = event.target.value;

      this.setDuration();

      this.setValue();
    });

    this.setDuration();
  }

  setDuration() {
    const options = this.durationContainer.options;

    for (let i = 0; i < options.length; i++) {
      if (options[i].value !== this.month) {
        options[i].removeAttribute("selected");
      } else {
        options[i].setAttribute("selected", "");
      }
    }
  }

  setSession(session) {
    this.session = session;

    for (const [key, item] of this.valueItems) {
      if (key === session) {
        item.container.classList.add("range-item-container_selected");
      } else {
        item.container.classList.remove("range-item-container_selected");
      }
    }

    const options = this.rangeSelect.options;

    for (let i = 0; i < options.length; i++) {
      if (options[i].value !== this.session.toString()) {
        options[i].removeAttribute("selected");
      } else {
        options[i].setAttribute("selected", "");
      }
    }
  }

  createRangeItem(value) {
    const item = document.createElement("div");
    const valueText = document.createElement("p");
    const circle = document.createElement("div");

    item.classList.add("range-item-container");

    valueText.innerText = value;

    item.appendChild(valueText);
    item.appendChild(circle);

    item.addEventListener("click", () => {

      this.setSession(value);
      this.setValue();
    });

    return {
      container: item,
      value: valueText,
      circle
    };
  }

  createValue() {
    this.valueContainer = document.getElementById("price-odometer");
    this.priceInput = document.getElementById("price-input");

    this.odometer = new window.Odometer({
      el: this.valueContainer,
      value: this.value,
      numberLength: 5,
      theme: "minimal",
      format: "(,ddddd)"
    });
  }
}

export default Range;

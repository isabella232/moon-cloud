const defaultParams = {
  blockName: "pricing-range",
  ranges: [
    {
      name: "sessions",
      title: "Parallel Sessions",
      values: [10, 20, 50, 100, 500, 1000],
      default: 50
    },
    {
      name: "hours",
      title: "Hours per week",
      values: [2, 4, 8, 16, 24, 40],
      default: 8
    }
  ],
  platforms: [
    {
      title: "Amazon Web Services",
      value: 1
    },
    {
      title: "Google Cloud",
      value: 2
    },
    {
      title: "Microsoft Azure",
      value: 3
    },
  ],
  defaultPlatform: 0,
  price: 5
};

class Range {
  constructor(selector, params = {}) {
    if (!selector) {
      throw new Error("No target element specified");
    }

    this.params = Object.assign({}, defaultParams, params);
    this.blockName = params.blockName;
    this.selector = selector;
    this.rangeContainer = selector.querySelector(".pricing-range__range-container");
    this.selectContainer = selector.querySelector(".pricing-range__selects");
    this.platforms = this.params.platforms;
    this.price = this.params.price;
    this.value = null;
    this.ranges = [];

    this.createRanges();
    this.createValue();
    this.createDuration();

    // this.setSession(this.session);

    this.setValue();
  }

  setValue() {
    // calculate value
    this.value = this.price * Number(this.month) * this.session;
    if (this.odometer) {
      this.odometer.update(this.value);
    }

    this.priceInput.value = this.value;
  }

  createRanges() {
    this.ranges = this.params.ranges.map((r) => this.createRange(r));
  }

  createRange(range) {
    const container = document.createElement("div");
    container.classList.add("d-none", "d-sm-block", "pricing-range__range");

    const line = document.createElement("div");
    line.classList.add("pricing-range__range-line");
    container.appendChild(line);

    const lol = document.createElement("div");
    lol.classList.add("lol");
    line.appendChild(lol);

    const items = new Map();
    const select = this.createRangeSelect(range);

    range.values.forEach((value) => {
      const valueMapItem = this.createRangeItem(value);
      items.set(value, valueMapItem);

      line.appendChild(valueMapItem.container);
    });

    this.title = document.createElement("p");
    this.title.classList.add("range-item-container");
    this.title.classList.add("pricing-range__title");
    this.title.innerText = range.title;

    line.appendChild(this.title);
    this.rangeContainer.appendChild(container);

    return {
      container,
      select,
      items,
      value: range.default,
      title: range.title
    };
  }

  createRangeSelect(range) {
    const label = document.createElement("label");
    label.classList.add("d-flex", "justify-content-between", "align-items-center", "d-sm-none", "pricing-range__range-label");

    const title = document.createElement("span");
    title.innerText = range.title + ": ";
    label.appendChild(title);

    const wrapper = document.createElement("span");
    wrapper.classList.add("select-wrapper");

    const select = document.createElement("select");
    select.classList.add("select", "pricing-range__range-select");

    wrapper.appendChild(select);
    label.appendChild(wrapper);

    this.selectContainer.appendChild(label);

    range.values.forEach((value) => {
      const element = document.createElement("option");
      element.setAttribute("value", value);
      element.innerText = value;
      select.appendChild(element);
    });

    select.addEventListener("change", (event) => {
      const value = event.target.value;

      this.setRange(select, value);
      this.setValue();
    });

    // this.setSession(this.session);

    return select;
  }

  createDuration() {
    this.durationContainer = this.selector.querySelector(".pricing-range__duration");

    this.platforms.forEach((month) => {
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

  setRange(range, value) {

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
      numberLength: 3,
      theme: "minimal",
      format: "(,ddd)"
    });
  }
}

export default Range;

const defaultParams = {
  blockName: "pricing-range",
  ranges: [
    {
      name: "sessions",
      title: "Parallel Sessions",
      values: [10, 20, 50, 100, 500, 1000],
      value: 50
    },
    {
      name: "hours",
      title: "Hours per week",
      values: [2, 4, 8, 16, 24, 40],
      value: 8
    }
  ],
  // price coefficient for platform
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
  defaultPlatform: 1,
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
    this.platform = this.params.defaultPlatform;
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
    const ranges = this.ranges.map((r) => r.value).reduce((acc, r) => acc * r);
    this.value = 1.25 * (170 + 0.192 * ranges * Number(this.platform));
    if (this.odometer) {
      this.odometer.update(this.value);
    }

    this.priceInput.value = this.value;
  }

  createRanges() {
    this.ranges = this.params.ranges.map(this.createRange, this);

    this.ranges.forEach((range) => {
      this.createRangeEventListener(range);
      this.setRange(range);
    });
  }

  setRanges() {
    this.ranges.forEach(this.setRange, this);
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
      const valueMapItem = this.createRangeItem(range, value);
      items.set(value, valueMapItem);

      line.appendChild(valueMapItem.container);
    });

    const title = document.createElement("p");
    title.classList.add("range-item-container");
    title.classList.add("pricing-range__title");
    title.innerText = range.title;

    line.appendChild(title);
    this.rangeContainer.appendChild(container);

    return {
      container,
      select,
      items,
      value: range.value,
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

    return select;
  }

  createRangeEventListener(range) {
    range.select.addEventListener("change", (event) => {
      this.setRange(range, event.target.value);
      this.setValue();
    });

    for (const [value, item] of range.items) {
      item.container.addEventListener("click", () => {
        this.setRange(range, value);
        this.setValue();
      });
    }
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
      this.platform = event.target.value;

      this.setDuration();
      this.setValue();
    });

    this.setDuration();
  }

  setDuration() {
    const options = this.durationContainer.options;

    for (let i = 0; i < options.length; i++) {
      if (options[i].value !== this.platform) {
        options[i].removeAttribute("selected");
      } else {
        options[i].setAttribute("selected", "");
      }
    }
  }

  setRange(range, value) {
    if (value) {
      range.value = value;
    }

    for (const [key, item] of range.items) {
      if (key === range.value) {
        item.container.classList.add("range-item-container_selected");
      } else {
        item.container.classList.remove("range-item-container_selected");
      }
    }

    const options = range.select.options;

    for (let i = 0; i < options.length; i++) {
      if (options[i].value !== range.value) {
        options[i].removeAttribute("selected");
      } else {
        options[i].setAttribute("selected", "");
      }
    }
  }

  createRangeItem(range, value) {
    const item = document.createElement("div");
    const valueText = document.createElement("p");
    const circle = document.createElement("div");

    item.classList.add("range-item-container");

    valueText.innerText = value;

    item.appendChild(valueText);
    item.appendChild(circle);

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

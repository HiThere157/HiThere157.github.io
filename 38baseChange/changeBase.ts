const inputNumberElement = document.getElementById("inputNumber") as HTMLInputElement;
const inputBaseElement = document.getElementById("inputBase") as HTMLSelectElement;
const outputNumberElement = document.getElementById("outputNumber") as HTMLInputElement;
const outputBaseElement = document.getElementById("outputBase") as HTMLSelectElement;

const toggleThemeElement = document.getElementById("toggleTheme") as HTMLButtonElement;
const reverseInputElement = document.getElementById("reverseInput");

class NumberBaseConverter {
  inputNumber: string;
  inputBase: number;

  constructor(inputNumber: string, inputBase: number) {
    this.inputNumber = inputNumber.toUpperCase();
    this.inputBase = inputBase;

    //remove leading zeros
    while (this.inputNumber.length > 1 && this.inputNumber[0] === "0") {
      this.inputNumber = this.inputNumber.slice(1);
    }
  }

  convertToBase(outputBase: number): string {
    return parseInt(this.inputNumber || "0", this.inputBase).toString(outputBase).toUpperCase();
  }

  isValid(): boolean {
    return (
      (this.inputNumber || "0") === this.convertToBase(this.inputBase) &&
      (parseInt(this.convertToBase(10)) <= Number.MAX_SAFE_INTEGER)
    );
  }

}

// Calculate the new output number based on new base and current number
function updateOutput() {
  let numberBaseConverter = new NumberBaseConverter(inputNumberElement!.value, parseInt(inputBaseElement!.value));
  let isValid = numberBaseConverter.isValid();

  outputNumberElement!.value = isValid ? numberBaseConverter.convertToBase(parseInt(outputBaseElement!.value)): "NaN";
  inputNumberElement!.value = numberBaseConverter.inputNumber;

  [inputNumberElement, outputNumberElement].forEach(element => {
    element!.classList.toggle("is-invalid", !isValid);
  });
}

// Toggle between light and dark theme
function toggleTheme() {
  let darkTheme = getComputedStyle(document.documentElement).getPropertyValue("--dark-theme").trim();

  document.documentElement.style.setProperty("--dark-theme", darkTheme === "1" ? "0" : "1");
  toggleThemeElement!.innerText = darkTheme === "1" ? "Dark Theme" : "Light Theme";
}

// Reverse input and output
function reverseInput() {
  inputNumberElement!.value = outputNumberElement!.value;
  [inputBaseElement!.value, outputBaseElement!.value] = [outputBaseElement!.value, inputBaseElement!.value];
  updateOutput();
}

window.onload = () => {
  inputNumberElement!.addEventListener("input", updateOutput);
  inputBaseElement!.addEventListener("change", updateOutput);
  outputBaseElement!.addEventListener("change", updateOutput);

  toggleThemeElement!.addEventListener("click", toggleTheme);
  reverseInputElement!.addEventListener("click", reverseInput);
};
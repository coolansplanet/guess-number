const theNumber = [];

const asList = new Intl.ListFormat("es-ES", {
  style: "long",
  type: "conjunction",
});

const digits = 4;

const generateNumber = () => {
  while (theNumber.length < digits) {
    const nextDigit = Math.floor(Math.random() * 10);
    !theNumber.includes(nextDigit) && theNumber.push(nextDigit);
  }
};

const validateNumber = (stringifiedNumber) => {
  /*
   The argument is a string instead of numbers because numbers starting with 0
   are considered octals instead of decimals. For instance: 0425 === 277
  */
  const validationFails = [];

  stringifiedNumber.includes(".") &&
    validationFails.push("NO debe tener decimales");

  stringifiedNumber.split(".")[0].length !== digits &&
    validationFails.push(`debe tener ${digits} dígitos`);

  for (let i = 0; i < stringifiedNumber.length; i++) {
    let breakLoop = false;
    for (let j = i + 1; j < stringifiedNumber.length; j++) {
      if (stringifiedNumber[i] === stringifiedNumber[j]) {
        validationFails.push("NO debe tener dígitos repetidos");
        breakLoop = true;
        break;
      }
    }
    if (breakLoop) {
      break;
    }
  }

  if (validationFails.length > 0) {
    throw new Error("El número " + asList.format(validationFails));
  }
};

const tryNumber = (stringifiedNumber) => {
  let b = 0;
  let r = 0;

  for (let index = 0; index < stringifiedNumber.length; index++) {
    const parsedDigit = parseInt(stringifiedNumber[index]);
    parsedDigit === theNumber[index]
      ? b++
      : theNumber.includes(parsedDigit) && r++;
  }
  return { b, r };
};

/////////////////////////////
const errorMessage = document.querySelector(".error-message");
const input = document.querySelector(".input");
const inputWrapper = document.querySelector(".input-wrapper");
const button = document.querySelector("button");

input.setAttribute("maxlength", digits);
input.focus();

const onInput = (e) => {
  input.value = e.target.value.replaceAll(/[^\d]/g, "");
  errorMessage.innerText = "";
  input.classList.remove("error");
  inputWrapper.classList.remove("error");
};

const onButtonClick = () => {
  const value = input.value;

  try {
    validateNumber(value);
    const result = tryNumber(value);

    const li = document.createElement("li");
    const span = document.createElement("span");
    span.classList.add("try-value");
    span.innerText = `${value}:`;
    li.appendChild(span);
    document.querySelector(".list").appendChild(li);
    window.scrollTo(0, document.body.scrollHeight);

    if (result.b === digits) {
      input.disabled = true;
      button.disabled = true;
      li.append("¡Ganaste!");
      li.classList.add("ganaste");
    } else {
      const resultList = [];
      result.b > 0 && resultList.push(`${result.b} bien`);
      result.r > 0 && resultList.push(`${result.r} regular`);
      const description =
        resultList.length === 0 ? "Todas mal" : asList.format(resultList);

      li.classList.add(`cercania-${result.b}`);

      li.append(description);

      input.value = "";
    }
  } catch (error) {
    errorMessage.innerText = error.message;
    input.classList.add("error");
    inputWrapper.classList.add("error");
  }
};

input.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    onButtonClick();
  } else {
    onInput(e);
  }
});

input.addEventListener("input", onInput);

button.addEventListener("click", onButtonClick);

generateNumber();

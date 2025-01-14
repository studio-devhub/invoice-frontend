export const numberToCurrency = function (
  amount: number,
  prefix?: string,
  decimalLength?: number,
  sectionLength: number = 3
) {
  let arr = amount.toString().split(".");
  let decimalValue = arr[1];

  if (decimalLength === undefined) {
    decimalLength = 0;
    if (amount % 1) {
      decimalLength = decimalValue.length > 2 ? 2 : decimalValue.length;
    }
  }

  let replace =
    "\\d(?=(\\d{" +
    (sectionLength || 3) +
    "})+" +
    (decimalLength > 0 ? "\\." : "$") +
    ")";
  let formattedAmount: string = amount
    .toFixed(Math.max(0, ~~decimalLength))
    .replace(new RegExp(replace, "g"), "$&,");

  if (decimalValue && decimalValue.length === 1)
    formattedAmount = formattedAmount + "0";
  if (prefix) {
    formattedAmount = prefix + "" + formattedAmount;
  }

  return formattedAmount;
};

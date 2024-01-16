//Url per connettersi al server
export const server_url = "https://fitofina.finalab.it";
export const versione = "3.0.0";
export const token = '3NOe4qpHm9BILrBQ9SGWBeE2HBBelvjthMareFsPupl61XF0zU07D8iJ43tQQgMmw3bsiCsOAp5fSlfUwXE9OOzLhd0Wn0cTPgbR';

export default {
      eurFormat: new Intl.NumberFormat("default", {
    style: "currency",
    currency: "EUR"
  }),
  numberFormatEUR: function(value) {
    return this.eurFormat.format(value);
  },
  roundTwoDecimal: function(n) {
    return Math.round((n + Number.EPSILON) * 100) / 100;
  },
    numToString: function(n, min = 2, max = 5) {
    return n.toLocaleString(undefined, {
      minimumFractionDigits: min,
      maximumFractionDigits: max
    });
  },
  intToString: function(n) {
    return n.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  },
}

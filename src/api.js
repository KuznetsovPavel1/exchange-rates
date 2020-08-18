import axios from "axios";

export const getUSD = async () => {
  try {
    const res = await axios.get(
      "https://api.exchangeratesapi.io/latest?base=USD&symbols=RUB"
    );

    return res.data?.rates?.RUB.toFixed(2);
  } catch (error) {
    console.log("getUSD", error);
    return null;
  }
};

export const getEUR = async () => {
  try {
    const res = await axios.get(
      "https://api.exchangeratesapi.io/latest?base=EUR&symbols=RUB"
    );

    return res.data?.rates?.RUB.toFixed(2);
  } catch (error) {
    console.log("getEUR", error);
    return null;
  }
};

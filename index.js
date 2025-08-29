// index.js
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ====== UPDATE THESE THREE CONSTANTS WITH YOUR REAL DETAILS ======
const FULL_NAME_LOWER = "john_doe";      // lowercase, underscores allowed
const DOB_DDMMYYYY    = "17091999";      // ddmmyyyy
const EMAIL           = "john@xyz.com";
const ROLL_NUMBER     = "ABCD123";
// ================================================================

const USER_ID = `${FULL_NAME_LOWER}_${DOB_DDMMYYYY}`;

const isNumericString = (s) => /^-?\d+$/.test(s);
const isAlphaString   = (s) => /^[A-Za-z]+$/.test(s);

function collectAllLetters(data) {
  const letters = [];
  for (const item of data) {
    const str = String(item);
    for (const ch of str) {
      if (/[A-Za-z]/.test(ch)) letters.push(ch);
    }
  }
  return letters;
}

function alternatingCaps(chars) {
  let out = "";
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    out += i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase();
  }
  return out;
}

function processData(data) {
  const even_numbers = [];
  const odd_numbers = [];
  const alphabets = [];
  const special_characters = [];
  let sum = 0;

  for (const raw of data) {
    const s = String(raw).trim();

    if (isAlphaString(s)) {
      alphabets.push(s.toUpperCase());
    } else if (isNumericString(s)) {
      const lastDigit = Math.abs(parseInt(s, 10)) % 10;
      if (lastDigit % 2 === 0) even_numbers.push(s);
      else odd_numbers.push(s);
      sum += parseInt(s, 10);
    } else {
      for (const ch of s) {
        if (!/[A-Za-z0-9]/.test(ch)) special_characters.push(ch);
      }
    }
  }

  const letters = collectAllLetters(data);
  letters.reverse();
  const concat_string = alternatingCaps(letters);

  return {
    even_numbers,
    odd_numbers,
    alphabets,
    special_characters,
    sum: String(sum),
    concat_string
  };
}

app.post("/bfhl", (req, res) => {
  try {
    const data = req.body?.data;
    if (!Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        user_id: USER_ID,
        email: EMAIL,
        roll_number: ROLL_NUMBER,
        message: "Invalid payload: expected { data: [...] }"
      });
    }

    const result = processData(data);

    return res.status(200).json({
      is_success: true,
      user_id: USER_ID,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers: result.odd_numbers,
      even_numbers: result.even_numbers,
      alphabets: result.alphabets,
      special_characters: result.special_characters,
      sum: result.sum,
      concat_string: result.concat_string
    });
  } catch (err) {
    return res.status(500).json({
      is_success: false,
      user_id: USER_ID,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      message: "Internal Server Error"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`BFHL API running on :${PORT}`));

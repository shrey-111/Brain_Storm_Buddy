const functions = require("firebase-functions");
const axios = require("axios");

exports.generateStudyPlan = functions.https.onRequest(async (req, res) => {
  const { syllabus, hoursPerDay } = req.body;

  const prompt = `I'm a student. My syllabus is: ${syllabus}. I can study ${hoursPerDay} hours per day. Create a 5-day study plan with breaks and topic rotation.`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_API_KEY_HERE`, 
        },
      }
    );

    res.send({ plan: response.data.choices[0].message.content });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send("Something went wrong");
  }
});

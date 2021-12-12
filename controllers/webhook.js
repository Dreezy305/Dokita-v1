require("dotenv").config({ path: "./.env" });

const webhook = async (req, res) => {
  try {
    const webhookURL = await req.body;
    console.log(webhookURL);
    return res.status(200).json({
      success: true,
      message: "webhook connected",
      data: webhookURL,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "something went wrong",
      data: error,
    });
  }
};

module.exports = { webhook };

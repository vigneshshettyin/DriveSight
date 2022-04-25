const Status = require("../db/schema/Status");
const axios = require("axios");
exports.listAll = async (req, res) => {
  try {
    const status = await Status.find();
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.create = async (req, res) => {
  try {
    const resp = await axios.get(process.env.DEVICE_API);
    if (!!resp.data) {
      const status = new Status({
        data: "Device API is working fine!",
        error_code: "200",
      });
      await status.save();
      return res.status(200).json({
        message: "Device API is working fine!",
      });
    }
  } catch (error) {
    const data = {
      data: error.message,
      error_code: 500,
    };
    const status = new Status(data);
    await status.save();
    res.status(500).json({
      message: error.message,
    });
  }
};

import { ApiResponse, asyncHandler } from "../utils/index.js";

const healthCheck = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, "Everything is OK."));
});

export default healthCheck;

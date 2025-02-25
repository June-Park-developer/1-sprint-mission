function asyncHandler(handler) {
  return async function (req, res, next) {
    try {
      await handler(req, res);
    } catch (err) {
      console.log("---asyncHandler에서 잡힘---");
      console.log(err);
      next(err);
    }
  };
}

export default asyncHandler;

import { Prisma } from "@prisma/client";

export default function errorHandler(err, req, res, next) {
  console.error("Error occured");
  console.log("---errorHandler에서 잡힘----");
  console.log(err);
  if (
    err.name === "StructError" ||
    err instanceof Prisma.PrismaClientValidationError
  ) {
    res.status(400).json({
      error: "BadRequest",
      message: "요청이 형식에 맞는지 확인하세요.",
    });
  } else if (err.code === "P2002") {
    res.status(409).json({
      error: "DataConflict",
      message: "DB와 충돌하였습니다. ",
    });
  } else if (err.name === "NotFoundError") {
    res.status(404).json({
      error: "NotFound",
      message: "해당 데이터는 존재하지 않습니다.",
    });
  } else {
    res.status(500).json({
      error: "ServerError",
      message: "서버에 문제가 있는 것 같습니다. ",
    });
  }
}

// if (
//   e.name === "StructError" ||
//   (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") ||
//   e instanceof Prisma.PrismaClientValidationError
// ) {
//   res.status(400).send({ message: e.message });
// } else if (
//   e instanceof Prisma.PrismaClientKnownRequestError &&
//   e.code === "P2025"
// ) {
//   res.status(404).send({ message: e.message });
// } else {
//   res.status(500).send({ message: e.message });
// }

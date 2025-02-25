import swaggerJsdoc from "swagger-jsdoc";

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "part1-박정은-sprint3",
      description:
        "이 프로젝트는 코드잇 Node js 스프린트의 세번째 미션으로 진행한 프로젝트입니다.",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};
export const specs = swaggerJsdoc(options);

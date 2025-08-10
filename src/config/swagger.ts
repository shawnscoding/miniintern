import { Express } from "express";
import swaggerUi from "swagger-ui-express";

export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "OpenKnowl API",
    version: "1.0.0",
    description: "클래스 신청 시스템 API 문서",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  paths: {
    "/api/users/signup": {
      post: {
        tags: ["User"],
        summary: "회원가입",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "user1234@example.com",
                  },
                  password: {
                    type: "string",
                    example: "password_1234",
                  },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "회원가입 성공",
          },
        },
      },
    },
    "/api/users/login": {
      post: {
        tags: ["User"],
        summary: "로그인",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "user1@example.com",
                  },
                  password: {
                    type: "string",
                    example: "password_1",
                  },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "로그인 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string" },
                    user: {
                      type: "object",
                      properties: {
                        id: { type: "number" },
                        email: { type: "string" },
                        isAdmin: { type: "boolean" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/users/applications": {
      get: {
        tags: ["User"],
        summary: "내 신청 목록 조회",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "pageNo",
            in: "query",
            schema: { type: "number", default: 1 },
            description: "페이지 번호",
          },
          {
            name: "pageSize",
            in: "query",
            schema: { type: "number", default: 20 },
            description: "페이지 크기",
          },
        ],
        responses: {
          200: {
            description: "신청 목록",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      createdAt: { type: "string", format: "date-time" },
                      title: { type: "string" },
                      mclassId: { type: "number" },
                      mclassCode: { type: "string" },
                      hostId: { type: "number" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/mclasses": {
      get: {
        tags: ["Classes"],
        summary: "클래스 목록 조회",
        parameters: [
          {
            name: "pageNo",
            in: "query",
            schema: { type: "number", default: 1 },
            description: "페이지 번호",
          },
          {
            name: "pageSize",
            in: "query",
            schema: { type: "number", default: 20 },
            description: "페이지 크기",
          },
        ],
        responses: {
          200: {
            description: "클래스 목록",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      mclassCode: { type: "string" },
                      title: { type: "string" },
                      maxParticipants: { type: "number" },
                      appliedParticipants: { type: "number" },
                      hostId: { type: "number" },
                      startAt: { type: "string", format: "date-time" },
                      endAt: { type: "string", format: "date-time" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Classes"],
        summary: "클래스 생성 (관리자만)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  mclassCode: { type: "string", example: "TE-05-01" },
                  title: { type: "string", example: "JavaScript 기초" },
                  description: {
                    type: "string",
                    example: "JavaScript 프로그래밍 기초를 배웁니다.",
                  },
                  maxApplicants: { type: "number", example: 30 },
                  startAt: {
                    type: "string",
                    format: "date-time",
                    example: "2025-08-05T00:00:00Z",
                  },
                  endAt: {
                    type: "string",
                    format: "date-time",
                    example: "2025-09-30T23:59:59Z",
                  },
                },
                required: [
                  "title",
                  "description",
                  "maxApplicants",
                  "startAt",
                  "endAt",
                ],
              },
            },
          },
        },
        responses: {
          201: {
            description: "클래스 생성 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/mclasses/{id}": {
      get: {
        tags: ["Classes"],
        summary: "클래스 상세 조회",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "number" },
            example: 1,
          },
        ],
        responses: {
          200: {
            description: "클래스 상세 정보",
          },
          404: {
            description: "클래스을 찾을 수 없음",
          },
        },
      },
      delete: {
        tags: ["Classes"],
        summary: "클래스 삭제 (관리자만)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "number" },
            example: 1,
          },
        ],
        responses: {
          204: {
            description: "클래스 삭제 성공",
          },
        },
      },
    },
    "/api/mclasses/{id}/apply": {
      post: {
        tags: ["Classes"],
        summary: "클래스 신청",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "number" },
            example: 1,
          },
        ],
        responses: {
          201: {
            description: "클래스 신청 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean" },
                  },
                },
              },
            },
          },
          409: {
            description: "이미 신청한 클래스이거나 모집인원이 가득참",
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

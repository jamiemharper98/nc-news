const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const { topicData, userData, articleData, commentData } = require("../db/data/test-data/index");

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

describe("incorrect path tests", () => {
  test("GET:400 /api/banana responds bad request when path not one created", () => {
    return request(app)
      .get("/api/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("GET:400 /apple/pie responds bad request when path not one created without api", () => {
    return request(app)
      .get("/apple/pie")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("/api/topics", () => {
  test("GET:200 /api/topics responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("/api", () =>
  test("GET:200 responds with object describing all the end points", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        for (const key in endpoints) {
          expect(typeof endpoints[key].description).toBe("string");
          if (key !== "GET /api") {
            expect(typeof endpoints[key].description).toBe("string");
            expect(typeof endpoints[key].queries).toBe("object");
            expect(Array.isArray(endpoints[key].queries)).toBe(true);
            expect(typeof endpoints[key].exampleResponse).toBe("object");
            expect(Array.isArray(endpoints[key].exampleResponse)).toBe(false);
          }
        }
      });
  }));

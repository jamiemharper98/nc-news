const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const { topicData, userData, articleData, commentData } = require("../db/data/test-data/index");
require("jest-sorted");

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

describe("/api/articles", () => {
  test("GET:200 responds with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
          expect(article.body).toBe(undefined);
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("GET:200 responds with article by its id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("GET:404 responds article ID not found", () => {
      return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article ID does not exist!");
        });
    });
    test("GET:400 responds Bad request -> id not a num", () => {
      return request(app)
        .get("/api/articles/banana")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });

  describe("PATCH", () => {
    test("PATCH:200 responds with the updated article based on how much the votes needs to change", () => {
      const voteChange = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/1")
        .send(voteChange)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 101,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("PATCH:200 responds with the updated article - should work for minus numbers", () => {
      const voteChange = { inc_votes: -10 };
      return request(app)
        .patch("/api/articles/1")
        .send(voteChange)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 90,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("PATCH:404 Article does not exists", () => {
      const voteChange = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/999")
        .send(voteChange)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article ID does not exist!");
        });
    });
    test("PATCH:400 bad request when no inc_votes tag", () => {
      const voteChange = { banana: 1 };
      return request(app)
        .patch("/api/articles/1")
        .send(voteChange)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("PATCH:400 bad request when no number passed into incvotes", () => {
      const voteChange = { inc_votes: "banana" };
      return request(app)
        .patch("/api/articles/1")
        .send(voteChange)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
});

describe("/api", () => {
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
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("GET:200 responds with array of comments for given article id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(11);
          expect(comments).toBeSortedBy("created_at");
          comments.forEach((comment) => {
            expect(comment.article_id).toBe(1);
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            });
          });
        });
    });
    test("GET:200 responds with empty array if article exists but no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(0);
          expect(comments).toMatchObject([]);
        });
    });
    test("GET:404 responds error message if article id does not exist", () => {
      return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article ID does not exist!");
        });
    });
    test("GET:400 responds with bad request if not number for id search", () => {
      return request(app)
        .get("/api/articles/banana/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });

  describe("POST", () => {
    test("POST:201 respond with posted comment when passed username and body", () => {
      const data = {
        username: "butter_bridge",
        body: "A comment by butter bridge",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(data)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toMatchObject({
            author: "butter_bridge",
            body: "A comment by butter bridge",
            article_id: 1,
            votes: 0,
            comment_id: 19,
            created_at: expect.any(String),
          });
        });
    });
    test("POST:404 Article id not found", () => {
      const data = {
        username: "butter_bridge",
        body: "A comment by butter bridge",
      };
      return request(app)
        .post("/api/articles/999/comments")
        .send(data)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article ID does not exist!");
        });
    });
    test("POST:404 username not found", () => {
      const data = {
        username: "banana_bridge",
        body: "A comment by butter bridge",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(data)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Username does not exist!");
        });
    });
    test("POST:400 responds with bad request if not number for id search", () => {
      const data = {
        username: "butter_bridge",
        body: "A comment by butter bridge",
      };
      return request(app)
        .post("/api/articles/banana/comments")
        .send(data)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("POST:400 responds with bad request username missing", () => {
      const data = {
        body: "A comment by butter bridge",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(data)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request - incomplete request body");
        });
    });
    test("POST:400 responds with bad request body missing", () => {
      const data = {
        username: "butter_bridge",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(data)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request - incomplete request body");
        });
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    test("GET:200 responds with array of user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          console.log(users);
          expect(users.length).toBe(4);
          users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });
});

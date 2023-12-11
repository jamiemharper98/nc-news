const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const { topicData, userData, articleData, commentData } = require("../db/data/test-data/index");
require("jest-sorted");

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

describe("incorrect path tests", () => {
  test("GET:200 /api/banana resonds with the api to show you how to use api", () => {
    return request(app)
      .get("/api/banana")
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
  test("GET:400 /apple/pie responds bad request when path not one created without api", () => {
    return request(app)
      .get("/apple/pie")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
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

describe("/api/topics", () => {
  describe("GET", () => {
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

  describe("POST", () => {
    test("POST:201 responds with a topic object with new topic", () => {
      const toSend = { slug: "butter", description: "home of butter bridge" };
      return request(app)
        .post("/api/topics")
        .send(toSend)
        .expect(201)
        .expect(({ body: { topic } }) => {
          expect(topic).toMatchObject({ ...toSend });
        });
    });
    test("POST:400 bad request if topic already exists", () => {
      const toSend = { slug: "mitch", description: "home of butter bridge" };
      return request(app)
        .post("/api/topics")
        .send(toSend)
        .expect(400)
        .expect(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("POST:400 bad request if topic missing", () => {
      const toSend = { description: "home of butter bridge" };
      return request(app)
        .post("/api/topics")
        .send(toSend)
        .expect(400)
        .expect(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("POST:400 bad request if description missing", () => {
      const toSend = { slug: "butter" };
      return request(app)
        .post("/api/topics")
        .send(toSend)
        .expect(400)
        .expect(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("POST:400 bad request if no empty request body", () => {
      const toSend = {};
      return request(app)
        .post("/api/topics")
        .send(toSend)
        .expect(400)
        .expect(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
});

describe("/api/articles", () => {
  describe("GET", () => {
    test("GET:200 responds with an array of article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles, total_count } }) => {
          expect(total_count).toBe(13);
          expect(articles.length).toBe(10);
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
    test("GET:200 responds with an array of article objects and can be filtered by topic total count should also reflect the filtering", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body: { articles, total_count } }) => {
          expect(total_count).toBe(12);
          expect(articles.length).toBe(10);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              author: expect.any(String),
              topic: "mitch",
              article_id: expect.any(Number),
              title: expect.any(String),
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
    test("GET:404 responds with topic doesnt exist", () => {
      return request(app)
        .get("/api/articles?topic=banana")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No articles found!");
        });
    });
    test("GET:200 responds with an array of article objects and can be sorted by topic", () => {
      return request(app)
        .get("/api/articles?sort_by=topic")
        .expect(200)
        .then(({ body: { articles, total_count } }) => {
          expect(total_count).toBe(13);
          expect(articles.length).toBe(10);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              author: expect.any(String),
              topic: expect.any(String),
              article_id: expect.any(Number),
              title: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
            expect(article.body).toBe(undefined);
          });
          expect(articles).toBeSortedBy("topic", { descending: true });
        });
    });
    test("GET:200 if given a sort_by that is not a column heading, default to created_at", () => {
      return request(app)
        .get("/api/articles?sort_by=banana")
        .expect(200)
        .then(({ body: { articles, total_count } }) => {
          expect(total_count).toBe(13);
          expect(articles.length).toBe(10);
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
    test("GET:200 responds with an array of article objects sorted ascending by created at", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body: { articles, total_count } }) => {
          expect(total_count).toBe(13);
          expect(articles.length).toBe(10);
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
          expect(articles).toBeSortedBy("created_at", { descending: false });
        });
    });
    test("GET:200 if order is not asc or desc than default to desc", () => {
      return request(app)
        .get("/api/articles?order=banana")
        .expect(200)
        .then(({ body: { articles, total_count } }) => {
          expect(total_count).toBe(13);
          expect(articles.length).toBe(10);
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
    test("GET:200 if limit is 5 return 5", () => {
      return request(app)
        .get("/api/articles?limit=5")
        .expect(200)
        .then(({ body: { articles, total_count } }) => {
          expect(total_count).toBe(13);
          expect(articles.length).toBe(5);
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
    test("GET:400 bad request if limit not number", () => {
      return request(app)
        .get("/api/articles?limit=banana")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("GET:200 if page is 2 return second page sorting by article id to ensure we get second page", () => {
      return request(app)
        .get("/api/articles?p=2&sort_by=article_id&order=asc")
        .expect(200)
        .then(({ body: { articles, total_count } }) => {
          expect(total_count).toBe(13);
          let first = 11;
          expect(articles.length).toBe(3);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: first,
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
            expect(article.body).toBe(undefined);
            first++;
          });
          expect(articles).toBeSortedBy("article_id", { descending: false });
        });
    });
    test("GET:400 bad request if page not number", () => {
      return request(app)
        .get("/api/articles?p=banana")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });

  describe("POST", () => {
    test("POST:201 responds with the new article with added info - no img will default", () => {
      const toSend = {
        author: "butter_bridge",
        title: "butterboy",
        body: "butter bridge is the most buttery",
        topic: "mitch",
      };
      return request(app)
        .post("/api/articles")
        .send(toSend)
        .expect(201)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            author: "butter_bridge",
            title: "butterboy",
            body: "butter bridge is the most buttery",
            topic: "mitch",
            article_img_url: "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
            article_id: 14,
            votes: 0,
            created_at: expect.any(String),
            comment_count: 0,
          });
        });
    });
    test("POST:201 responds with the new article with added info with img", () => {
      const toSend = {
        author: "butter_bridge",
        title: "butterboy",
        body: "butter bridge is the most buttery",
        topic: "mitch",
        article_img_url: "imgpathforbutterbridge",
      };
      return request(app)
        .post("/api/articles")
        .send(toSend)
        .expect(201)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            author: "butter_bridge",
            title: "butterboy",
            body: "butter bridge is the most buttery",
            topic: "mitch",
            article_img_url: "imgpathforbutterbridge",
            article_id: 14,
            votes: 0,
            created_at: expect.any(String),
            comment_count: 0,
          });
        });
    });
    test("POST:400 if any of required properties missing return bad request", () => {
      const toSend = {
        author: "butter_bridge",
        body: "butter bridge is the most buttery",
        topic: "butter",
      };
      return request(app)
        .post("/api/articles")
        .send(toSend)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request - invalid request body");
        });
    });
    test("POST:404 if username does not exist", () => {
      const toSend = {
        author: "banana",
        title: "butterboy",
        body: "butter bridge is the most buttery",
        topic: "butter",
      };
      return request(app)
        .post("/api/articles")
        .send(toSend)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Username does not exist!");
        });
    });
    test("POST:400 cant create an article for a topic that does not yet exist", () => {
      const toSend = {
        author: "butter_bridge",
        title: "butterboy",
        body: "butter bridge is the most buttery",
        topic: "butter",
      };
      return request(app)
        .post("/api/articles")
        .send(toSend)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
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
            comment_count: 11,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("GET:200 responds with article by its id even if no comment count", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            title: "Sony Vaio; or, The Laptop",
            topic: "mitch",
            author: "icellusedkars",
            body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
            created_at: expect.any(String),
            comment_count: 0,
            article_id: 2,
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

  describe("DELETE", () => {
    test("DELETE:204 responds 204 if deleted", () => {
      return request(app)
        .delete("/api/articles/1")
        .expect(204)
        .then(({ body }) => {
          expect(body).toMatchObject({});
        });
    });
    test("DELETE:204 should delete relatvant comments ", () => {
      return request(app)
        .delete("/api/articles/1")
        .expect(204)
        .then(() => {
          return request(app).get("/api/comments").expect(200);
        })
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(7);
        });
    });
    test("DELETE:400 bad request if id not a number", () => {
      return request(app)
        .delete("/api/articles/banana")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("DELETE:404 article does not exist", () => {
      return request(app)
        .delete("/api/articles/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article ID does not exist!");
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("GET:200 responds with array of comments for given article id default limit 10", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(10);
          expect(comments).toBeSortedBy("created_at", { descending: true });
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
    test("GET:200 responds with array of comments for given limit of 5", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=5")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(5);
          expect(comments).toBeSortedBy("created_at", { descending: true });
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
    test("GET:400 responds bad request if limit not number", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=banana")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("GET:400 responds bad request if p not number", () => {
      return request(app)
        .get("/api/articles/1/comments?p=banana")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    // test("GET:200 responds with array of comments for given limit of 5 second page", () => {
    //   const expectedDates = [
    //     "2020-10-31T03:03:00.000Z",
    //     "2020-07-21T00:20:00.000Z",
    //     "2020-06-15T10:25:00.000Z",
    //     "2020-05-15T20:19:00.000Z",
    //     "2020-04-14T20:19:00.000Z",
    //   ];
    //   return request(app)
    //     .get("/api/articles/1/comments?limit=5&p=2")
    //     .expect(200)
    //     .then(({ body: { comments } }) => {
    //       expect(comments.length).toBe(5);
    //       expect(comments).toBeSortedBy("created_at", { descending: true });
    //       comments.forEach((comment) => {
    //         expect(comment.article_id).toBe(1);
    //         expect(expectedDates.includes(comment.created_at)).toBe(true);
    //         expect(comment).toMatchObject({
    //           comment_id: expect.any(Number),
    //           votes: expect.any(Number),
    //           author: expect.any(String),
    //           body: expect.any(String),
    //         });
    //       });
    //     });
    // });
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

describe("/api/comments/:comment_id", () => {
  describe("DELETE", () => {
    test("DELETE:204 should return no content", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(({ body }) => {
          expect(body).toMatchObject({});
        });
    });
    test("DELETE:404 Comment not found", () => {
      return request(app)
        .delete("/api/comments/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Comment does not exist!");
        });
    });
    test("DELETE:400 bad request if id not a number", () => {
      return request(app)
        .delete("/api/comments/banana")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
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

describe("/api/users/:username", () => {
  describe("GET", () => {
    test("GET:200 responds with a user object", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).toMatchObject({
            username: "butter_bridge",
            name: "jonny",
            avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          });
        });
    });
    test("GET:404 User does not exist", () => {
      return request(app)
        .get("/api/users/banana")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Username does not exist!");
        });
    });
  });

  describe("PATCH", () => {
    test("PATCH:200 responds with updated comment positive votes", () => {
      const toSend = { inc_votes: 1 };
      return request(app)
        .patch("/api/comments/1")
        .send(toSend)
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment).toMatchObject({
            comment_id: 1,
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            votes: 17,
            author: "butter_bridge",
            article_id: 9,
            created_at: expect.any(String),
          });
        });
    });
    test("PATCH:200 responds with updated comment negative votes", () => {
      const toSend = { inc_votes: -1 };
      return request(app)
        .patch("/api/comments/1")
        .send(toSend)
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment).toMatchObject({
            comment_id: 1,
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            votes: 15,
            author: "butter_bridge",
            article_id: 9,
            created_at: expect.any(String),
          });
        });
    });
    test("PATCH:404 Comment does not exist", () => {
      const toSend = { inc_votes: 1 };
      return request(app)
        .patch("/api/comments/999")
        .send(toSend)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Comment does not exist!");
        });
    });
    test("PATCH:400 Bad request no inc_votes", () => {
      const toSend = { banana: 1 };
      return request(app)
        .patch("/api/comments/1")
        .send(toSend)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("PATCH:400 Bad request inc_votes not a number", () => {
      const toSend = { inc_votes: "banana" };
      return request(app)
        .patch("/api/comments/1")
        .send(toSend)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
});

describe("/api/comments", () => {
  describe("GET", () => {
    test("GET:200 responds with a list of all comments", () => {
      return request(app)
        .get("/api/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(18);
          comments.forEach((comment) => {
            expect(comment).toMatchObject({
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              article_id: expect.any(Number),
              created_at: expect.any(String),
              comment_id: expect.any(Number),
            });
          });
        });
    });
  });
});

const articleButton = document.querySelector(".to-articles");
const apiContent = document.querySelectorAll(".api-content");
const header = document.querySelector(".header");
const subheader = document.querySelector(".subheader");
const main = document.querySelector(".content");
let curPage = "api";

articleButton.addEventListener("click", displayArticles);

function displayArticles(e) {
  if (curPage == "articles") {
    returnToApi(document.querySelectorAll(".article-content"));
  } else {
    curPage = "articles";
    apiContent.forEach((node) => {
      node.classList.toggle("invisible");
    });
    fetch("https://nc-news-api-cu9g.onrender.com/api/articles", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((res) => {
        let htmlString = "";
        res.articles.forEach((article) => {
          htmlString += `
        <div class="main-content article-content">
        <h3>${article.title}</h3>
        <dl>
          <dt>Topic</dt>
          <dd>- ${article.topic}</dd>
          <dt>Author</dt>
          <dd>- ${article.author}</dd>
          <dt>Created at</dt>
          <dd>- ${createDate(article.created_at)}</dd>
          <p> Votes : ${article.votes}       Comment count : ${article.comment_count}</p>
          <img src="${article.article_img_url}">
        </dl>
      </div>`;
        });
        main.insertAdjacentHTML("beforeend", htmlString);
        header.innerHTML = "Articles";
        subheader.innerHTML = `Showing ${res.articles.length} out of ${res.total_count}`;
      });
  }
}

function returnToApi(previous) {
  curPage = "api";
  header.innerHTML = "Documentation for news API";
  subheader.innerHTML = `This page contains all of the avaliable endpoints on this API`;
  previous.forEach((article) => {
    article.remove();
  });
  apiContent.forEach((node) => {
    node.classList.toggle("invisible");
  });
}

function createDate(date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(Date.parse(date2) - Date.parse(date1)) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return `${daysPassed} days ago on ${new Date(date).toLocaleDateString()}`;
}

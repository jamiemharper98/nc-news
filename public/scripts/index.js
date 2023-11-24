const articleButton = document.querySelector(".to-articles");
const apiContent = document.querySelectorAll(".api-content");
const header = document.querySelector(".header");
const subheader = document.querySelector(".subheader");
const main = document.querySelector(".content");

articleButton.addEventListener("click", function (e) {
  apiContent.forEach((node) => {
    node.classList.toggle("invisible");
  });
  fetch("http://localhost:9090/api/articles", {
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
          <dd>- ${article.created_at}</dd>
          <p> Votes : ${article.votes}       Comment count : ${article.comment_count}</p>
          <img src="${article.article_img_url}">
        </dl>
      </div>`;
      });
      main.insertAdjacentHTML("beforeend", htmlString);
      header.innerHTML = "Articles";
      subheader.innerHTML = `Showing ${res.articles.length} out of ${res.total_count}`;
    });
});

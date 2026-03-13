import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

const storageKey = "tweetsData";
let tweetsDatabase =
  JSON.parse(localStorage.getItem(storageKey)) || structuredClone(tweetsData);

document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  } else if (e.target.dataset.replybtn) {
    handleReplyBtnClick(e.target.dataset.replybtn);
  } else if (e.target.dataset.trash) {
    handleTrashClick(e.target.dataset.trash);
  }
});

function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsDatabase.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  render();
}

function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsDatabase.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  } else {
    targetTweetObj.retweets++;
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  render();
}

function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");

  if (tweetInput.value) {
    tweetsDatabase.unshift({
      handle: `@Scrimba`,
      profilePic: `images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });
    render();
    tweetInput.value = "";
  }
}

function handleReplyBtnClick(tweetId) {
  const targetTweetObj = tweetsDatabase.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  targetTweetObj.replies.push({
    handle: "@Scrimba",
    profilePic: "images/scrimbalogo.png",
    tweetText: document.getElementById(`userreply-${targetTweetObj.uuid}`)
      .value,
  });
  render();
  handleReplyClick(tweetId);
}

function handleTrashClick(tweetId) {
  tweetsDatabase.splice(
    tweetsDatabase.indexOf(
      tweetsDatabase.filter(function (tweet) {
        return tweet.uuid === tweetId;
      })[0],
    ),
    1,
  );
  render();
}

function getFeedHtml() {
  let feedHtml = ``;

  tweetsDatabase.forEach(function (tweet) {
    let likeIconClass = "";

    if (tweet.isLiked) {
      likeIconClass = "liked";
    }

    let retweetIconClass = "";

    if (tweet.isRetweeted) {
      retweetIconClass = "retweeted";
    }

    let repliesHtml = "";

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`;
      });
    }

    repliesHtml += `<div class="user-reply">
                        <img src="images/scrimbalogo.png" class="profile-pic">
                        <div class="reply-text-send">
                            <textarea class="reply-textarea" id="userreply-${tweet.uuid}"></textarea>
                            <button class="reply-btn" data-replybtn="${tweet.uuid}">Send Reply</button>
                            </div>
                    </div>`;

    let trashHtml = ``;

    if (tweet.handle === "@Scrimba") {
      trashHtml = ` <span class="trash-btn">
                        <i class="fa-solid fa-trash-can" data-trash="${tweet.uuid}"></i>
                    </span>`;
    }

    feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-options">
                <div class="tweet-details">
                    <span class="tweet-detail">
                        <i class="fa-regular fa-comment-dots"
                        data-reply="${tweet.uuid}"
                        ></i>
                        ${tweet.replies.length}
                    </span>
                    <span class="tweet-detail">
                        <i class="fa-solid fa-heart ${likeIconClass}"
                        data-like="${tweet.uuid}"
                        ></i>
                        ${tweet.likes}
                    </span>
                    <span class="tweet-detail">
                        <i class="fa-solid fa-retweet ${retweetIconClass}"
                        data-retweet="${tweet.uuid}"
                        ></i>
                        ${tweet.retweets}
                    </span>
                </div>
                ${trashHtml}
            </div>
        </div>
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>
</div>
`;
  });
  return feedHtml;
}

function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
  localStorage.setItem(storageKey, JSON.stringify(tweetsDatabase));
}

render();

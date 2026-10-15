import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/*

* TIVA FRONTEND
* 
* IMPORTANT:
* Replace the two Supabase placeholders below with your
* actual project URL and publishable/anon key.
* 
* NEVER put your Supabase service-role key or payment
* secret keys in this public file.
  */

const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY";

/*

* Leave this as a placeholder until your backend is hosted.
* Later, replace it with your actual Render API URL.
  */
  const API_BASE_URL = "https://tiva-api.onrender.com";

let supabase = null;
let currentUser = null;
let currentProfile = null;
let isRegisterMode = false;

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);

function setMessage(selector, message, isError = false) {
const element = $(selector);

if (!element) return;

element.textContent = message;
element.style.color = isError ? "#ff758f" : "#27d9f5";
}

function showElement(selector) {
const element = $(selector);

if (element) element.classList.remove("hidden");
}

function hideElement(selector) {
const element = $(selector);

if (element) element.classList.add("hidden");
}

function configurationIsReady() {
return (
SUPABASE_URL.startsWith("https://") &&
!SUPABASE_URL.includes("YOUR_SUPABASE") &&
SUPABASE_ANON_KEY.length > 20 &&
!SUPABASE_ANON_KEY.includes("YOUR_SUPABASE")
);
}

function backendIsReady() {
return (
API_BASE_URL.startsWith("https://") &&
!API_BASE_URL.includes("YOUR_RENDER")
);
}

function showLoginScreen(message = "") {
hideElement("#loading-screen");
hideElement("#app");
showElement("#auth-screen");

setMessage("#auth-message", message);
}

function showDashboard() {
hideElement("#loading-screen");
hideElement("#auth-screen");
showElement("#app");

navigateTo("home");
}

function navigateTo(page) {
const target = document.querySelector("#page-${page}");

if (!target) return;

$$(".page").forEach((section) => {
section.classList.add("hidden");
});

target.classList.remove("hidden");

$$(".nav-item").forEach((button) => {
button.classList.toggle(
"active",
button.dataset.page === page
);
});

$$(".mobile-nav-item").forEach((button) => {
button.classList.toggle(
"active",
button.dataset.page === page
);
});

if (page === "profile") {
loadMyProfile();
}

if (page === "wallet") {
loadMyWallet();
}

if (page === "home") {
loadFeed();
}

window.scrollTo({
top: 0,
behavior: "smooth"
});
}

function updateUserInterface(user, profile = null) {
currentUser = user;
currentProfile = profile;

const metadata = user?.user_metadata || {};

const displayName =
profile?.display_name ||
metadata.display_name ||
user?.email?.split("@")[0] ||
"TIVA Member";

const username =
profile?.username ||
"member";

const avatarLetter =
displayName.trim().charAt(0).toUpperCase() || "T";

$("#sidebar-name").textContent = displayName;
$("#sidebar-username").textContent = "@${username}";

$("#header-avatar").textContent = avatarLetter;
$("#sidebar-avatar").textContent = avatarLetter;
$("#profile-avatar").textContent = avatarLetter;

$("#profile-display-name").textContent = displayName;
$("#profile-username").textContent = "@${username}";

$("#profile-bio").textContent =
profile?.bio || "Welcome to my TIVA profile.";
}

async function loadMyProfile() {
if (!supabase || !currentUser) return;

try {
const { data, error } = await supabase
.from("profiles")
.select(
"id, username, display_name, avatar_url, country, bio, created_at"
)
.eq("id", currentUser.id)
.maybeSingle();

if (error) throw error;

if (data) {
  updateUserInterface(currentUser, data);
}

} catch (error) {
console.error("TIVA profile loading error:", error);
}
}

async function loadMyWallet() {
if (!currentUser) return;

if (!backendIsReady()) {
setMessage(
"#post-message",
""
);

console.info(
  "TIVA wallet will load after the backend URL is configured."
);

return;

}

try {
const sessionResult = await supabase.auth.getSession();

const token =
  sessionResult.data.session?.access_token;

if (!token) return;

const response = await fetch(
  `${API_BASE_URL}/api/wallet`,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

if (!response.ok) {
  throw new Error("Wallet could not be loaded.");
}

const result = await response.json();

/*
 * The exact response structure must match the backend.
 * Adjust these field paths if the backend returns a
 * different response shape.
 */
const wallet = result.wallet || result;

const coins = Number(wallet.coin_balance || 0);

const earnings = Number(
  wallet.creator_earnings || 0
);

$("#coin-balance").textContent =
  coins.toLocaleString("en-US");

$("#mini-coin-balance").textContent =
  coins.toLocaleString("en-US");

$("#creator-earnings").textContent =
  `$${earnings.toFixed(2)}`;

} catch (error) {
console.error("TIVA wallet loading error:", error);
}
}

async function loadFeed() {
const feed = $("#feed-list");

if (!feed) return;

if (!supabase || !currentUser) return;

if (!backendIsReady()) {
feed.innerHTML = "<div class="empty-state"> <div class="empty-icon">✦</div> <h3>Your TIVA feed is ready for connection</h3> <p> Configure the backend URL to load posts from the TIVA API. </p> </div>";

return;

}

feed.innerHTML = "<div class="empty-state"> <p>Loading your feed...</p> </div>";

try {
const { data } = await supabase.auth.getSession();

const token = data.session?.access_token;

if (!token) return;

const response = await fetch(
  `${API_BASE_URL}/api/posts`,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

if (!response.ok) {
  throw new Error("Could not load posts.");
}

const result = await response.json();

const posts = Array.isArray(result)
  ? result
  : result.posts || [];

renderFeed(posts);

} catch (error) {
console.error("TIVA feed loading error:", error);

feed.innerHTML = `
  <div class="empty-state">
    <h3>Feed temporarily unavailable</h3>
    <p>
      Check the backend connection and try again.
    </p>
  </div>
`;

}
}

function renderFeed(posts) {
const feed = $("#feed-list");

feed.replaceChildren();

if (!posts.length) {
feed.innerHTML = "<div class="empty-state"> <div class="empty-icon">✦</div> <h3>No posts yet</h3> <p>Be the first to share something on TIVA.</p> </div>";

return;

}

posts.forEach((post) => {
const article = document.createElement("article");

article.className = "feed-post";

const header = document.createElement("div");
header.className = "feed-post-header";

const avatar = document.createElement("div");
avatar.className = "avatar";
avatar.textContent = "T";

const author = document.createElement("div");
author.className = "feed-post-author";

const authorName = document.createElement("strong");

authorName.textContent =
  post.profiles?.display_name ||
  "TIVA Member";

const date = document.createElement("span");

date.textContent = post.created_at
  ? new Date(post.created_at).toLocaleString()
  : "";

author.append(authorName, date);
header.append(avatar, author);

const content = document.createElement("p");

content.className = "feed-post-content";

/*
 * Use textContent to prevent post text from being
 * interpreted as HTML.
 */
content.textContent = post.content || "";

article.append(header, content);

feed.append(article);

});
}

function setRegistrationMode(enabled) {
isRegisterMode = enabled;

const title = $("#auth-title");
const description = $("#auth-description");
const submitButton = $("#login-form button[type='submit']");
const password = $("#login-password");
const switchButton = $("#show-register");

if (enabled) {
title.textContent = "Create your TIVA account";

description.textContent =
  "Join the global community and start connecting.";

submitButton.textContent = "Create Account";

password.autocomplete = "new-password";

switchButton.textContent = "Already have an account? Log in";

} else {
title.textContent = "Welcome to TIVA";

description.textContent =
  "Connect with people around the world.";

submitButton.textContent = "Log In";

password.autocomplete = "current-password";

switchButton.textContent = "Create account";

}

setMessage("#auth-message", "");
}

async function handleAuthentication(event) {
event.preventDefault();

if (!supabase) {
setMessage(
"#auth-message",
"Supabase is not configured yet. Add your project URL and public key in app.js.",
true
);

return;

}

const email = $("#login-email").value.trim();

const password = $("#login-password").value;

const submitButton =
$("#login-form button[type='submit']");

submitButton.disabled = true;

setMessage(
"#auth-message",
isRegisterMode
? "Creating your account..."
: "Signing you in..."
);

try {
if (isRegisterMode) {
const { data, error } = await supabase.auth.signUp({
email,
password,
options: {
data: {
display_name: email.split("@")[0]
}
}
});

  if (error) throw error;

  if (data.session && data.user) {
    await finishLogin(data.user);

  } else {
    setMessage(
      "#auth-message",
      "Registration submitted. Check your email to verify your account before logging in."
    );

    setRegistrationMode(false);
  }

} else {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password
    });

  if (error) throw error;

  if (data.user) {
    await finishLogin(data.user);
  }
}

} catch (error) {
console.error("TIVA authentication error:", error);

setMessage(
  "#auth-message",
  error.message || "Authentication failed. Please try again.",
  true
);

} finally {
submitButton.disabled = false;
}
}

async function finishLogin(user) {
currentUser = user;

await loadMyProfile();

showDashboard();

await loadMyWallet();

await loadFeed();
}

async function handleGoogleLogin() {
if (!supabase) {
setMessage(
"#auth-message",
"Configure Supabase before enabling Google login.",
true
);

return;

}

try {
const { error } = await supabase.auth.signInWithOAuth({
provider: "google",
options: {
redirectTo: window.location.origin
}
});

if (error) throw error;

} catch (error) {
console.error("TIVA Google login error:", error);

setMessage(
  "#auth-message",
  "Google login could not start. Check your Supabase Google provider settings.",
  true
);

}
}

async function handleLogout() {
if (!supabase) return;

const confirmed = window.confirm(
"Are you sure you want to log out of TIVA?"
);

if (!confirmed) return;

const { error } = await supabase.auth.signOut();

if (error) {
console.error("TIVA logout error:", error);

window.alert("Could not log out. Please try again.");

return;

}

currentUser = null;
currentProfile = null;

showLoginScreen("You have logged out successfully.");
}

function setupNavigation() {
document.addEventListener("click", (event) => {
const pageButton = event.target.closest("[data-page]");

if (pageButton) {
  event.preventDefault();

  navigateTo(pageButton.dataset.page);

  return;
}

const walletButton =
  event.target.closest("[data-wallet-action]");

if (walletButton) {
  window.alert(
    "Wallet purchases and earnings will be enabled after secure backend payment integration."
  );

  return;
}

if (event.target.closest("#profile-menu-button")) {
  if (
    window.confirm(
      "Would you like to log out of TIVA?"
    )
  ) {
    handleLogout();
  }
}

});

$("#refresh-feed")?.addEventListener(
"click",
loadFeed
);
}

function setupPostComposer() {
$("#post-form")?.addEventListener(
"submit",
async (event) => {
event.preventDefault();

  if (!currentUser) {
    setMessage(
      "#post-message",
      "Please log in to create a post.",
      true
    );

    return;
  }

  const content = $("#post-content").value.trim();

  const audience = $("#post-audience").value;

  if (!content) {
    setMessage(
      "#post-message",
      "Write something before publishing.",
      true
    );

    return;
  }

  if (!backendIsReady()) {
    setMessage(
      "#post-message",
      "Your post composer is ready, but the backend URL must be configured before publishing."
    );

    return;
  }

  try {
    const { data } = await supabase.auth.getSession();

    const token = data.session?.access_token;

    if (!token) {
      throw new Error("Please log in again.");
    }

    const response = await fetch(
      `${API_BASE_URL}/api/posts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          content,
          audience
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error || "Publishing is not available yet."
      );
    }

    $("#post-content").value = "";

    setMessage(
      "#post-message",
      "Your post was published."
    );

    await loadFeed();

  } catch (error) {
    console.error("TIVA post error:", error);

    setMessage(
      "#post-message",
      error.message ||
        "Could not publish your post.",
      true
    );
  }
}

);
}

async function initializeTIVA() {
setupNavigation();
setupPostComposer();

$("#login-form")?.addEventListener(
"submit",
handleAuthentication
);

$("#show-register")?.addEventListener(
"click",
() => {
setRegistrationMode(!isRegisterMode);
}
);

$("#google-login")?.addEventListener(
"click",
handleGoogleLogin
);

if (!configurationIsReady()) {
showLoginScreen(
"TIVA's Supabase connection needs to be configured."
);

console.info(
  "TIVA: add your Supabase project URL and publishable/anon key to public/app.js."
);

return;

}

supabase = createClient(
SUPABASE_URL,
SUPABASE_ANON_KEY
);

const { data, error } = await supabase.auth.getSession();

if (error) {
console.error("TIVA session error:", error);

showLoginScreen(
  "Could not check your login session. Please try again."
);

return;

}

if (data.session?.user) {
await finishLogin(data.session.user);

} else {
showLoginScreen();
}

supabase.auth.onAuthStateChange(
async (event, session) => {
if (event === "SIGNED_OUT" || !session) {
currentUser = null;
currentProfile = null;

    showLoginScreen();

    return;
  }

  if (
    event === "SIGNED_IN" &&
    session.user &&
    currentUser?.id !== session.user.id
  ) {
    await finishLogin(session.user);
  }
}

);
}

initializeTIVA();
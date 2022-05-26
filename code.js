const params = new URLSearchParams(window.location.search);

let urls = [];
let order = [];
let rkey = [];

function init() {
  console.log("INIT");
  console.log("----------------");


  urls = params.get("urls")?.split(",").filter(u => u).map((url) => {
    if (url.startsWith("https://media.discordapp.net/attachments/") || url.startsWith("https://cdn.discordapp.com/attachments/")) {
      return url.split("?width=")[0].split("?height=")[0];
    } else {
      return url;
    }
  });
  if (!urls) urls = [];
  addUrlToUrlsLocalStoragePls(urls);

  console.log("urls");
  console.log(urls);

  let order = params.get("order")?.split(",").filter(u => u);
  if (!order || order.length < 24) {
    updateOrderPls();
  }

  console.log("order");
  console.log(order);


  let rkey = params.get("rkey")?.split(",").filter(u => u);
  if (!rkey || rkey.length < 24) {
    updateRKeyPls();
  }

  console.log("rkey");
  console.log(rkey);


  // UPDATE ASIDE
  document.getElementById("order").value = order?.join(",");
  document.getElementById("randoms").value = rkey?.join(",");
  let local_urls = JSON.parse(localStorage.getItem("urls", urls));
  if (!local_urls) local_urls = [];
  local_urls.forEach((url, i) => {
    let li = document.createElement("li");
    let check = document.createElement("input");
    let label = document.createElement("label");
    let delete_button = document.createElement("button");

    check.type = "checkbox";
    check.id = "url_" + i;
    check.url = url;
    check.onchange = function (e) {
      if (e.target.checked) {
        addUrlsToUrlPls(e.target.url);
      } else {
        urls = urls.filter(url => url != e.target.url);
        params.set("urls", urls.join(","));
        updateOrderPls();
        updateRKeyPls();
        window.location.search = params;
      }
    }
    if (urls.includes(url)) {
      check.checked = true;
    } else {
      check.checked = false;
    }
    label.htmlFor = "url_" + i;

    delete_button.innerHTML = "Delete";
    delete_button.onclick = function (e) {
      let local_urls = JSON.parse(localStorage.getItem("urls", urls));
      local_urls[e.target.index] = "";
      local_urls.filter(u => u);
      localStorage.setItem("urls", JSON.stringify(local_urls));
      let temp_urls = urls.filter(url => url != e.target.url);
      params.set("urls", temp_urls.join(","));
      updateOrderPls();
      updateRKeyPls(true);
      window.location.search = params;
    }
    delete_button.index = i;
    delete_button.url = url;

    label.innerHTML = url.split("/")[url.split("/").length - 1 ].split(".png")[0].split(".jpg"[0]);
    li.appendChild(check);
    li.appendChild(label);
    li.appendChild(delete_button);
    document.getElementById("board").appendChild(li);

  });



  // UPDATE CARDS

   document.querySelectorAll("article").forEach((item, i) => {
     item.onclick = function (e) {
       if (Array.from(e.target.classList).includes("off")) {
        e.target.classList.remove("off")  ;
       } else {
        e.target.classList.add("off")  ;
       }
     }
     if (!rkey) return;
     let p = rkey[i]
     let r = order[i];
     let height = 0;
     let width = 0;
     if (r < 6) {
       height = 0;
       width = r * 125;
     } else if (r > 5 && r < 12) {
       height = 175;
       width = (r - 6) * 125;
     } else if (r > 11 && r < 18) {
       height = 350;
       width = (r - 12) * 125;
     } else if (r > 17 && r < 24) {
       height = 525;
       width = (r - 18) * 125;
     }
     item.style.backgroundPositionX = "-" + width + "px";
     item.style.backgroundPositionY = "-" + height + "px";
     item.style.backgroundImage = "url(" + urls[p] + ")"
   });


}


function updateOrderPls() {
  var order = [];
  for (var i = 0; i <= (24 - 1); i++) {
    order.push(i);
  }
  order = shuffle(order);
  params.set("order", order.join(","));
  window.location.search = params;
}

function updateRKeyPls(remove_one_question) {
  let randoms_array = [];
  let max;
  if (remove_one_question) {max = urls.length - 1} else {
    max = urls.length;
  }
  for (var i = 0; i < 24; i++) {
    let r = Math.floor(Math.random() * max);
    randoms_array.push(r);
  }
  params.set("rkey", randoms_array.join(","));
  window.location.search = params;
}


function shuffle(v) {
  for (var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
  return v;
};

function addUrlToUrlsLocalStoragePls(urls_of_url) {
  let local_urls = JSON.parse(localStorage.getItem("urls"));
  if (!local_urls) local_urls = [];
  local_urls = local_urls.concat(urls_of_url);
  local_urls = [...new Set(local_urls)];
  localStorage.setItem("urls", JSON.stringify(local_urls.filter(u => u)));
}

function addUrlsToUrlPls(url) {
  if (!url) url = document.getElementById("input").value.split("?width=")[0].split("?height=")[0];
  if (!url) return;
  addUrlToUrlsLocalStoragePls([url]);
  urls.push(url);
  urls = [...new Set(urls)];
  params.set("urls", urls.join(","));
  updateOrderPls();
  updateRKeyPls();
  window.location.search = params;

}

function randomMorePls() {
  updateOrderPls();
  updateRKeyPls();
}

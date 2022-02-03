const APP_PREFIX = "tracking-budgets"
const VERSION = "version_1.0.0"
const CACHE_NAME = APP_PREFIX + VERSION

const FILES_TO_CACHE = [
    
    "./index.html",
    "./css/styles.css",
    "./js/index.js",
    "manifest.json",
    "./icons/budget-icon-1.png",
    "./icons/budget-icon-2.png",
    "./icons/budget-icon-3.png",
    "./icons/budget-icon-4.png",
    "./icons/budget-icon-5.png",
    "./icons/budget-icon-6.png",
    "./icons/budget-icon-7.png",
    "./icons/budget-icon-8.png",
];

self.addEventListener("install", function (e) {
    e.waitUntil(
      caches.open(CACHE_NAME).then(function (cache) {
        console.log("installing cache : " + CACHE_NAME)
        return cache.addAll(FILES_TO_CACHE)
      })
    )
});

self.addEventListener("activate", function(e) {
    e.waitUntil(
      caches.keys().then(function (keyList) {
        let cacheKeeplist = keylist.filter(function (key) {
          return key.indexOf(APP_PREFIX);
        });
        cacheKeeplist.push(CACHE_NAME);
        return Promise.all(
          keyList.map(function (key, i) {
            if (cacheKeeplist.indexOf(key) === -1) {
              console.log("delete cache: ' + keyList[i]");
              return caches.delete(keyList[i]);
            }
          })
        );
      })
    );
  })

  self.addEventListener("fetch", function(even) {
    if (even.request.url.includes("/api/")) {
      even.respondWith(
        caches
          .open(DATA_CACHE_NAME)
          .then(cache => {
            return fetch(even.request)
              .then(response => {
                if (response.status === 200) {
                  cache.put(even.request.url, response.clone());
                }
  
                return response;
              })
              .catch(err => { 
                return cache.match(even.request);
              });
          })
          .catch(err => console.log(err))
      );
  
      return;
    }

    even.respondWith(
        fetch(even.request).catch(function() {
          return caches.match(even.request).then(function(response) {
            if (response) {
              return response;
            } else if (even.request.headers.get("accept").includes("text/html")) {
            
              return caches.match("/");
            }
          });
        })
      );
  }); 
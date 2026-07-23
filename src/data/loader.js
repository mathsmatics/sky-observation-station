/* Real Sky Observatory local data loader.
 * Data shards under src/data are the single editable source data.
 * This bridge keeps file:// direct-open mode working by serving D3-Celestial's
 * d3.json() requests from registered in-memory datasets.
 * If the application installs __RSO_PREPARE_SKY_DATASET__, each returned
 * deep copy can be annotated/transformed for the active astronomy model without
 * mutating the editable source shards.
 */
(function () {
  "use strict";

  var root = window.__RSO_LOCAL_DATA__ || Object.create(null);
  var counts = window.__RSO_LOAD_COUNTS__ || Object.create(null);

  function normalizeDataPath(value) {
    var clean = decodeURIComponent(String(value || ""))
      .split(/[?#]/)[0]
      .replace(/\\/g, "/")
      .replace(/^\.\//, "");
    clean = clean.replace(/^.*?src\/data\//, "");
    return clean.replace(/^\/+/g, "");
  }

  function aliases(path) {
    var clean = normalizeDataPath(path);
    var name = clean.slice(clean.lastIndexOf("/") + 1);
    return [clean, name, "src/data/" + clean].filter(Boolean);
  }

  function cloneData(data) {
    if (typeof structuredClone === "function") return structuredClone(data);
    return JSON.parse(JSON.stringify(data));
  }

  window.__RSO_LOCAL_DATA__ = root;
  window.__RSO_LOAD_COUNTS__ = counts;
  window.__RSO_FILE_MODE__ = window.location.protocol === "file:";
  window.__RSO_BUNDLED_DATA_MODE__ = true;
  window.__RSO_DATA_MODE__ = "js-shards";

  window.registerSkyData = function registerSkyData(path, data) {
    aliases(path).forEach(function (key) {
      root[key] = data;
    });
  };

  if (
    window.d3 &&
    typeof window.d3.json === "function" &&
    !window.__RSO_D3_JSON_PATCHED__
  ) {
    var originalJson = window.d3.json;
    window.__RSO_D3_JSON_PATCHED__ = true;
    window.d3.json = function (url, callback) {
      var clean = normalizeDataPath(url);
      var name = clean.slice(clean.lastIndexOf("/") + 1);
      var data = Object.prototype.hasOwnProperty.call(root, clean)
        ? root[clean]
        : root[name];
      if (data !== undefined) {
        counts[clean || name] = (counts[clean || name] || 0) + 1;
        var copy = cloneData(data);
        if (typeof window.__RSO_PREPARE_SKY_DATASET__ === "function") {
          try {
            copy =
              window.__RSO_PREPARE_SKY_DATASET__(clean || name, copy) || copy;
          } catch (error) {
            console.warn(
              "RSO sky data preparation failed",
              clean || name,
              error,
            );
          }
        }
        if (typeof callback === "function") {
          setTimeout(function () {
            callback(null, copy);
          }, 0);
          return;
        }
        return copy;
      }
      return originalJson.apply(this, arguments);
    };
  }
})();

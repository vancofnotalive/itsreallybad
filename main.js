function isUserTypingNow() {
  const el = document.activeElement;
  return (
    el &&
    (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') &&
    !el.readOnly &&
    !el.disabled
  );
}


function getCurrentDeviceType() {
  const width = window.innerWidth;
  if (width <= 480) return "phone";
  if (width <= 768) return "tab";
  if (width <= 1024) return "lap";
  if (width <= 1440) return "pc";
  return "tv";
}

function bindMirroredInputs() {
  const map = {};

  document.querySelectorAll("input[host], textarea[host]").forEach(host => {
    const key = host.getAttribute("host");
    if (!map[key]) map[key] = { host: null, connects: [] };
    map[key].host = host;
  });

  document.querySelectorAll("input[connect], textarea[connect]").forEach(conn => {
    const key = conn.getAttribute("connect");
    if (!map[key]) map[key] = { host: null, connects: [] };
    map[key].connects.push(conn);
  });

for (const key in map) {
  const { host, connects } = map[key];
  if (!host) continue;

  const updateAll = (val, skipEl) => {
    if (host !== skipEl) host.value = val;
    connects.forEach(el => {
      if (el !== skipEl) el.value = val;
    });
  };

  host.addEventListener("input", () => updateAll(host.value, host));
  connects.forEach(conn => {
    conn.addEventListener("input", () => updateAll(conn.value, conn));
  });
}

}

function handleMoveTags() {
  document.querySelectorAll("move[ele]").forEach(moveTag => {
    const selector = moveTag.getAttribute("ele");
    if (!selector) return;

    let original;
    if (selector.includes("@")) {
      const parts = selector.split("@");
      let base = document.querySelector(parts[0]);
      for (let i = 1; i < parts.length && base; i++) {
        base = base.querySelector(parts[i]);
      }
      original = base;
    } else {
      original = document.querySelector(selector);
    }

    if (!original) return;

    const moveAttributes = [...moveTag.attributes].filter(attr => attr.name !== "ele");
    let existing = moveTag.querySelector(original.tagName);
    const isInput = original.tagName === "INPUT" || original.tagName === "TEXTAREA";

    const shouldReplace =
      !existing ||
      moveAttributes.some(attr => existing.getAttribute(attr.name) !== attr.value) ||
      (isInput && existing.value !== original.value);

    if (!shouldReplace) return;
    if (existing) existing.remove();

    const clone = original.cloneNode(true);
    moveAttributes.forEach(attr => clone.setAttribute(attr.name, attr.value));
    if (isInput) clone.value = original.value;

    moveTag.appendChild(clone);
  });
}

function moveElementsIntoActiveIf() {
  const currentDevice = getCurrentDeviceType();
  const matchingIfBlocks = [...document.querySelectorAll("if-block")].filter(el => {
    const devices = el.getAttribute("device")?.split("||").map(d => d.trim());
    return devices?.includes(currentDevice);
  });

  for (const activeIf of matchingIfBlocks) {
    const selector = activeIf.getAttribute("move");
    if (!selector) continue;

    let elementToMove = document.querySelector(selector);
    if (!elementToMove) {
      document.querySelectorAll("if-block").forEach(ifEl => {
        const maybe = ifEl.querySelector(selector);
        if (maybe) elementToMove = maybe;
      });
    }

    if (!elementToMove) continue;

    document.querySelectorAll("if-block").forEach(ifEl => {
      const existing = ifEl.querySelector(selector);
      if (existing) existing.remove();
    });

    if (elementToMove.parentElement) elementToMove.remove();
    activeIf.appendChild(elementToMove);
  }
}
function updateTargetBlockVisibility(root) {
  const allTargets = (root || document).querySelectorAll("target-block[element][has]");
  allTargets.forEach(target => {
    const sel = target.getAttribute("element");
    const required = target.getAttribute("has");
    const scope = root || document;
    const targetEl = scope.querySelector(sel);
    const hasClass = targetEl?.classList.contains(required.replace(/^\./, ""));

    if (hasClass) {
      target.setAttribute("data-active", "true");
    } else {
      target.removeAttribute("data-active");
    }
  });
}

function applyDynamicStylesToElement(root) {
  
  updateTargetBlockVisibility(root); 
  const propertyMap = {
    marginT: "margin-top", marginR: "margin-right",
    marginB: "margin-bottom", marginL: "margin-left",
    paddingT: "padding-top", paddingR: "padding-right",
    paddingB: "padding-bottom", paddingL: "padding-left",
    fs: "font-size"
  };


  const currentDevice = getCurrentDeviceType();
const all = [...(root || document).querySelectorAll("[ds]")].filter(el => {
  const ifb = el.closest("if-block");
  if (ifb) {
    const devs = (ifb.getAttribute("device") || "").split("||").map(d => d.trim());
    if (!devs.includes(currentDevice)) return false;
  }

const target = el.closest("target-block[element][has]");
if (target) {
  const sel = target.getAttribute("element");
  const required = target.getAttribute("has");

  const scope = root || document;
  const targetEl = scope.querySelector(sel);
  const hasClass = targetEl?.classList.contains(required.replace(/^\./, ""));

  if (hasClass) {
    target.setAttribute("data-active", "true");
  } else {
    target.removeAttribute("data-active");
    return false;
  }
}



  return true;
});



  all.forEach(el => {
    
    const rules = el.getAttribute("ds").split(";").map(r => r.trim()).filter(Boolean);
    rules.forEach(rule => {
      let [rawProp, expr] = rule.split(":").map(s => s.trim());
      if (!rawProp || !expr) return;

      const prop = propertyMap[rawProp] || rawProp;
      let important = false;
      if (expr.endsWith("!i")) {
        important = true;
        expr = expr.slice(0, -3).trim();
      }

      expr = expr.replace(/\$t\$\.(.+?)_(H|W)/g, (_, chain, dim) => {
        const parts = chain.split("@");
        let node = el.closest(`.${parts[0]}`);
        for (let i = 1; i < parts.length && node; i++) {
          node = node.querySelector(parts[i]);
        }
        return node ? (dim === "H" ? node.offsetHeight : node.offsetWidth) : "0";
      });

      expr = expr.replace(/([.#][\w@-]+)_(H|W)/g, (_, sel, dim) => {
  const parts = sel.split("@");
  let base = (root || document).querySelector(parts[0]);
  for (let i = 1; i < parts.length && base; i++) {
    base = base.querySelector(parts[i]);
  }
  if (!base) return "0";

  const ifb = base.closest("if-block");
  if (ifb) {
    const devs = (ifb.getAttribute("device") || "").split("||").map(d => d.trim());
    if (!devs.includes(currentDevice)) return "0";
  }

  return dim === "H" ? base.offsetHeight : base.offsetWidth;
});


      try {
        const val = Function(`return ${expr}`)();
        if (!isNaN(val)) {
          el.style.setProperty(prop, val + "px", important ? "important" : "");
        }
      } catch (err) {
        console.warn(`Failed to evaluate ds expression: "${expr}"`, err);
      }
    });
  });
}

function applyDynamicStyles() {
  applyDynamicStylesToElement(document);
}

function applyDynamicStylesToClone() {
  const clone = document.body.cloneNode(true);
  applyDynamicStylesToElement(clone);
  return cleanString(clone.innerHTML);
}

function observeLayoutChanges() {
  if (!isUserTypingNow()) {

    
    const observer = new MutationObserver(() => applyDynamicStyles());
    observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style", "ds", "device", "has", "element"],
  });
  
  const resize = new ResizeObserver(() => applyDynamicStyles());
  resize.observe(document.body);
}
}


function normalizeHTML(str) {
  return str.replace(/\s+/g, ' ')
    .replace(/style="[^"]*"/g, '')
    .trim();
}

function cleanString(str) {
  return str.replace(/[\n\r\t\f\v]+/g, ' ')
    .replace(/ {2,}/g, ' ')
    .trim();
}

function setBodyHeight() {
  document.querySelector("body").style.height = window.innerHeight + "px";
}

function init() {
  setBodyHeight();
  moveElementsIntoActiveIf();
  handleMoveTags();
  bindMirroredInputs();
  applyDynamicStyles();

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      applyDynamicStyles();
    });
  });

  setTimeout(() => applyDynamicStyles(), 200);
}

window.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", init);

observeLayoutChanges();

/* 
!) $t$TagName is not supported. Experiemtn with it

!) target block element="" does not support %t% and those syntaxes, it just takes
	 simple class
*/
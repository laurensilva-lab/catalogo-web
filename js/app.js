// Lógica del catálogo. Para cambios simples editá config.js y productos.json, no este archivo.
let S = { items: [] };
// ===== ESTADO =====
let canEdit = false,
  edit = false,
  adm = false;
const $ = (s) => document.querySelector(s);
const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const money = (n) => "$" + Number(n || 0).toLocaleString("es-UY");
function msg(t) {
  const m = $("#msg");
  m.textContent = t;
  m.style.display = "block";
  setTimeout(() => (m.style.display = "none"), 2500);
}
function wa(p) {
  const t =
    "Hola! Me interesa: " +
    p.name +
    (p.sizes ? " (talle " + p.sizes + ")" : "") +
    " - " +
    money(p.price) +
    ". ¿Sigue disponible?";
  return "https://wa.me/" + (S.phone || "") + "?text=" + encodeURIComponent(t);
}

// ===== TARJETA DE CADA PRENDA =====
function card(p, i) {
  const img = p.img
    ? `<img class="ph" ${edit ? "" : 'onclick="zoom(' + i + ')" '}src="${p.img}" alt="${esc(p.name)}">`
    : `<div class="ph">Sin foto</div>`;
  const sz = (p.sizes || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!edit)
    return `<div class="card ${p.sold ? "sold" : ""}">${p.sold ? '<span class="tag">Agotado</span>' : ""}${img}<div class="b"><div class="n">${esc(p.name)}</div><div class="sz">${sz.length ? 'Talle: <select id="s' + i + '" class="sel">' + sz.map((s) => "<option>" + esc(s) + "</option>").join("") + "</select>" : "Consultá talles"}</div><div class="pr">${money(p.price)}</div><button class="btn" onclick="addCart(${i})">${p.sold ? "Agotado" : "Agregar al carrito"}</button></div></div>`;
  return `<div class="card">${img}<div class="b">
 <input type="text" value="${esc(p.name)}" placeholder="Nombre" onchange="S.items[${i}].name=this.value">
 <input type="text" value="${esc(p.sizes)}" placeholder="Talles (ej: 40, 42)" onchange="S.items[${i}].sizes=this.value">
 <input type="number" value="${p.price}" placeholder="Precio" onchange="S.items[${i}].price=+this.value">
 <label><input type="checkbox" ${p.sold ? "checked" : ""} onchange="S.items[${i}].sold=this.checked"> Agotado</label>
 <label class="btn g" style="margin:0">Cambiar foto<input type="file" accept="image/*" hidden onchange="photo(${i},this.files[0])"></label>
 <button class="btn g" onclick="del(${i})">${p._c ? "Toca de nuevo para borrar" : "Borrar"}</button></div></div>`;
}

// ===== PANTALLA PRINCIPAL =====
function render() {
  let h = `<header class="hero"><img class="logo" src="${TIENDA.logo}" alt="${esc(S.title)}" onclick="tap()"><h1 class="sr">${esc(S.title)}</h1><p class="sub">${esc(S.sub)}</p><button class="cta" onclick="document.getElementById('catalogo').scrollIntoView({behavior:'smooth'})">Ver prendas</button></header>`;
  if (canEdit && adm) {
    h += `<div class="bar"><button class="btn g" onclick="edit=!edit;render()">${edit ? "Ver como cliente" : "Editar"}</button>`;
    if (edit)
      h += `<button class="btn g" onclick="add()">Agregar prenda</button><input type="text" value="${esc(S.phone)}" placeholder="Tu WhatsApp: 59899123456" style="max-width:230px" onchange="S.phone=this.value.replace(/[^0-9]/g,'')">`;
    h += `<button class="btn g" onclick="copyTxt()">Copiar texto</button><button class="btn p" onclick="save()">Guardar y publicar</button><button class="btn g" onclick="adm=false;edit=false;canEdit=false;location.hash='';render()">Cerrar</button></div>`;
  }
  if (location.hash === "#admin" && !canEdit)
    h += `<div class="bar"><input type="password" id="pw" placeholder="Clave" style="max-width:200px"><button class="btn p" onclick="login()">Entrar</button></div>`;
  h += `<section class="steps"><h2 class="sec">Cómo comprar</h2><div class="sg">${(TIENDA.pasos || []).map((s, k) => `<div class="st"><b>${k + 1}</b><div><strong>${esc(s[0])}</strong><span>${esc(s[1])}</span></div></div>`).join("")}</div></section>`;
  h += `<h2 class="sec" id="catalogo">Prendas disponibles</h2><div class="grid">${S.items.map(card).join("")}</div>`;
  if (S.phone)
    h += `<footer class="ft">¿Dudas? Escribinos por WhatsApp<br><a href="https://wa.me/${S.phone}" target="_blank" rel="noopener">+${S.phone}</a></footer>`;
  $("#app").innerHTML = h;
  drawCart();
}
function add() {
  S.items.unshift({ name: "Prenda nueva", sizes: "", price: 0, sold: false, img: "" });
  render();
}
function del(i) {
  const p = S.items[i];
  if (p._c) S.items.splice(i, 1);
  else p._c = 1;
  render();
}
function cfg() {
  const n = prompt("Tu número con código de país, sin + ni espacios (ej: 59899123456)", S.phone || "");
  if (n !== null) {
    S.phone = n.replace(/\D/g, "");
    msg("Listo, ahora guardá y publicá");
  }
}
function photo(i, f) {
  if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    const im = new Image();
    im.onload = () => {
      const k = Math.min(1, 640 / Math.max(im.width, im.height)),
        c = document.createElement("canvas");
      c.width = im.width * k;
      c.height = im.height * k;
      c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
      S.items[i].img = c.toDataURL("image/jpeg", 0.72);
      render();
    };
    im.src = r.result;
  };
  r.readAsDataURL(f);
}
function copyTxt() {
  const t =
    "OFERTAAA, TODO NUEVO\n\n" +
    S.items
      .filter((p) => !p.sold)
      .map((p) => "• " + p.name + (p.sizes ? ", talle " + p.sizes : "") + ": " + money(p.price))
      .join("\n") +
    "\n\nConsultá por privado" +
    (S.url ? "\nCatálogo con fotos: " + S.url : "");
  (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject())
    .then(() => msg("Texto copiado"))
    .catch(() => prompt("Copiá el texto:", t));
}

// ===== CARRITO Y PEDIDO POR WHATSAPP =====
let cart = [],
  cOpen = false;
try {
  cart = JSON.parse(localStorage.cart || "[]");
} catch (e) {}
const tot = () => cart.reduce((a, c) => a + c.q * c.p, 0);
function sv() {
  try {
    localStorage.cart = JSON.stringify(cart);
  } catch (e) {}
  drawCart();
}
function addCart(i) {
  const p = S.items[i];
  if (p.sold) return;
  const e = $("#s" + i),
    s = e ? e.value : "";
  const k = cart.find((c) => c.n === p.name && c.s === s);
  if (k) k.q++;
  else cart.push({ n: p.name, s: s, p: p.price, q: 1 });
  sv();
  msg("Agregado al carrito");
}
function qty(j, d) {
  cart[j].q += d;
  if (cart[j].q < 1) cart.splice(j, 1);
  sv();
}
function toggleCart() {
  cOpen = !cOpen;
  drawCart();
}
function drawCart() {
  if (edit || !S.items.length) {
    $("#cart").innerHTML = "";
    return;
  }
  const n = cart.reduce((a, c) => a + c.q, 0);
  let h = `<button class="btn fab" onclick="toggleCart()">Carrito (${n})</button>`;
  if (cOpen) {
    h += `<div class="ov" onclick="if(event.target===this)toggleCart()"><div class="dr"><h2>Tu pedido</h2>`;
    if (cart.length) {
      h +=
        cart
          .map(
            (c, j) =>
              `<div class="ln"><div>${esc(c.n)}${c.s ? " (talle " + esc(c.s) + ")" : ""}<br><span class="sz">${money(c.p)}</span></div><div class="qt"><button onclick="qty(${j},-1)">-</button>${c.q}<button onclick="qty(${j},1)">+</button></div></div>`,
          )
          .join("") +
        `<div class="tot">Total: ${money(tot())}</div><input type="text" id="nm" placeholder="Tu nombre (opcional)"><button class="btn" onclick="send()">Enviar pedido por WhatsApp</button>`;
    } else h += '<p class="sub">Todavía no agregaste nada.</p>';
    h += `<button class="btn g" onclick="toggleCart()">Seguir mirando</button></div></div>`;
  }
  $("#cart").innerHTML = h;
}
function send() {
  if (!S.phone) return msg("La tienda todavía no configuró su WhatsApp");
  const nm = ($("#nm").value || "").trim();
  const t =
    "Hola! Quiero hacer este pedido:\n" +
    cart
      .map((c) => "- " + c.q + " x " + c.n + (c.s ? " (talle " + c.s + ")" : "") + " - " + money(c.q * c.p))
      .join("\n") +
    "\n\nTotal: " +
    money(tot()) +
    (nm ? "\nNombre: " + nm : "");
  window.open("https://wa.me/" + S.phone + "?text=" + encodeURIComponent(t), "_blank");
  cart = [];
  cOpen = false;
  sv();
}

// ===== IMAGEN EN PANTALLA COMPLETA =====
let zoomI = -1;
function zoom(i) {
  zoomI = i;
  drawZoom();
}
function drawZoom() {
  const p = S.items[zoomI];
  $("#zoom").innerHTML =
    p && p.img
      ? `<div class="zv" onclick="zoomI=-1;drawZoom()"><button class="zx">Cerrar</button><img src="${p.img}" alt="${esc(p.name)}"><div class="zc">${esc(p.name)} - ${money(p.price)}</div></div>`
      : "";
}
addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    zoomI = -1;
    drawZoom();
  }
});

// ===== ENTRAR AL ADMIN: tocar 5 veces el logo (o abrir /#admin) =====
let taps = 0,
  tapT;
function tap() {
  taps++;
  clearTimeout(tapT);
  tapT = setTimeout(() => (taps = 0), 1500);
  if (taps >= 5) {
    taps = 0;
    location.hash = "admin";
    render();
  }
}

// ===== MODO ADMIN (/#admin) Y GUARDADO =====
let PW = "";
async function save() {
  try {
    const r = await fetch("/api/catalog", {
      method: "POST",
      headers: { "x-admin": PW, "content-type": "application/json" },
      body: JSON.stringify(S, (k, v) => (k === "_c" ? undefined : v)),
    });
    if (r.status === 401) {
      canEdit = false;
      render();
      return msg("Clave incorrecta");
    }
    if (!r.ok) throw new Error((await r.json()).error);
    msg("Publicado");
  } catch (e) {
    msg("No se pudo guardar: " + (e.message || e));
  }
}
async function login() {
  PW = ($("#pw").value || "").trim();
  let r,
    d = {};
  try {
    r = await fetch("/api/catalog?check=1", { headers: { "x-admin": PW } });
    d = await r.json().catch(() => ({}));
  } catch (e) {
    return msg("No se pudo conectar con el servidor");
  }
  if (r.ok) {
    canEdit = true;
    adm = true;
    render();
    if (!d.blob) {
      const e = d.env || {};
      msg(
        "Clave correcta, pero este despliegue no ve el Blob. TOKEN: " +
          (e.token ? "si" : "no") +
          " | STORE_ID: " +
          (e.store ? "si" : "no") +
          ". Falta volver a desplegar.",
      );
    }
    return;
  }
  if (r.status === 404) return msg("No se encontró la carpeta api en el proyecto");
  if (d.configured === false) return msg("Falta la variable ADMIN_PASSWORD en Vercel (y volver a desplegar)");
  msg(r.status === 401 ? "Clave incorrecta" : "Error del servidor (" + r.status + ")");
}
async function load() {
  let d = null;
  try {
    const r = await fetch("/api/catalog");
    if (r.ok) d = await r.json();
  } catch (e) {}
  if (!d || !d.items) {
    try {
      d = await (await fetch("/productos.json")).json();
    } catch (e) {
      d = { title: "Ofertas", sub: "", phone: "", items: [] };
    }
  }
  S = d;
  S.title = TIENDA.titulo;
  S.sub = TIENDA.subtitulo;
  S.phone = S.phone || TIENDA.whatsapp;
  S.url = location.origin;
  render();
}
addEventListener("hashchange", render);
load();

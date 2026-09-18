const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const money = n => "₹" + Number(n || 0).toLocaleString("en-IN", {maximumFractionDigits: 2});

async function currentUser() {
  const { data } = await client.auth.getUser();
  return data.user || null;
}

async function profileFor(userId) {
  const { data } = await client.from("profiles").select("*").eq("id", userId).maybeSingle();
  return data;
}

function getCart() {
  try { return JSON.parse(localStorage.getItem("novaCart") || "[]"); }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem("novaCart", JSON.stringify(cart));
  updateCartCount();
}

function addToCart(product) {
  const cart = getCart();
  const item = cart.find(x => String(x.id) === String(product.id));
  if (item) item.quantity += 1;
  else cart.push({id: product.id, name: product.name, price: Number(product.price), image_url: product.image_url || "", quantity: 1});
  saveCart(cart);
  toast(product.name + " added to cart");
}

function removeFromCart(id) {
  saveCart(getCart().filter(x => String(x.id) !== String(id)));
}

function changeQty(id, amount) {
  const cart = getCart();
  const item = cart.find(x => String(x.id) === String(id));
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) removeFromCart(id);
  else saveCart(cart);
}

function cartTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((s, x) => s + Number(x.price) * x.quantity, 0);
  const delivery = subtotal === 0 ? 0 : (subtotal >= 999 ? 0 : 79);
  return {subtotal, delivery, total: subtotal + delivery};
}

function updateCartCount() {
  document.querySelectorAll("[data-cart-count]").forEach(el => {
    el.textContent = getCart().reduce((s,x)=>s+x.quantity,0);
  });
}

function toast(message) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = message;
  t.classList.add("show");
  clearTimeout(window.__toast);
  window.__toast = setTimeout(()=>t.classList.remove("show"), 2200);
}

async function renderNavAuth() {
  const user = await currentUser();
  const area = document.querySelector("[data-auth-area]");
  if (!area) return;
  if (user) {
    const profile = await profileFor(user.id);
    const name = profile?.full_name || user.user_metadata?.full_name || user.email;
    area.innerHTML = `<a class="nav-user" href="profile.html">Hi, ${escapeHtml(name.split(" ")[0])}</a><button class="nav-btn" id="logoutBtn">Logout</button>`;
    document.getElementById("logoutBtn").onclick = async () => { await client.auth.signOut(); location.reload(); };
  } else {
    area.innerHTML = `<a class="nav-btn primary" href="login.html">Login</a>`;
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

async function getProducts() {
  const { data, error } = await client.from("products").select("*").order("created_at", {ascending:false});
  if (error) throw error;
  return data || [];
}

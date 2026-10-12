const products = [
  {id:1,name:"Satin Slip Dress",category:"women",price:2499,img:"https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=700&q=80",tag:"NEW"},
  {id:2,name:"Oversized Wool Coat",category:"women",price:4999,img:"https://images.unsplash.com/photo-1539533018447-63fcce2678e4?auto=format&fit=crop&w=700&q=80",tag:"TRENDING"},
  {id:3,name:"Relaxed Linen Shirt",category:"men",price:2299,img:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80",tag:"NEW"},
  {id:4,name:"Classic Leather Bag",category:"accessories",price:3299,img:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80",tag:"BESTSELLER"},
  {id:5,name:"Minimal Knit Sweater",category:"men",price:1999,img:"https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=700&q=80",tag:""},
  {id:6,name:"Tailored Wide-Leg Pants",category:"women",price:2799,img:"https://images.unsplash.com/photo-1506629905607-d9b1e8e9b9a9?auto=format&fit=crop&w=700&q=80",tag:"NEW"},
  {id:7,name:"Everyday Sneakers",category:"men",price:2999,img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",tag:"BESTSELLER"},
  {id:8,name:"Sculptural Sunglasses",category:"accessories",price:1499,img:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80",tag:"TRENDING"}
];

let cart = JSON.parse(localStorage.getItem("luxeCart") || "[]");

const productGrid = document.getElementById("productGrid");
const cartPanel = document.getElementById("cartPanel");
const backdrop = document.getElementById("backdrop");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

function money(n){ return "₹" + n.toLocaleString("en-IN"); }

function renderProducts(list = products){
  productGrid.innerHTML = list.length ? list.map(p => `
    <article class="product-card">
      <div class="product-image">
        ${p.tag ? `<span class="tag">${p.tag}</span>` : ""}
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <button class="quick-add" onclick="addToCart(${p.id})">ADD TO BAG +</button>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.category[0].toUpperCase()+p.category.slice(1)}</p>
        <p class="price">${money(p.price)}</p>
      </div>
    </article>`).join("") : "<p>No products found.</p>";
}

function addToCart(id){
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  if(existing) existing.qty++;
  else cart.push({...product, qty:1});
  saveCart();
  openCart();
}

function removeFromCart(id){
  cart = cart.filter(item => item.id !== id);
  saveCart();
}

function saveCart(){
  localStorage.setItem("luxeCart", JSON.stringify(cart));
  renderCart();
}

function renderCart(){
  const count = cart.reduce((sum,item)=>sum+item.qty,0);
  const total = cart.reduce((sum,item)=>sum+item.price*item.qty,0);
  cartCount.textContent = count;
  cartItems.innerHTML = cart.length ? cart.map(item => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}">
      <div><h4>${item.name}</h4><p>${item.qty} × ${money(item.price)}</p><button class="remove" onclick="removeFromCart(${item.id})">Remove</button></div>
      <strong>${money(item.price*item.qty)}</strong>
    </div>`).join("") : "<p style='color:#777;padding-top:20px'>Your bag is empty.</p>";
  cartTotal.textContent = money(total);
}

function openCart(){cartPanel.classList.add("open");backdrop.classList.add("show")}
function closeCart(){cartPanel.classList.remove("open");backdrop.classList.remove("show")}

document.getElementById("cartBtn").onclick = openCart;
document.getElementById("closeCart").onclick = closeCart;
backdrop.onclick = closeCart;

document.getElementById("menuBtn").onclick = () => document.getElementById("navMenu").classList.toggle("open");
document.querySelectorAll(".nav a").forEach(a => a.onclick = () => document.getElementById("navMenu").classList.remove("open"));

document.querySelectorAll(".filter, .filter-card").forEach(el => {
  el.addEventListener("click", () => {
    const filter = el.dataset.filter;
    document.querySelectorAll(".filter").forEach(b => b.classList.toggle("active", b.dataset.filter === filter));
    renderProducts(filter === "all" ? products : products.filter(p => p.category === filter));
  });
});

const searchOverlay = document.getElementById("searchOverlay");
const searchInput = document.getElementById("searchInput");
document.getElementById("searchBtn").onclick = () => {searchOverlay.classList.add("open");searchInput.focus();};
document.getElementById("closeSearch").onclick = () => searchOverlay.classList.remove("open");

searchInput.addEventListener("input", e => {
  const q = e.target.value.toLowerCase().trim();
  const matches = products.filter(p => p.name.toLowerCase().includes(q) || p.category.includes(q));
  document.getElementById("searchResults").innerHTML = q ? matches.map(p =>
    `<div class="search-result"><span>${p.name}</span><strong>${money(p.price)}</strong></div>`).join("") || "<p style='padding-top:20px'>No matches found.</p>" : "";
});

document.getElementById("newsletterForm").addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("emailInput").value;
  document.getElementById("newsletterMessage").textContent = `Thanks! ${email} is now on the LUXE list.`;
  e.target.reset();
});

document.getElementById("checkoutBtn").onclick = () => {
  if(!cart.length) return alert("Your bag is empty.");
  alert("Demo checkout: your order is ready to be processed!");
};

renderProducts();
renderCart();

const PHONE="5562994385558";
const products=[
 {id:1,name:"IGNITE V300",price:150,cat:"ignite",meta:"Destaque"},
 {id:2,name:"ELFBAR BC 25K",price:130,cat:"elfbar",meta:"Destaque"},
 {id:3,name:"DINNER LUMA 20K",price:130,cat:"outros",meta:"Disponível"},
 {id:4,name:"REFIL LIFE 10K",price:110,cat:"refil",meta:"Refil"},
 {id:5,name:"IGNITE SLIM 8K PUFF",price:110,cat:"ignite",meta:"Destaque"},
 {id:6,name:"IGNITE V400 ICE SLIM",price:160,cat:"ignite",meta:"Destaque"},
 {id:7,name:"IGNITE V500",price:150,cat:"ignite",meta:"Destaque"},
 {id:8,name:"IGNITE KIT P100",price:140,cat:"kit",meta:"Kit"},
 {id:9,name:"REFIL P100",price:110,cat:"refil",meta:"Refil"},
 {id:10,name:"IGNITE V155 SLIM",price:120,cat:"ignite",meta:"Destaque"},
 {id:11,name:"BLACK SHEEP DUAL 40K",price:150,cat:"outros",meta:"Disponível"},
 {id:12,name:"REFIL LIFE ECO3",price:120,cat:"refil",meta:"Refil"},
 {id:13,name:"KIT LIFE ECO3",price:160,cat:"kit",meta:"Kit"},
 {id:14,name:"COIL/RESISTÊNCIA 3ML",price:null,cat:"acessorios",meta:"Acessório"},
 {id:15,name:"NIC SALT 45mg",price:null,cat:"acessorios",meta:"Consultar"}
];
let cart=JSON.parse(localStorage.getItem("thCart")||"{}");
let activeFilter="all";
const $=s=>document.querySelector(s);
const money=v=>v==null?"Consultar":new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(v);
function save(){localStorage.setItem("thCart",JSON.stringify(cart));renderCart();updateCount()}
function updateCount(){const n=Object.values(cart).reduce((a,x)=>a+x,0);$("#cartCount").textContent=n}
function filteredProducts(){
 const q=$("#searchInput").value.toLowerCase().trim();
 let list=products.filter(p=>(activeFilter==="all"||p.cat===activeFilter)&&(!q||p.name.toLowerCase().includes(q)));
 const sort=$("#sortSelect").value;
 if(sort==="low")list.sort((a,b)=>(a.price??999999)-(b.price??999999));
 if(sort==="high")list.sort((a,b)=>(b.price??-1)-(a.price??-1));
 if(sort==="az")list.sort((a,b)=>a.name.localeCompare(b.name));
 return list;
}
function renderProducts(){
 const list=filteredProducts(),grid=$("#productGrid");
 $("#resultInfo").textContent=list.length+" produto"+(list.length===1?"":"s")+" encontrado"+(list.length===1?"":"s");
 if(!list.length){grid.innerHTML='<div class="empty-cart" style="grid-column:1/-1">Nenhum produto encontrado.</div>';return}
 grid.innerHTML=list.map(p=>`<article class="product-card">
   <div class="product-visual" aria-hidden="true"></div>
   <div class="product-body">
     <div class="product-name">${p.name}</div>
     <div class="product-meta">${p.meta}</div>
     <div class="product-price ${p.price==null?"consult":""}">${money(p.price)}</div>
     <button class="product-add" data-id="${p.id}">${p.price==null?"Consultar":"Adicionar"}</button>
   </div>
 </article>`).join("");
 grid.querySelectorAll(".product-add").forEach(b=>b.onclick=()=>{
   const p=products.find(x=>x.id===Number(b.dataset.id));
   if(p.price==null){openProductWhatsApp(p);return}
   cart[p.id]=(cart[p.id]||0)+1;save();
 });
}
function openProductWhatsApp(p){const text=`Olá! Gostaria de consultar o valor e a disponibilidade de: ${p.name}.`;window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`,"_blank","noopener")}
function renderCart(){
 const box=$("#cartItems"),ids=Object.keys(cart).filter(id=>cart[id]>0);
 if(!ids.length){box.innerHTML='<div class="empty-cart">Seu carrinho está vazio.<br>Adicione produtos para montar seu pedido.</div>';$("#cartTotal").textContent=money(0);return}
 let total=0;
 box.innerHTML=ids.map(id=>{const p=products.find(x=>x.id===Number(id)),q=cart[id];total+=p.price*q;return`<div class="cart-item"><div><div class="cart-item-name">${p.name}</div><div class="cart-item-price">${money(p.price)} × ${q}</div></div><div class="qty"><button data-minus="${p.id}">−</button><b>${q}</b><button data-plus="${p.id}">+</button></div></div>`}).join("");
 $("#cartTotal").textContent=money(total);
 box.querySelectorAll("[data-minus]").forEach(b=>b.onclick=()=>changeQty(Number(b.dataset.minus),-1));
 box.querySelectorAll("[data-plus]").forEach(b=>b.onclick=()=>changeQty(Number(b.dataset.plus),1));
}
function changeQty(id,d){cart[id]=(cart[id]||0)+d;if(cart[id]<=0)delete cart[id];save()}
function openCart(){const p=$("#cartPanel");p.classList.add("open");p.setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}
function closeCart(){const p=$("#cartPanel");p.classList.remove("open");p.setAttribute("aria-hidden","true");document.body.style.overflow=""}
function sendOrder(){
 const ids=Object.keys(cart).filter(id=>cart[id]>0);if(!ids.length){alert("Adicione pelo menos um produto ao carrinho.");return}
 let total=0;const lines=ids.map(id=>{const p=products.find(x=>x.id===Number(id)),q=cart[id];total+=p.price*q;return`• ${p.name} — ${q}x — ${money(p.price*q)}`});
 const msg=`Olá! Quero falar sobre um pedido na Tabacaria do TH.\n\n${lines.join("\n")}\n\nTotal informado no catálogo: ${money(total)}\n\nTenho 18 anos ou mais.`;
 window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`,"_blank","noopener");
}
$("#searchInput").addEventListener("input",renderProducts);
$("#sortSelect").addEventListener("change",renderProducts);
document.querySelectorAll(".category").forEach(b=>b.onclick=()=>{document.querySelectorAll(".category").forEach(x=>x.classList.remove("active"));b.classList.add("active");activeFilter=b.dataset.filter;renderProducts()});
$("#openCart").onclick=openCart;$("#closeCart").onclick=closeCart;$("#closeCartButton").onclick=closeCart;$("#whatsappOrder").onclick=sendOrder;
$("#clearCart").onclick=()=>{cart={};save()};
$("#ageYes").onclick=()=>{localStorage.setItem("thAge","yes");$("#ageGate").classList.add("hidden")};
$("#ageNo").onclick=()=>{window.location.href="https://www.google.com/"};
if(localStorage.getItem("thAge")==="yes")$("#ageGate").classList.add("hidden");
renderProducts();renderCart();updateCount();
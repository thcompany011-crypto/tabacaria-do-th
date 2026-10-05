const PHONE="5562994385558";
const products=[
 {id:1,name:"IGNITE V300",price:150},
 {id:2,name:"ELFBAR BC 25K",price:130},
 {id:3,name:"DINNER LUMA 20K",price:130},
 {id:4,name:"REFIL LIFE 10K",price:110},
 {id:5,name:"IGNITE SLIM 8K PUFF",price:110},
 {id:6,name:"IGNITE V400 ICE SLIM",price:160},
 {id:7,name:"IGNITE V500",price:150},
 {id:8,name:"IGNITE KIT P100",price:140},
 {id:9,name:"REFIL P100",price:110},
 {id:10,name:"IGNITE V155 SLIM",price:120},
 {id:11,name:"BLACK SHEEP DUAL 40K",price:150},
 {id:12,name:"REFIL LIFE ECO3",price:120},
 {id:13,name:"KIT LIFE ECO3",price:160},
 {id:14,name:"COIL/RESISTÊNCIA 3ML",price:null},
 {id:15,name:"NIC SALT 45mg",price:null}
];
let cart=JSON.parse(localStorage.getItem("thCart")||"{}");
const $=s=>document.querySelector(s);
const money=v=>v==null?"Consultar":new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(v);
function save(){localStorage.setItem("thCart",JSON.stringify(cart));renderCart();updateCount()}
function updateCount(){const n=Object.values(cart).reduce((a,x)=>a+x,0);$("#cartCount").textContent=n}
function renderProducts(list=products){
 const grid=$("#productGrid");
 if(!list.length){grid.innerHTML='<div class="empty-cart" style="grid-column:1/-1">Nenhum produto encontrado.</div>';return}
 grid.innerHTML=list.map(p=>`<article class="product-card"><div class="product-visual" aria-hidden="true"></div><div class="product-body"><div class="product-name">${p.name}</div><div class="product-price ${p.price==null?"consult":""}">${money(p.price)}</div><button class="product-add" data-id="${p.id}">${p.price==null?"Consultar no WhatsApp":"Adicionar ao carrinho"}</button></div></article>`).join("");
 grid.querySelectorAll(".product-add").forEach(b=>b.addEventListener("click",()=>{const p=products.find(x=>x.id===Number(b.dataset.id));if(p.price==null){openProductWhatsApp(p);return}cart[p.id]=(cart[p.id]||0)+1;save()}));
}
function openProductWhatsApp(p){const text=`Olá! Gostaria de consultar o valor e a disponibilidade de: ${p.name}.`;window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`,"_blank","noopener")}
function renderCart(){
 const box=$("#cartItems"),ids=Object.keys(cart).filter(id=>cart[id]>0);
 if(!ids.length){box.innerHTML='<div class="empty-cart">Seu carrinho está vazio.<br>Adicione produtos para montar seu pedido.</div>';$("#cartTotal").textContent=money(0);return}
 let total=0;
 box.innerHTML=ids.map(id=>{const p=products.find(x=>x.id===Number(id));const q=cart[id];total+=p.price*q;return`<div class="cart-item"><div><div class="cart-item-name">${p.name}</div><div class="cart-item-price">${money(p.price)} × ${q}</div></div><div class="qty"><button data-minus="${p.id}">−</button><b>${q}</b><button data-plus="${p.id}">+</button></div></div>`}).join("");
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
 const msg=`Olá! Quero fazer um pedido na Tabacaria do TH.\n\n${lines.join("\n")}\n\nTotal: ${money(total)}\n\nTenho 18 anos ou mais.`;
 window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`,"_blank","noopener");
}
$("#searchInput").addEventListener("input",e=>{const q=e.target.value.toLowerCase().trim();renderProducts(products.filter(p=>p.name.toLowerCase().includes(q)))});
$("#openCart").onclick=openCart;$("#closeCart").onclick=closeCart;$("#closeCartButton").onclick=closeCart;$("#whatsappOrder").onclick=sendOrder;
$("#clearCart").onclick=()=>{cart={};save()};
$("#ageYes").onclick=()=>{localStorage.setItem("thAge","yes");$("#ageGate").classList.add("hidden")};
$("#ageNo").onclick=()=>{window.location.href="https://www.google.com/"};
if(localStorage.getItem("thAge")==="yes")$("#ageGate").classList.add("hidden");
renderProducts();renderCart();updateCount();
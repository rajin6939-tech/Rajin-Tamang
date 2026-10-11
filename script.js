const CATEGORIES = [
  {name:"Logo Designs", short:"Logo", icon:"✳", desc:"Brand identities, marks and logo packs."},
  {name:"Banner Designs", short:"Banner", icon:"▰", desc:"Shop banners, flex and lightboard designs."},
  {name:"Certificate Designs", short:"Certificate", icon:"▤", desc:"Certificates, appreciation and award templates."},
  {name:"Visiting Cards", short:"Visiting Card", icon:"▭", desc:"Business cards and print-ready layouts."},
  {name:"Social Media Templates", short:"Social Media", icon:"▦", desc:"Posts, stories and promotional graphics."},
  {name:"Photoshop PSD Files", short:"PSD Files", icon:"◈", desc:"Editable layered Photoshop resources."}
];
const STARTER = [
 {id:"demo-1",title:"Modern Blue Brand Mark",category:"Logo Designs",format:"PNG + PSD",price:"00.00",description:"A clean blue identity concept for creative businesses.",art:"R.",label:"BRAND SYSTEM"},
 {id:"demo-2",title:"Creative Studio Banner",category:"Banner Designs",format:"PSD",price:"00.00",description:"A bold promotional layout with a clear visual hierarchy.",art:"MAKE\nIT BOLD",label:"BANNER DESIGN"},
 {id:"demo-3",title:"Classic Award Certificate",category:"Certificate Designs",format:"PDF + PSD",price:"00.00",description:"An elegant certificate layout with editable design elements.",art:"AWARD",label:"CERTIFICATE"},
 {id:"demo-4",title:"Minimal Business Card",category:"Visiting Cards",format:"PSD",price:"00.00",description:"A professional card concept for modern brands.",art:"YOUR\nBRAND",label:"BUSINESS CARD"},
 {id:"demo-5",title:"Blue Social Post Pack",category:"Social Media Templates",format:"PSD + JPG",price:"00.00",description:"Promotional social graphics for posts and campaigns.",art:"CREATE\nMORE",label:"SOCIAL TEMPLATE"},
 {id:"demo-6",title:"Layered PSD Starter",category:"Photoshop PSD Files",format:"PSD",price:"00.00",description:"A sample product card for your future editable file collection.",art:"PSD",label:"EDITABLE FILE"}
];
const $ = id => document.getElementById(id);
const STORAGE_KEY = "rajinDesignerPrototypeProductsV1";
let products = loadProducts();
function loadProducts(){try{const x=localStorage.getItem(STORAGE_KEY);return x?JSON.parse(x):STARTER.map(p=>({...p}));}catch{return STARTER.map(p=>({...p}));}}
function saveProducts(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(products));}catch{showToast("Browser storage is full. Try a smaller preview image.");}}
function escapeHTML(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderCategories(){
  $("categoryGrid").innerHTML=CATEGORIES.map(c=>`<button class="category-card" data-category="${escapeHTML(c.name)}"><span class="category-arrow">↗</span><span class="category-icon">${c.icon}</span><h3>${c.name}</h3><p>${c.desc}</p></button>`).join("");
  $("categoryFilter").innerHTML='<option value="All">All categories</option>'+CATEGORIES.map(c=>`<option>${c.name}</option>`).join("");
  $("productCategory").innerHTML=CATEGORIES.map(c=>`<option>${c.name}</option>`).join("");
}
function productCard(p,i){
 const preview=p.image?`<img src="${p.image}" alt="${escapeHTML(p.title)} preview">`:`<div class="preview-art"><small>${escapeHTML(p.label||p.format||"DESIGN RESOURCE")}</small><span class="symbol">${escapeHTML(p.art||"R.")}</span><span class="sample-label">RAJIN DESIGNER</span></div>`;
 return `<article class="product-card"><div class="product-preview">${preview}<span class="product-badge">${escapeHTML(p.format||"DESIGN FILE")}</span></div><div class="product-info"><div class="product-meta"><span>${escapeHTML((p.category||"Design").replace(" Designs",""))}</span><span>Digital asset</span></div><h3>${escapeHTML(p.title)}</h3><p>${escapeHTML(p.description||"Creative resource from RAJIN DESIGNER.")}</p><div class="product-bottom"><span class="price">Rs. ${escapeHTML(p.price||"00.00")}</span>${p.file?`<button class="download-button" data-download="${escapeHTML(p.id)}">Download ↓</button>`:`<button class="download-button" data-preview="${escapeHTML(p.id)}">View details ↗</button>`}</div></div></article>`;
}
function renderProducts(){
 const q=$("searchInput").value.trim().toLowerCase(), cat=$("categoryFilter").value;
 const filtered=products.filter(p=>(cat==="All"||p.category===cat)&&(`${p.title} ${p.category} ${p.format} ${p.description}`).toLowerCase().includes(q));
 $("productGrid").innerHTML=filtered.map(productCard).join("");
 $("emptyState").hidden=filtered.length!==0;
}
function showToast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");clearTimeout(window._toastTimer);window._toastTimer=setTimeout(()=>t.classList.remove("show"),3200);}
function fileToDataURL(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file);});}
function safeFileName(name){return name.replace(/[^\w.\- ]/g,"_");}
renderCategories();renderProducts();$("year").textContent=new Date().getFullYear();
$("searchInput").addEventListener("input",renderProducts);$("categoryFilter").addEventListener("change",renderProducts);
$("categoryGrid").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;$("categoryFilter").value=b.dataset.category;$("library").scrollIntoView({behavior:"smooth"});renderProducts();});
$("productGrid").addEventListener("click",e=>{
 const d=e.target.closest("[data-download]");if(d){const p=products.find(x=>x.id===d.dataset.download);if(!p||!p.file){showToast("No original file attached to this item yet.");return;}const a=document.createElement("a");a.href=p.file;a.download=safeFileName(p.fileName||p.title);document.body.appendChild(a);a.click();a.remove();showToast("Download started.");return;}
 const v=e.target.closest("[data-preview]");if(v){const p=products.find(x=>x.id===v.dataset.preview);if(p)showToast(`${p.title} · ${p.format} · Rs. ${p.price}`);}
});
$("productForm").addEventListener("submit",async e=>{
 e.preventDefault();
 const title=$("productTitle").value.trim(),category=$("productCategory").value,format=$("productFormat").value,price=$("productPrice").value.trim();
 if(!title||!category||!price)return;
 const imageFile=$("productImage").files[0], original=$("productFile").files[0];
 try{
  const item={id:"item-"+Date.now(),title,category,format,price,description:$("productDescription").value.trim(),art:category.includes("Logo")?"R.":category.includes("Banner")?"MAKE\nIT BOLD":category.includes("Certificate")?"AWARD":category.includes("Visiting")?"YOUR\nBRAND":category.includes("Social")?"CREATE\nMORE":"PSD",label:format.toUpperCase()};
  if(imageFile)item.image=await fileToDataURL(imageFile);
  if(original){item.file=await fileToDataURL(original);item.fileName=original.name;}
  products.unshift(item);saveProducts();renderProducts();$("productForm").reset();$("productPrice").value="00.00";$("formFeedback").textContent="Added in this browser prototype. It is not yet published to other visitors.";
  showToast("Design added to this browser.");
 }catch(err){$("formFeedback").textContent="Could not save the file. Try a smaller file or preview image.";}
});
$("resetDemo").addEventListener("click",()=>{products=STARTER.map(p=>({...p}));saveProducts();renderProducts();$("formFeedback").textContent="Demo products restored in this browser.";showToast("Demo items restored.");});
$("searchToggle").addEventListener("click",()=>{$("searchInput").focus();$("library").scrollIntoView({behavior:"smooth"});});
$("menuToggle").addEventListener("click",()=>document.querySelector(".desktop-nav").classList.toggle("open"));
document.querySelectorAll(".desktop-nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".desktop-nav").classList.remove("open")));

import { DEFAULT_THEME, SYSTEM_DARK_QUERY, THEME_ATTRIBUTE, THEME_COLORS, THEME_STORAGE_KEY } from "./constants";

/**
 * Script SÍNCRONO injetado no <head>. Roda antes da primeira pintura e define data-theme,
 * color-scheme e meta theme-color — evita o "flash" do tema errado.
 * É a ÚNICA exceção à regra "todo acesso ao localStorage passa por lib/storage/local-storage.ts":
 * não pode importar módulos, pois executa antes do bundle React.
 */
export const themeInitScript = `(function(){
  var d=document.documentElement;
  try{
    var k=${JSON.stringify(THEME_STORAGE_KEY)},p=null;
    try{p=window.localStorage.getItem(k)}catch(e){}
    if(p!=="light"&&p!=="dark"&&p!=="system")p=${JSON.stringify(DEFAULT_THEME)};
    var dark=p==="dark"||(p==="system"&&window.matchMedia(${JSON.stringify(SYSTEM_DARK_QUERY)}).matches);
    var r=dark?"dark":"light",c=${JSON.stringify(THEME_COLORS)};
    d.setAttribute(${JSON.stringify(THEME_ATTRIBUTE)},r);
    d.style.colorScheme=r;
    var m=document.querySelector('meta[name="theme-color"]');
    if(!m){m=document.createElement("meta");m.setAttribute("name","theme-color");document.head.appendChild(m)}
    m.setAttribute("content",c[r]);
  }catch(e){d.setAttribute(${JSON.stringify(THEME_ATTRIBUTE)},"dark")}
})();`;

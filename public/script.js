(() => {
  const FONT_STACKS={mono:'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',sans:'Arial, Helvetica, sans-serif',rounded:'"Trebuchet MS", "Arial Rounded MT Bold", Arial, sans-serif',serif:'Georgia, "Times New Roman", serif',condensed:'"Arial Narrow", "Roboto Condensed", Impact, sans-serif'};
  const BUILTIN_THEMES=[
    {name:"Classic Pond",colors:{background:"#CEEBB2",surface:"#E8F7D9",accent:"#639BFF",highlight:"#DF7126",ink:"#111111"}},
    {name:"Night Shift",colors:{background:"#161B22",surface:"#222B36",accent:"#7AA2F7",highlight:"#FF8A3D",ink:"#F5F7FA"}},
    {name:"Blueprint",colors:{background:"#CFE8FF",surface:"#EDF7FF",accent:"#1957D2",highlight:"#FF7A1A",ink:"#0C1830"}},
    {name:"Ink & Paper",colors:{background:"#F2E7CF",surface:"#FFF8E9",accent:"#39705B",highlight:"#C84B31",ink:"#1B1712"}}
  ];
  let C=window.HDS_CONTENT||{};
  const officePreview=new URLSearchParams(location.search).has("office-preview");
  let activeTheme=(officePreview?sessionStorage:localStorage).getItem("hds-theme")||"default";
  const all=(selector)=>document.querySelectorAll(selector);
  const setText=(key,value)=>all('[data-text="'+key+'"]').forEach((el)=>{if(value!==undefined)el.textContent=value??"";});
  const setLabel=(key,value)=>all('[data-label="'+key+'"]').forEach((el)=>{el.textContent=value??"";});
  const applyPalette=(colors)=>{if(!colors)return;const root=document.documentElement.style;root.setProperty("--pond",colors.background);root.setProperty("--pond-light",colors.surface);root.setProperty("--hat",colors.accent);root.setProperty("--bill",colors.highlight);root.setProperty("--ink",colors.ink);document.querySelector('meta[name="theme-color"]')?.setAttribute("content",colors.background);};
  const applyDesign=(design)=>{if(!design)return;applyPalette(design);const root=document.documentElement.style;root.setProperty("--body-font",FONT_STACKS[design.bodyFont]||FONT_STACKS.mono);root.setProperty("--display-font",FONT_STACKS[design.displayFont]||FONT_STACKS.sans);root.setProperty("--radius",(design.cornerRadius??0)+"px");root.setProperty("--border",(design.borderWidth??3)+"px solid "+design.ink);root.setProperty("--shadow",(design.shadowOffset??6)+"px "+(design.shadowOffset??6)+"px 0 "+design.ink);};
  const applyTypography=()=>{const styles=C.typography||{};all("[data-style]").forEach((el)=>{const rule=styles[el.dataset.style]||styles[el.dataset.styleFallback];if(!rule)return;el.style.fontFamily=FONT_STACKS[rule.font]||FONT_STACKS.mono;el.style.fontSize=rule.size+"px";el.style.letterSpacing=(rule.letterSpacing/100)+"em";el.style.lineHeight=String(rule.lineHeight);el.style.fontWeight=String(rule.weight);});};
  const themes=()=>[{name:"Studio default",colors:C.design||BUILTIN_THEMES[0].colors},...(Array.isArray(C.themes)?C.themes:BUILTIN_THEMES)];
  const renderThemePicker=()=>{const picker=document.getElementById("theme-picker");if(!picker)return;picker.innerHTML="";themes().forEach((theme,index)=>{const id=index===0?"default":theme.name;const button=document.createElement("button");button.className="theme-choice";button.type="button";button.title=theme.name;button.setAttribute("aria-label","Use "+theme.name+" colors");button.setAttribute("aria-pressed",String(activeTheme===id));button.style.setProperty("--theme-color",theme.colors.background);button.addEventListener("click",()=>{activeTheme=id;(officePreview?sessionStorage:localStorage).setItem("hds-theme",id);applyPalette(theme.colors);renderThemePicker();});picker.appendChild(button);});};
  const render=(nextContent,assets={})=>{
    C=nextContent||{};
    ["studioName","eyebrow","heroTitleTop","heroTitleBottom","heroDescription","duckNote","devlogHeading","devlogDescription","aboutHeading","aboutParagraph1","aboutParagraph2","footerJoke"].forEach((key)=>setText(key,C[key]));
    if(!C.heroTitleTop&&C.heroTitle){const parts=C.heroTitle.replace(/<[^>]+>/g,"|").split("|").filter(Boolean);setText("heroTitleTop",parts[0]);setText("heroTitleBottom",parts.at(-1));}
    Object.entries(C.labels||{}).forEach(([key,value])=>setLabel(key,value));
    if(C.pageTitle)document.title=C.pageTitle;
    if(C.metaDescription)document.querySelector('meta[name="description"]')?.setAttribute("content",C.metaDescription);
    const valuesList=document.getElementById("values-list");
    if(valuesList&&Array.isArray(C.values)){valuesList.innerHTML="";C.values.forEach((value,index)=>{const div=document.createElement("div");div.className="value";div.dataset.style="value:"+index;div.dataset.styleFallback="value";div.innerHTML="<strong>"+String(index+1).padStart(2,"0")+".</strong><span></span>";div.querySelector("span").textContent=value;valuesList.appendChild(div);});}
    const socialGrid=document.getElementById("social-grid");
    if(socialGrid&&C.socials){socialGrid.innerHTML="";Object.entries(C.socials).forEach(([key,item])=>{if(!item.url)return;const a=document.createElement("a");a.className="link-card social-link";a.dataset.link=key;a.href=item.url;a.target="_blank";a.rel="me noopener noreferrer";a.innerHTML="<span></span><small></small>";const label=a.querySelector("span");label.textContent=item.label||key;label.dataset.style="social:"+key+":label";label.dataset.styleFallback="socialLabel";const note=a.querySelector("small");note.textContent=item.note||"";note.dataset.style="social:"+key+":note";note.dataset.styleFallback="socialNote";socialGrid.appendChild(a);});}
    all('.social-link[data-link="youtube"]').forEach((el)=>{const url=C.socials?.youtube?.url;if(url){el.href=url;el.target="_blank";el.rel="noopener noreferrer";}});
    const gamesList=document.getElementById("games-list");
    if(gamesList&&Array.isArray(C.games)){gamesList.innerHTML="";C.games.forEach((game,index)=>{const id=game.id||("game-"+index);const article=document.createElement("article");article.className="game-card coming-soon";const art=document.createElement("div");art.className="game-art placeholder-art";const image=document.createElement("img");image.src=assets.headshot||game.image||"assets/duck-head.png";image.alt="";art.appendChild(image);const copy=document.createElement("div");copy.className="game-copy";const status=document.createElement("p");status.className="status";status.textContent=game.status||"";status.dataset.style="game:"+id+":status";status.dataset.styleFallback="status";const title=document.createElement("h3");title.textContent=game.title||"";title.dataset.style="game:"+id+":title";title.dataset.styleFallback="cardTitle";const description=document.createElement("p");description.textContent=game.description||"";description.dataset.style="game:"+id+":description";description.dataset.styleFallback="body";const action=document.createElement(game.url?"a":"span");action.className=game.url?"button primary":"button disabled";action.textContent=game.buttonText||(game.url?"View game":"Coming soon");action.dataset.style="game:"+id+":buttonText";action.dataset.styleFallback="heroButtons";if(game.url){action.href=game.url;action.target="_blank";action.rel="noopener noreferrer";}copy.append(status,title,description,action);article.append(art,copy);gamesList.appendChild(article);});}
    if(assets.logo)document.querySelector(".logo-frame img").src=assets.logo;
    applyDesign(C.design);const selected=themes().find((theme,index)=>(index===0?"default":theme.name)===activeTheme);if(selected)applyPalette(selected.colors);applyTypography();renderThemePicker();
  };
  document.getElementById("year").textContent=new Date().getFullYear();
  render(C);
  window.addEventListener("message",(event)=>{if(event.origin!=="https://franks-office.zimbabweplays.chatgpt.site"||event.data?.type!=="hds-office-preview")return;activeTheme="default";render(event.data.content,event.data.assets);});
})();
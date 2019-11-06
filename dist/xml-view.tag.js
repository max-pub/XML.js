
document.head.insertAdjacentHTML('beforeend',`
<template id='xml-view'>
    <style>
    :host{display: block;}
    iframe{width: 100%; height: 100%; border: none;}
</style>
    
    <iframe></iframe>

</template>
`); 

window.customElements.define('xml-view', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open', delegatesFocus: true }).appendChild(document.querySelector('template#xml-view').content.cloneNode(true));
        this.addEventListener('click',e=>{try{let n = e.composedPath()[0]; this[n.closest('[on-tap]').getAttribute('on-tap')](n.closest('[on-tap]'),e,n )}catch(x){if(this.DEBUG)console.error(e,x,e.composedPath())}} );
    }
    $(q){return this.shadowRoot.querySelector(q)}
    $$(q){return this.shadowRoot.querySelectorAll(q)}
             connectedCallback(){
            new MutationObserver(()=>{
                this.$('iframe').hidden = this.hidden;
            }).observe(this, {attributes: true}); // on hide, hide iframe too
             import('./web.min.js');
        }
        set value(text){
            // console.log('xml-value',text);
            this.show();
            // this.$('iframe').contentWindow.document.body.innerHTML = `<img class='load-indicator' src='https://samherbert.net/svg-loaders/svg-loaders/bars.svg'/>`
            this.theme = {
                dark:`
                    @import url('https://fonts.googleapis.com/css?family=Source+Code+Pro&display=swap');
                    body{tab-size: 4; -moz-tab-size: 4; font-size: 14px; white-space: pre;  font-family: 'Source Code Pro', monospace;}
                    tag,attribute,control{font-weight: bold;}

                    body{background: #333; color: white;}
                    tag{color: cornflowerblue;  }
                    attribute{color: skyblue; }
                    .date{color: lime;}
                    .number{color: orange;}
                    .undefined,.null,.NaN{color: violet;}
                    value{color: white;}
                    control{color: silver; }                
                `,
                lite:`
                    @import url('https://fonts.googleapis.com/css?family=Source+Code+Pro&display=swap');
                    body{ tab-size: 4; -moz-tab-size: 4; font-size: 14px; white-space: pre;  font-family: 'Source Code Pro', monospace;}
                    tag,attribute,control{font-weight: bold;}

                    body{background: white; color: black;}
                    tag{color: cornflowerblue;  }
                    attribute{color: skyblue; }
                    .date{color: lime;}
                    .number{color: orange;}
                    .undefined,.null,.NaN{color: violet;}
                    value{color: black;}
                    control{color: silver; }                
                `
            }
            this.$('iframe').contentWindow.document.body.innerHTML = `<style>${this.theme[this.getAttribute('theme') || 'dark']}</style>` + XML.highlight(text);

        }
        hide(){this.hidden = true; this.$('iframe').hidden = true;}
        show(){this.hidden = false; this.$('iframe').hidden = false;}
});
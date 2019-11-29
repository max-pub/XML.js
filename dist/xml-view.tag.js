
document.head.insertAdjacentHTML('beforeend',`
<template id='xml-view'>
    <style>
    :host{display: block;}
    iframe{width: 100%; height: 100%; border: none;}

    @import url('https://fonts.googleapis.com/css?family=Source+Code+Pro&amp;display=swap');
    body{tab-size: 4; -moz-tab-size: 4; font-size: 14px; white-space: pre;  font-family: 'Source Code Pro', monospace;}
    tag,attribute,control{font-weight: bold;}
    
  
    body,[theme=dark] {
        --background: #222;
        --control: gray;
        --tag: cornflowerblue;
        --attribute: skyblue;
        --content: white;
        --value: white;

        --date: mediumseagreen;
        --far-date: lightseagreen;
        --number: salmon;
        --null: violet;
        --undefined: violet;
        --true: lime;
        --false: red;

        --id: orange;
        --class: orange;
        /* --pair: #333; */
    }
    [theme=lite] {
        --background: white;
        --control: gray;
        --tag: cornflowerblue;
        --attribute: skyblue;
        --content: black;
        --value: black;
        --date: limegreen;
        --number: orange;
        --pair: #fff;
    }  

    body{background: var(--background);}
    control{color: var(--control); }   
    tag{color: var(--tag);  }
    attribute{color: var(--attribute); }
    content{color: var(--content);}
    value{color: var(--value);}
    .date{color: var(--date);}
    .far-date{color: var(--far-date);}
    .number{color: var(--number);}
    .null{color: var(--null);}
    .undefined{color: var(--undefined);}
    .true{color: var(--true);}
    .false{color: var(--false);}
    .id{color: var(--id); text-transform: uppercase;}
    .class{color: var(--class); }
    pair{background: var(--pair); border-radius: 5px; padding: 3px; margin-left: 7px;}



   
</style>
    
    <iframe></iframe>

</template>
`); 

window.customElements.define('xml-view', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open', delegatesFocus: true }).appendChild(document.querySelector('template#xml-view').content.cloneNode(true));
        this.addEventListener('click',e=>this.onTap(e));
    }
    $(q){return this.shadowRoot.querySelector(q)}
    $$(q){return this.shadowRoot.querySelectorAll(q)}
    onTap(e) {try{let n = e.composedPath()[0]; this[n.closest('[on-tap]').getAttribute('on-tap')](n.closest('[on-tap]'),e,n )}catch(x){if(this.DEBUG)console.error(e,x,e.composedPath())}}
    event(name,options){this.dispatchEvent(new CustomEvent(name, {bubbles: true, composed: true, cancelable: true, detail: options}));}
    component(name){return customElements.whenDefined(name)}
    module(name){return new Promise((resolve,reject)=>{window.addEventListener('module-'+name,resolve)});}
             async connectedCallback(){
            new MutationObserver(()=>{
                this.$('iframe').hidden = this.hidden;
            }).observe(this, {attributes: true}); // on hide, hide iframe too
            //  import('./full.min.js');
             this.XML = (await import('../dist/nice.js')).default;
            //  this.XML = await this.module('../src/nice.js');
        }
        set value(text){
            // console.log('xml-value',text);
            // this.show();
            // console.log('style',this.$('style').innerText);
            // this.$('iframe').contentWindow.document.body.innerHTML = `<img class='load-indicator' src='https://samherbert.net/svg-loaders/svg-loaders/bars.svg'/>`
            // this.theme = {
            //     dark:`
            //         @import url('https://fonts.googleapis.com/css?family=Source+Code+Pro&display=swap');
            //         body{tab-size: 4; -moz-tab-size: 4; font-size: 14px; white-space: pre;  font-family: 'Source Code Pro', monospace;}
            //         tag,attribute,control{font-weight: bold;}

            //         body{background: #333; color: white;}
            //         tag{color: cornflowerblue;  }
            //         attribute{color: skyblue; }
            //         .date{color: lime;}
            //         .number{color: orange;}
            //         .undefined,.null,.NaN{color: violet;}
            //         value{color: white;}
            //         control{color: silver; }                
            //     `,
            //     lite:`
            //         @import url('https://fonts.googleapis.com/css?family=Source+Code+Pro&display=swap');
            //         body{ tab-size: 4; -moz-tab-size: 4; font-size: 14px; white-space: pre;  font-family: 'Source Code Pro', monospace;}
            //         tag,attribute,control{font-weight: bold;}

                    // body{background: white; color: black;}
                    // tag{color: cornflowerblue;  }
                    // attribute{color: skyblue; }
                    // .date{color: lime;}
                    // .number{color: orange;}
                    // .undefined,.null,.NaN{color: violet;}
                    // value{color: black;}
                    // control{color: silver; }                
            //     `
            // }
            // this.$('iframe').contentWindow.document.body.innerHTML = `<style>${this.theme[this.getAttribute('theme') || 'dark']}</style>` + XML.highlight(text);
            this.$('iframe').contentWindow.document.body.setAttribute('theme',this.getAttribute('theme'))
            this.$('iframe').contentWindow.document.body.innerHTML = `<style>${this.$('style').innerText}</style>` + this.XML.highlight(text);
            this.$('iframe').style.height = this.$('iframe').contentWindow.document.body.offsetHeight + 20;
//             var h = document.getElementById('someDiv').clientHeight;
// var h = document.getElementById('someDiv').offsetHeight;
// var h = document.getElementById('someDiv').scrollHeight;

        }
        // hide(){this.hidden = true; this.$('iframe').hidden = true;}
        // show(){this.hidden = false; this.$('iframe').hidden = false;}
});
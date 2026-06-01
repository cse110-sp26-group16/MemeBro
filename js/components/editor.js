import { getPopularTemplates } from '../services/templates.js';

class MemebroEditor extends HTMLElement {

    constructor(){
        super();
        this.attachShadow({mode: 'open'});
        this.template = null;
    }


    async connectedCallback(){
    const params = new URLSearchParams(window.location.search);
        this.templateID = params.get('templateID');
        await this.resolveTemplate();
        this.render();
    }

    async resolveTemplate(){
        const templates = await getPopularTemplates();
        this.template = templates.find(t => t.id === this.templateID) || null;
    }

    render(){
        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                min-height: 100vh;
                background: var(--bg);
                color: var(--ink);
                overflow-x: hidden;
            }
        </style>
        <div>
            <input type="text" placeholder="Top text" />
            <img src="${this.template ? this.template.url : ''}" alt="${this.template ? this.template.name : 'No template selected'}" />
            <input type="text" placeholder="Bottom text" />
        </div>
        `;
    }    

}

customElements.define('memebro-editor', MemebroEditor);
export { MemebroEditor };
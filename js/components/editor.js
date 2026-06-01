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
            <!-- Editor content goes here -->
        </div>
        `;
    }    
}
// ==UserScript==
// @name         Boutons en haut à droite JVC
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Boutons en haut à droite, séparation de signature plus longue et bouton de citation ajusté.
// @match        https://www.jeuxvideo.com/forums/*
// @author       Knifos
// @run-at       document-start
// @updateURL    https://github.com/Knifos/Boutons-en-haut-a-droite/raw/refs/heads/main/boutons-en-haut-a-droite.user.js
// @downloadURL  https://github.com/Knifos/Boutons-en-haut-a-droite/raw/refs/heads/main/boutons-en-haut-a-droite.user.js
// @icon         https://i.ibb.co/ycJZz7s5/citation-knifos.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // 🔴 CSS immédiat
    const style = document.createElement('style');
    style.textContent = `
        .messageUser__footer {
            display: none !important;
        }
        .messageUser__separator {
            width: 100% !important;
        }
    `;
    document.documentElement.appendChild(style);
    function processMessages() {
        document.querySelectorAll('.messageUser__card').forEach(card => {
            if (card.dataset.modified === "true") return;
            const header = card.querySelector('.messageUser__header');
            const footer = card.querySelector('.messageUser__footer');
            if (!header || !footer) return;
            const citeBtn = footer.querySelector('.icon-quotes')?.closest('button');
            const groups = footer.querySelectorAll('.messageUser__groupFills');
            const moreGroup = groups[1];
            if (!citeBtn || !moreGroup) return;
            // 🔴 Container
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.marginLeft = 'auto';
            container.style.alignItems = 'center';
            // 🔴 Clones
            const citeClone = citeBtn.cloneNode(true);
            const moreClone = moreGroup.cloneNode(true);
            // 👉 marge + agrandissement
            citeClone.style.marginRight = '12px';
            citeClone.style.transform = 'scale(1.2)';
            citeClone.style.transformOrigin = 'center';
            container.appendChild(citeClone);
            container.appendChild(moreClone);
            header.appendChild(container);
            // 🔴 Supprimer footer
            footer.remove();
            card.dataset.modified = "true";
        });
    }
    // 🔁 Observer
    const observer = new MutationObserver(processMessages);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    // 🔄 Sécurité
    setInterval(processMessages, 800);
})();

// Un problème ? Une suggestion ?
// N'hésitez pas à contacter Knifos !

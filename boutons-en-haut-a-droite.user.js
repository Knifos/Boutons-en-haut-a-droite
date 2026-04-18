// ==UserScript==
// @name         Boutons en haut à droite JVC
// @namespace    http://tampermonkey.net/
// @version      1.1
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

            const groups = footer.querySelectorAll('.messageUser__groupFills');
            const firstGroup = groups[0];
            const moreGroup = groups[1];
            if (!firstGroup) return;

            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.marginLeft = 'auto';
            container.style.alignItems = 'center';

            // 🔴 Clone du premier groupe (citer + autres boutons éventuels)
            const firstClone = firstGroup.cloneNode(true);
            firstClone.querySelectorAll('button').forEach((btn, i) => {
                const originalBtn = firstGroup.querySelectorAll('button')[i];
                // Agrandir le bouton citer
                if (originalBtn?.querySelector('.icon-quotes')) {
                    btn.style.transform = 'scale(1.2)';
                    btn.style.transformOrigin = 'center';
                    if (firstGroup.querySelectorAll('button').length > 1) {
                        btn.querySelector('.icon-quotes')?.style.setProperty('margin-right', '4px');
                    }
                }
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    originalBtn?.click();
                });
            });
            firstClone.style.marginRight = '12px';
            container.appendChild(firstClone);

            // 🔴 Clone du groupe "more" (signaler etc.) si présent
            if (moreGroup) {
                const moreClone = moreGroup.cloneNode(true);
                moreClone.querySelectorAll('button').forEach((btn, i) => {
                    const originalBtn = moreGroup.querySelectorAll('button')[i];
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        originalBtn?.click();
                    });
                });
                container.appendChild(moreClone);
            }

            header.appendChild(container);
            card.dataset.modified = "true";
        });
    }

    const observer = new MutationObserver(processMessages);
    observer.observe(document.documentElement, { childList: true, subtree: true });

})();

// Un problème ? Une suggestion ?
// N'hésitez pas à contacter Knifos !

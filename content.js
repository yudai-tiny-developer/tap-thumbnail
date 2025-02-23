main(document.querySelector('ytd-app') ?? document.body);

function main(app) {
    let player;
    let thumbnail_button;
    let thumbnail_container;
    let thumbnail;

    function loadSettings() {
        player = player ?? app.querySelector('div#movie_player');
        if (!player) {
            return false;
        }

        const area = player.querySelector('div.ytp-right-controls');
        if (!area) {
            return false;
        }

        const panel = area.querySelector('button.ytp-settings-button');
        if (!panel) {
            return false;
        }

        update_buttons(area, panel);

        return true;
    }

    function update_buttons(area, panel) {
        if (!thumbnail_button) {
            thumbnail_button = document.createElement('button');
            thumbnail_button.classList.add('_tap_thumbnail_button', 'ytp-button');
            thumbnail_button.innerHTML = '<svg viewBox="0 0 512 512" style="width: 100%; height: 100%;" transform="scale(0.5 0.5)"><g><path d="M0,0v512h512V0H0z M163.15,120.064c28.778,0,52.101,23.331,52.101,52.11s-23.323,52.11-52.101,52.11 c-28.777,0-52.109-23.331-52.109-52.11S134.372,120.064,163.15,120.064z M454.417,386.525c-1.789,3.325-5.267,5.411-9.05,5.411 H66.633c-3.774,0-7.244-2.067-9.041-5.392c-1.798-3.326-1.627-7.37,0.449-10.525l66.248-100.939 c4.394-6.695,11.657-10.965,19.646-11.531c8-0.566,15.792,2.625,21.094,8.637l45.693,51.786l82.793-125.996 c4.745-7.217,12.807-11.576,21.444-11.585c8.637-0.009,16.708,4.332,21.463,11.54L453.95,375.992 C456.034,379.156,456.215,383.2,454.417,386.525z"></path></g></svg>';
            thumbnail_button.addEventListener('click', shortcut_command_show);
        }

        if (!thumbnail_container) {
            thumbnail_container = document.createElement('div');
            thumbnail_container.classList.add('_tap_thumbnail_button');
        }

        if (!thumbnail) {
            thumbnail = document.createElement('input');
            thumbnail.type = 'image';
            thumbnail.classList.add('_tap_thumbnail_button');

            thumbnail.addEventListener('load', () => {
                thumbnail.style.filter = 'contrast(1)';
            });

            thumbnail.addEventListener('click', shortcut_command_hide);
            thumbnail.addEventListener('blur', shortcut_command_hide);
            thumbnail.addEventListener('mouseout', shortcut_command_hide);
            thumbnail.addEventListener('contextmenu', e => { e.stopPropagation(); });
        }

        thumbnail_container.appendChild(thumbnail);
        area.insertBefore(thumbnail_button, panel);
        player.appendChild(thumbnail_container);
    }

    function getRelativeRect(node, parent) {
        const n = node.getBoundingClientRect();
        const p = parent.getBoundingClientRect();
        return DOMRect.fromRect({
            x: n.x - p.x,
            y: n.y - p.y,
            width: n.width,
            height: n.height,
        });
    }

    const shortcut_command_show = () => {
        if (player && thumbnail_button && thumbnail_container && thumbnail) {
            thumbnail.style.filter = 'contrast(0)';
            document.dispatchEvent(new CustomEvent('_tap_thumbnail_show'));

            Object.assign(thumbnail_container.style, {
                left: '0px',
                top: '0px',
                visibility: 'hidden',
                display: 'block',
            });

            const player_rect = player.getBoundingClientRect();
            const button_rect = getRelativeRect(thumbnail_button, player);

            Object.assign(thumbnail_container.style, {
                left: `${Math.max(Math.min(button_rect.left + button_rect.width / 2 - 320, player_rect.width - 640), 0)}px`,
                top: `${Math.max(Math.min(button_rect.bottom - 360, player_rect.height - 360), 0)}px`,
                visibility: '',
                opacity: 1,
            });

            thumbnail.focus({ preventScroll: true, focusVisible: false });
        }
    };

    const shortcut_command_hide = () => {
        if (thumbnail_container) {
            Object.assign(thumbnail_container.style, {
                display: '',
                opacity: 0,
            });
        }
    };

    document.body.addEventListener('mouseleave', shortcut_command_hide);

    chrome.runtime.onMessage.addListener(() => {
        if (thumbnail_container) {
            if (thumbnail_container.style.display === '') {
                shortcut_command_show();
            } else {
                shortcut_command_hide();
            }
        }
    });

    document.addEventListener('_tap_thumbnail_init', e => {
        const interval = setInterval(() => {
            if (loadSettings()) {
                clearInterval(interval);
            }
        }, 200);
    });

    const s = document.createElement('script');
    s.src = chrome.runtime.getURL('inject.js');
    s.onload = () => s.remove();
    (document.head || document.documentElement).append(s);
}
main();

function main() {
    function isEmbed(url) {
        return url.startsWith('https://www.youtube.com/embed/')
            || url.startsWith('https://www.youtube-nocookie.com/embed/')
            ;
    }

    function create_button() {
        const button = document.createElement('button');
        button.classList.add('_tap_thumbnail_button', 'ytp-button');
        button.innerHTML = '<svg viewBox="0 0 512 512" style="width: 100%; height: 100%; padding: 0; transform: scale(0.5);"><g><path d="M0,0v512h512V0H0z M163.15,120.064c28.778,0,52.101,23.331,52.101,52.11s-23.323,52.11-52.101,52.11 c-28.777,0-52.109-23.331-52.109-52.11S134.372,120.064,163.15,120.064z M454.417,386.525c-1.789,3.325-5.267,5.411-9.05,5.411 H66.633c-3.774,0-7.244-2.067-9.041-5.392c-1.798-3.326-1.627-7.37,0.449-10.525l66.248-100.939 c4.394-6.695,11.657-10.965,19.646-11.531c8-0.566,15.792,2.625,21.094,8.637l45.693,51.786l82.793-125.996 c4.745-7.217,12.807-11.576,21.444-11.585c8.637-0.009,16.708,4.332,21.463,11.54L453.95,375.992 C456.034,379.156,456.215,383.2,454.417,386.525z"></path></g></svg>';
        button.addEventListener('click', shortcut_command_show);
        return button;
    }

    function create_container() {
        const div = document.createElement('div');
        div.classList.add('_tap_thumbnail_button');
        return div;
    }

    function create_thumbnail() {
        const input = document.createElement('input');
        input.type = 'image';
        input.id = '_tap_thumbnail_button';
        input.addEventListener('load', () => {
            input.style.filter = 'contrast(1)';
        });
        input.addEventListener('click', shortcut_command_hide);
        input.addEventListener('blur', shortcut_command_hide);
        input.addEventListener('mouseout', shortcut_command_hide);
        input.addEventListener('contextmenu', e => { e.stopPropagation(); });
        container.appendChild(input);
        return input;
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

    function append_button() {
        function append_button_internal() {
            const slate = player.querySelector('div.ytp-offline-slate');
            if (slate && getComputedStyle(slate).display !== 'none') {
                const area = slate.querySelector('div.ytp-offline-slate-bar');
                if (!area) return;

                if (button.style.width !== '56px') {
                    Object.assign(button.style, {
                        width: '56px',
                        height: '56px',
                    });
                }

                if (!area.contains(button)) {
                    area.appendChild(button);
                }
            } else if (isEmbed(location.href)) {
                const area = document.getElementsByTagName('player-fullscreen-action-menu')[0]?.querySelector('div.quick-actions-wrapper');
                if (!area) return;

                if (button.style.width !== '40px') {
                    Object.assign(button.style, {
                        width: '40px',
                        height: '40px',
                    });
                }

                if (!area.contains(button)) {
                    area.insertBefore(button, area.firstChild);
                }
            } else {
                const area = player.querySelector('div.ytp-right-controls');
                if (!area) return;

                if (button.style.width !== '40px') {
                    Object.assign(button.style, {
                        width: '40px',
                        height: '40px',
                    });
                }

                if (!area.contains(button)) {
                    area.insertBefore(button, area.firstChild);
                }
            }
        }

        clearInterval(append_button_interval);
        append_button_interval = setInterval(append_button_internal, 500);
        append_button_internal();
    }

    function append_container() {
        if (isEmbed(location.href)) {
            player.parentElement.appendChild(container);
        } else {
            player.appendChild(container);
        }
    }

    function shortcut_command() {
        if (container.style.display === '') {
            shortcut_command_show();
        } else {
            shortcut_command_hide();
        }
    }

    function shortcut_command_show() {
        if (player) {
            thumbnail.style.filter = 'contrast(0)';
            document.dispatchEvent(new CustomEvent('_tap_thumbnail_show'));

            Object.assign(container.style, {
                left: '0px',
                top: '0px',
                visibility: 'hidden',
                display: 'block',
            });

            const player_rect = player.getBoundingClientRect();
            let button_rect = getRelativeRect(button, player);

            Object.assign(container.style, {
                left: `${Math.max(Math.min(button_rect.left + button_rect.width / 2 - 320, player_rect.width - 640), 0)}px`,
                top: `${Math.max(Math.min(button_rect.bottom - 360, player_rect.height - 360), 0)}px`,
                visibility: '',
                opacity: 1,
            });

            thumbnail.focus({ preventScroll: true, focusVisible: false });
        }
    };

    function shortcut_command_hide() {
        Object.assign(container.style, {
            display: '',
            opacity: 0,
        });
    };

    const button = create_button();
    const container = create_container();
    const thumbnail = create_thumbnail();

    let player;
    let detect_interval;
    let append_button_interval;

    document.addEventListener('_tap_thumbnail_init', () => {
        clearInterval(detect_interval);
        detect_interval = setInterval(() => {
            player = document.getElementById("movie_player");
            if (!player) return;

            clearInterval(detect_interval);

            append_button();
            append_container();
            chrome.runtime.onMessage.addListener(shortcut_command);
            document.body.addEventListener('mouseleave', shortcut_command_hide);
        }, 500);
    });

    const s = document.createElement('script');
    s.src = chrome.runtime.getURL('inject.js');
    s.onload = () => s.remove();
    (document.head || document.documentElement).append(s);
}
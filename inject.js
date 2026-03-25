(() => {
    function set_src(thumbnail, url) {
        http.open('HEAD', url, false);
        http.send();
        if (http.status === 200) {
            thumbnail.src = url;
            return true;
        } else {
            return false;
        }
    }

    const http = new XMLHttpRequest();

    let player;

    document.addEventListener('_tap_thumbnail_show', () => {
        if (player) {
            const video_id = player.getVideoData()?.video_id;
            if (video_id) {
                const thumbnail = document.getElementById('_tap_thumbnail_button');
                thumbnail && (
                    set_src(thumbnail, `https://i.ytimg.com/vi/${video_id}/maxresdefault.jpg`) ||
                    set_src(thumbnail, `https://i.ytimg.com/vi/${video_id}/sddefault.jpg`) ||
                    set_src(thumbnail, `https://i.ytimg.com/vi/${video_id}/hqdefault.jpg`) ||
                    set_src(thumbnail, `https://i.ytimg.com/vi/${video_id}/mqdefault.jpg`) ||
                    set_src(thumbnail, `https://i.ytimg.com/vi/${video_id}/default.jpg`) ||
                    set_src(thumbnail, '')
                );
            }
        }
    });

    const detect_interval = setInterval(() => {
        player = document.getElementById("movie_player");
        if (!player) return;

        clearInterval(detect_interval);

        document.dispatchEvent(new CustomEvent('_tap_thumbnail_init'));
    }, 500);
})();
(() => {
    const http = new XMLHttpRequest();
    let player;
    let thumbnail;

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

    document.addEventListener('_tap_thumbnail_show', e => {
        player = player ?? document.querySelector('div#movie_player');
        if (player) {
            const video_id = player.getVideoData()?.video_id;
            if (video_id) {
                thumbnail = thumbnail ?? player.querySelector('input._tap_thumbnail_button');
                thumbnail && (
                    set_src(thumbnail, `https://i.ytimg.com/vi/${video_id}/maxresdefault.jpg`) ||
                    set_src(thumbnail, `https://i.ytimg.com/vi/${video_id}/sddefault.jpg`) ||
                    set_src(thumbnail, `https://i.ytimg.com/vi/${video_id}/hqdefault`) ||
                    set_src(thumbnail, `https://i.ytimg.com/vi/${video_id}/mqdefault.jpg`) ||
                    set_src(thumbnail, `https://i.ytimg.com/vi/${video_id}/default.jpg`) ||
                    set_src(thumbnail, '')
                );
            }
        }
    });

    document.dispatchEvent(new CustomEvent('_tap_thumbnail_init'));
})();
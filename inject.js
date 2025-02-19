(() => {
    const app = document.querySelector('ytd-app') ?? document.body;
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
        player = player ?? app.querySelector('div#movie_player');
        if (player) {
            const video_id = player.getVideoData()?.video_id;
            if (video_id) {
                thumbnail = thumbnail ?? player.querySelector('input._tap_thumbnail_button');
                if (thumbnail) {
                    if (set_src(thumbnail, `https://i.ytimg.com/vi/${video_id}/maxresdefault.jpg`)) {
                        return;
                    } else if (set_src(thumbnail, `https://i.ytimg.com/vi/${video_id}/sddefault.jpg`)) {
                        return;
                    } else if (set_src(thumbnail, `https://i.ytimg.com/vi/${video_id}/hqdefault`)) {
                        return;
                    } else if (set_src(thumbnail, `https://i.ytimg.com/vi/${video_id}/mqdefault.jpg`)) {
                        return;
                    } else if (set_src(thumbnail, `https://i.ytimg.com/vi/${video_id}/default.jpg`)) {
                        return;
                    } else {
                        set_src(thumbnail, '');
                    }
                }
            }
        }
    });
})();
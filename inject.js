const _tap_thumbnail_app = document.querySelector('ytd-app') ?? document.body;

const _tap_thumbnail_http = new XMLHttpRequest();

function _tap_thumbnail_change_src(thumbnail, url) {
    _tap_thumbnail_http.open('HEAD', url, false);
    _tap_thumbnail_http.send();
    if (_tap_thumbnail_http.status === 200) {
        thumbnail.src = url;
        return true;
    } else {
        return false;
    }
}

document.addEventListener('_tap_thumbnail_show', e => {
    const player = _tap_thumbnail_app.querySelector('div#movie_player');
    if (player) {
        const video_id = player.getVideoData()?.video_id;
        if (video_id) {
            const thumbnail = _tap_thumbnail_app.querySelector('input._tap_thumbnail_button');
            if (thumbnail) {
                if (_tap_thumbnail_change_src(thumbnail, `https://i.ytimg.com/vi/${video_id}/maxresdefault.jpg`)) {
                    return;
                } else if (_tap_thumbnail_change_src(thumbnail, `https://i.ytimg.com/vi/${video_id}/sddefault.jpg`)) {
                    return;
                } else if (_tap_thumbnail_change_src(thumbnail, `https://i.ytimg.com/vi/${video_id}/hqdefault`)) {
                    return;
                } else if (_tap_thumbnail_change_src(thumbnail, `https://i.ytimg.com/vi/${video_id}/mqdefault.jpg`)) {
                    return;
                } else if (_tap_thumbnail_change_src(thumbnail, `https://i.ytimg.com/vi/${video_id}/default.jpg`)) {
                    return;
                } else {
                    _tap_thumbnail_change_src(thumbnail, '');
                }
            }
        }
    }
});
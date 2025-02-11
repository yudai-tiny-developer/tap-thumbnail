const _tap_thumbnail_app = document.querySelector('ytd-app') ?? document.body;

document.addEventListener('_tap_thumbnail', e => {
    const player = _tap_thumbnail_app.querySelector('div#movie_player');
    if (player) {
        const video_id = player.getVideoData()?.video_id;
        if (video_id) {
            window.open(`https://i.ytimg.com/vi/${video_id}/maxresdefault.jpg`);
        }
    }
});
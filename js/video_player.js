class VideoPlayerBasic {
    constructor(settings) {
      this._settings = Object.assign(VideoPlayerBasic.getDefaultSettings(), settings);
      this._videoContainer = null;
      this._video = null;
      this._toggleBtn = null;
      this._progress = null;
      this._mouseDown = false;
      this._skipNext = null;
      this._skipPrev = null;
      this._volume = null;
      this._playbackRate = null;
    }

    init() {
      // Проверить передані ли  видео и контейнер
      if (!this._settings.videoUrl) return console.error("Передайте адрес видео");
      if (!this._settings.videoPlayerContainer) return console.error("Передайте селектор контейнера");
      
      // Создадим разметку и добавим ее на страницу
      this._addTemplate();
      // Найти все элементы управления
      this._setElements();
      // Установить обработчики событий
      this._setEvents();
    }

    toggle() {
      const method = this._video.paused ? 'play' : 'pause';
      this._toggleBtn.textContent = this._video.paused ? '❚ ❚' :  '►';
      this._video[method]();
    }

    _handlerProgress() {
      const percent = (this._video.currentTime / this._video.duration) * 100;
      this._progress.style.flexBasis = `${percent}%`;
    }

    _scrub(e) {
      this._video.currentTime = (e.offsetX / this._progressContainer.offsetWidth) * this._video.duration;
    }

    _skip(flag) {
      if (flag) this._video.currentTime += this._settings.skipNext;
      else this._video.currentTime += this._settings.skipPrev;
    }
    _changeVolume() {
      this._video.volume = this._volume.value;
    }
    _changePlaybackRate() {
      this._video.playbackRate = this._playbackRate.value;
    }

    _setElements() {
      this._videoContainer = document.querySelector(this._settings.videoPlayerContainer);
      this._video = this._videoContainer.querySelector('video');
      this._toggleBtn = this._videoContainer.querySelector('.toggle');
      this._progress = this._videoContainer.querySelector('.progress__filled');
      this._progressContainer = this._videoContainer.querySelector('.progress');
      this._skipPrev = this._videoContainer.querySelector(`[data-skip="${this._settings.skipPrev}"]`);
      this._skipNext = this._videoContainer.querySelector(`[data-skip="${this._settings.skipNext}"]`);
      this._volume = this._videoContainer.querySelector("[name='volume']");
      this._playbackRate = this._videoContainer.querySelector("[name='playbackRate']");      
    }

    _setEvents() {
      this._video.addEventListener('click', () => this.toggle());
      this._toggleBtn.addEventListener('click', () => this.toggle());
      this._video.addEventListener('timeupdate', () => this._handlerProgress());
      this._progressContainer.addEventListener('click', (e) => this._scrub(e));
      this._progressContainer.addEventListener('mousemove', (e) => this._mouseDown && this._scrub(e));
      this._progressContainer.addEventListener('mousedown', (e) => this._mouseDown = true);
      this._progressContainer.addEventListener('mouseup', (e) => this._mouseDown = false);
      this._progressContainer.addEventListener('mouseleave', (e) => this._mouseDown = false);
      this._skipNext.addEventListener('click', () => this._skip(true));
      this._skipPrev.addEventListener('click', () => this._skip(false));
      this._video.addEventListener('dblclick', (e) => this._skip((this._video.offsetWidth / 2) < e.offsetX));
      this._volume.addEventListener('input', () => this._changeVolume());
      this._playbackRate.addEventListener('input', () => this._changePlaybackRate());
    }

    _addTemplate() {
      const template = this._createVideoTemplate();
      const container = document.querySelector(this._settings.videoPlayerContainer);
      container ? container.insertAdjacentHTML("afterbegin", template) : console.error('контейнер не найден');
    }

    _createVideoTemplate() {
      return `
      <div class="player">
        <video class="player__video viewer" src="${this._settings.videoUrl}"> </video>
        <div class="player__controls">
          <div class="progress">
          <div class="progress__filled"></div>
          </div>
          <button class="player__button toggle" title="Toggle Play">►</button>
          <input type="range" name="volume" class="player__slider" min="${this._settings.volumeMin}" max="${this._settings.volumeMax}" step="${this._settings.volumeStep}" value="${this._settings.volume}">
          <input type="range" name="playbackRate" class="player__slider" min="${this._settings.playbackRateMin}" max="${this._settings.playbackRateMax}" step="${this._settings.playbackRateStep}" value="${this._settings.playbackRate}">
          <button data-skip="${this._settings.skipPrev}" class="player__button">« ${this._settings.skipPrev}s</button>
          <button data-skip="${this._settings.skipNext}" class="player__button">${this._settings.skipNext}s »</button>
        </div>
      </div>
      `;
    }

    static getDefaultSettings() {
        /**
         * Список настроек
         * - адрес видео
         * - тип плеера "basic", "pro"
         * - controls - true, false
         */
        return {
          videoUrl: '',
          videoPlayerContainer: '.myplayer',
          volume: 1,
          volumeMax: 1,
          volumeMin: 0,
          volumeStep: 0.05,
          skipNext: 1,
          skipPrev: -1,
          playbackRate: 1,
          playbackRateMax: 2,
          playbackRateMin: 0.5,
          playbackRateStep: 0.1
        }
    }
}

const myPlayer = new VideoPlayerBasic({
  videoUrl: 'video/mov_bbb.mp4',
  videoPlayerContainer: 'body',
  skipNext: 3,
  skipPrev: -2
});

myPlayer.init();
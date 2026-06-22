class AudioPlayer {
    constructor(tracks) {
        this.tracks = tracks;
        this.currentIndex = 0;
        this.isPlaying = false;
        this.isShuffle = false;
        this.repeatMode = 0;
        this.isMuted = false;

        this.audio = document.getElementById("player");
        this.playPauseBtn = document.querySelector(".play-pause");
        this.prevBtn = document.querySelector(".prev");
        this.nextBtn = document.querySelector(".next");
        this.shuffleBtn = document.querySelector(".shuffle");
        this.repeatBtn = document.querySelector(".repeat");
        this.progressBar = document.getElementById("progressBar");
        this.nameTrack = document.querySelector(".nameTrack");
        this.timeDisplay = document.querySelector(".time");
        this.volumeBtn = document.querySelector(".volume-icon");

        this.bindEvents();
        this.loadTrack(this.currentIndex);
    }

    bindEvents() {
        this.audio.addEventListener("play", () => this.onPlay());
        this.audio.addEventListener("pause", () => this.onPause());
        this.audio.addEventListener("ended", () => this.onEnded());
        this.audio.addEventListener("timeupdate", () => this.onTimeUpdate());

        this.playPauseBtn.addEventListener("click", () => this.togglePlay());
        this.nextBtn.addEventListener("click", () => this.playNext());
        this.prevBtn.addEventListener("click", () => this.playPrev());
        this.shuffleBtn.addEventListener("click", () => this.toggleShuffle());
        this.repeatBtn.addEventListener("click", () => this.toggleRepeat());
        this.volumeBtn.addEventListener("click", () => this.toggleMute());
        this.progressBar.addEventListener("input", () => this.seek());
    }

    loadTrack(index) {
        if (index < 0) index = this.tracks.length - 1;
        if (index >= this.tracks.length) index = 0;
        this.currentIndex = index;
        this.audio.src = this.tracks[this.currentIndex].src;
        this.nameTrack.textContent = this.tracks[this.currentIndex].title;
        this.progressBar.value = 0;
        this.timeDisplay.textContent = "00:00/0:00";
    }

    togglePlay() {
        this.isPlaying ? this.audio.pause() : this.audio.play();
    }

    playNext() {
        let next;
        if (this.isShuffle) {
            do { next = Math.floor(Math.random() * this.tracks.length); }
            while (next === this.currentIndex && this.tracks.length > 1);
        } else {
            next = this.currentIndex + 1;
        }
        this.loadTrack(next);
        if (this.isPlaying) this.audio.play();
    }

    playPrev() {
        if (this.audio.currentTime > 3) {
            this.audio.currentTime = 0;
            return;
        }
        this.loadTrack(this.currentIndex - 1);
        if (this.isPlaying) this.audio.play();
    }

    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        this.shuffleBtn.classList.toggle("active", this.isShuffle);
    }

    toggleRepeat() {
        this.repeatMode = (this.repeatMode + 1) % 3;
        this.repeatBtn.classList.toggle("active", this.repeatMode > 0);
        this.repeatBtn.setAttribute("data-mode", this.repeatMode || "");
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.audio.muted = this.isMuted;
        this.volumeBtn.classList.toggle("muted", this.isMuted);
    }

    seek() {
        if (this.audio.duration) {
            this.audio.currentTime = (this.progressBar.value / 100) * this.audio.duration;
        }
    }

    onPlay() {
        this.isPlaying = true;
        this.playPauseBtn.classList.add("playing");
    }

    onPause() {
        this.isPlaying = false;
        this.playPauseBtn.classList.remove("playing");
    }

    onEnded() {
        if (this.repeatMode === 1) {
            this.audio.currentTime = 0;
            this.audio.play();
        } else if (this.repeatMode === 2 || this.currentIndex < this.tracks.length - 1 || this.isShuffle) {
            this.playNext();
        } else {
            this.isPlaying = false;
            this.playPauseBtn.classList.remove("playing");
        }
    }

    onTimeUpdate() {
        if (this.audio.duration) {
            this.progressBar.value = (this.audio.currentTime / this.audio.duration) * 100;
            this.timeDisplay.textContent = `${this.formatTime(this.audio.currentTime)}/${this.formatTime(this.audio.duration)}`;
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return "00:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
}

new AudioPlayer([
    { title: "Трек 1", src: "music/track1.mp3" },
]);

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'PLAYER';

const player = $('.player');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playlist = $('.playlist');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBnt = $('.btn-next');
const preBtn = $('.btn-pre');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist');

const app = { //Object

    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    songs: [
        {
            name: "Cố Giang Tình",
            singer: "X2X",
            path: "./assets/music/CoGiangTinh-X2X-6257264.mp3",
            img: "./assets/img/Img_music/img_music_1.jpg",
        },

        {
            name: "Cô Thắm Không Về",
            singer: "Phat Ho, Jokes",
            path: "./assets/music/CoThamKhongVe-PhatHoJokesBiiThien-6067247.mp3",
            img: "./assets/img/Img_music/img_music_2.jpg",
        },

        {
            name: "Độ Tộc 2",
            singer: "Masew, DoMixi, PhucDu, Phao",
            path: "./assets/music/DoToc2-MasewDoMixiPhucDuPhao-7064730.mp3",
            img: "./assets/img/Img_music/img_do_toc_2.jpg",
        },

        {
            name: "Gác Lại Âu Lo",
            singer: "DaLAB, MiuLe",
            path: "./assets/music/GacLaiAuLo-DaLABMiuLe-6360815.mp3",
            img: "./assets/img/Img_music/img_gac_lai_au_lo.jpg",
        },

        {
            name: "Mình cưới nhau đi",
            singer: "HuynhJames, Pjnboys",
            path: "./assets/music/MinhCuoiNhauDi-HuynhJamesPjnboys-5382380.mp3",
            img: "./assets/img/Img_music/img_minh_cuoi_nhau_di.jpg",
        },

        {
            name: "Nguoi-Am-Phu-EDM-Version",
            singer: "OSAD, Khanh Vy",
            path: "./assets/music/Nguoi-Am-Phu-EDM-Version-OSAD-Khanh-Vy.mp3",
            img: "./assets/img/Img_music/img_nguoi_am_phu.jpg",
        },

        {
            name: "Take Me Hand",
            singer: "Daishi",
            path: "./assets/music/Take-Me-Hand-Daishi-Dance.mp3",
            img: "./assets/img/Img_music/img_take_me_hand.jpg",
        },

        {
            name: "Vách Ngọc Nga",
            singer: "AnhRong",
            path: "./assets/music/VachNgocNga-AnhRong-6984991.mp3",
            img: "./assets/img/Img_music/img_vach_ngoc_nga.jpg",
        },
    ],

    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb"
                style="background-image: url('${song.img}');">

                </div>

                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>

                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })

        playList.innerHTML = htmls.join('');
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function () { // Ham xu ly su kien

        const _this = this;

        // console.log([cd]);
        const cdWidth = cd.offsetWidth;

        // Xử lý phóng to thu nhở.
        // document.onscroll = function () {
        //     const scrollTop = window.scrollY || document.documentElement.scrollTop;
        //     const newCDWidth = cdWidth - scrollTop;

        //     cd.style.width = newCDWidth > 0 ? newCDWidth + 'px' : 0;
        //     cd.style.opacity = newCDWidth / cdWidth;

        // }

        // Xử lý CD quay / Dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, //10s
            iterations: Infinity,
        })
        cdThumbAnimate.pause();

        // Xử lý khi click play
        playBtn.onclick = function () {

            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // Khi bài hát được play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // Khi bài hát pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // Xu ly khi tua Song
        progress.oninput = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // Khi next song
        nextBnt.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Khi pre song
        preBtn.onclick = function () {

            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.preSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Khi Bam vao nut Random bat /tat
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // Xử lý 1 bài hát lặp lại
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // Xu ly next khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBnt.click();
            }
        }

        // Lắng nghe hành vi Chọn bài hát
        playList.onclick = function (e) {

            const songNode = e.target.closest('.song:not(.active)');

            if (songNode || !e.target.closest('.option')) {

                // Xử lý khi click vao song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                // Xu ly khi click vao song option
            }
        }

    },

    scrollToActiveSong: function () {
        setTimeout(() => {

            if (this.currentIndex == 0) {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                });
            } else {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            }
        }, 200);
    },

    loadCurrentSong: function () {

        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.path;

    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;

        // Object.assign(this, this.config); //C2
    },

    // Next Song
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    // Pre Song
    preSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    // playRandomSong
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function () {//Phuong thuc start

        //Gán cấu hình từ config vào ứng dụng
        this.loadConfig()

        // Dinh nghia cac thuoc tinh cho Object
        this.defineProperties();

        //Lắng nghe / xử lý các sự kiện
        this.handleEvents();

        //Tải bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // Render các bài hát
        this.render();

        //Hiển thị trạng thái ban đầu của button repeat và random
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
};

app.start();
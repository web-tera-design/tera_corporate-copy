
// outerWidthが375px以下のとき viewportを375固定に
!(function () {
  const viewport = document.querySelector('meta[name="viewport"]');
  function switchViewport() {
    const value =
      window.outerWidth > 375
        ? 'width=device-width,initial-scale=1'
        : 'width=375';
    if (viewport.getAttribute('content') !== value) {
      viewport.setAttribute('content', value);
    }
  }
  addEventListener('resize', switchViewport, false);
  switchViewport();
})();


// DOMの読み込み完了後に実行
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.header__nav-link');
  const currentPath = location.pathname.replace(/\/$/, ''); // 最後のスラッシュを除去

  links.forEach(link => {
    const linkPath = link.getAttribute('href')?.replace(/\/$/, '');
    if (linkPath && linkPath === currentPath) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page'); // ← アクセシビリティのために追加
    }
  });
});



// ドロワー
document.addEventListener('DOMContentLoaded', () => {
  const drawer = document.querySelector('.drawer');
  const drawerIcon = document.querySelector('.drawer-icon');
  const body = document.body;
  let isMenuOpen = false;

  if (!drawer || !drawerIcon) return;

  // 初期状態（非表示）
  drawer.style.opacity = '0';
  drawer.style.visibility = 'hidden';
  drawer.style.transform = 'translateX(100%)'; // 上からスライド
  drawer.style.overflow = 'hidden';
  drawer.style.transition = 'all 0.7s ease-out';

  const openMenu = () => {
    isMenuOpen = true;
    drawer.classList.add("js-show");
    drawerIcon.classList.add("js-show"); // 追加
    drawer.style.opacity = "1";
    drawer.style.visibility = "visible";
    drawer.style.transform = "translateX(0)";
    body.style.overflow = "hidden"; // スクロールを防止
    drawerIcon.setAttribute("aria-expanded", "true"); // アクセシビリティ対応
  };

  const closeMenu = () => {
    isMenuOpen = false;
    drawer.classList.remove("js-show");
    drawerIcon.classList.remove("js-show"); // 追加
    drawer.style.opacity = "0";
    drawer.style.visibility = "hidden";
    drawer.style.transform = "translateX(100%)";
    body.style.overflow = ""; // スクロール解除
    drawerIcon.setAttribute("aria-expanded", "false"); // アクセシビリティ対応
  };

  drawerIcon.addEventListener('click', () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // 画面リサイズ時に開いていたら閉じる
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && isMenuOpen) {
      closeMenu();
    }
  });

  // メニュー外クリックで閉じる
  document.addEventListener("click", (event) => {
    if (!drawer.contains(event.target) && !drawerIcon.contains(event.target) && isMenuOpen) {
      closeMenu();
    }
  });

  // ESCキーでメニューを閉じる
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isMenuOpen) {
      closeMenu();
    }
  });

  // ページ内リンククリック時のスクロール処理
  document.querySelectorAll('.drawer__item-link').forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });

      closeMenu();
    });
  });
});

// サイト表示までのロゴ制御とswiper==========================================
document.addEventListener("DOMContentLoaded", () => {
  // ✅ Swiperスライド内のテキストを取得
  const swiperTexts = document.querySelectorAll(".swiper-slide__text");

  // ✅ 一文字ずつ出現の関数
  function startTypingAnimation(target, delay = 0) {
    const headings = target.querySelectorAll(".swiper-slide__heading, .swiper-slide__sub");

    const globalStartDelay = 1.5; // ✅← ここ追加（スライド全体に0.5秒の開始ディレイ）


    headings.forEach((heading, index) => {
      const text = heading.innerText; // ✅ 元のテキストを取得
      heading.innerHTML = ""; // ✅ 文字をクリアしてから挿入
      text.split("").forEach((char, charIndex) => {
        const span = document.createElement("span");
        span.innerText = char;

        // ✅ heading と sub にラグを入れる
        const extraDelay = index === 1 ? 1.5 : 0; // ✅ sub だけ遅延
        // ✅ 修正：globalStartDelay を加える
        span.style.animationDelay = `${charIndex * 0.15 + extraDelay + globalStartDelay}s`;
        heading.appendChild(span);
      });
    });
  }

  // ✅ ★追加：スライド画像にGSAPアニメーションを適用
  function animateSlideImage() {
    const currentImg = document.querySelector('.swiper-slide-active .slide-img');
    if (!currentImg) return;

    gsap.set(currentImg, {
      yPercent: -100,
      opacity: 0,
    });

    gsap.to(currentImg, {
      yPercent: 0,
      opacity: 1,
      duration: 4.0,
      ease: 'power2.out',
    });
  }

  // ✅ トップビジュアルの全テキストに適用
  swiperTexts.forEach((text) => {
    startTypingAnimation(text);
  });

  // ✅ Swiper の初期化（カードスライダー）
  const cardSwiper = new Swiper(".card__swiper", {
    speed: 1000, // ✅ 表示切り替えのスピード
    effect: "fade", // ✅ 切り替えのmotion
    loop: true, // ✅ ループ再生
    autoplay: {
      delay: 6000, // ✅ 自動スライドの時間
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      prevEl: ".swiper-button-prev",
      nextEl: ".swiper-button-next",
    },

    // ✅ イベント：初期化時とスライド変更時にテキスト＆画像アニメ発火
    on: {
      init: () => {
        const activeSlide = document.querySelector(".swiper-slide-active .swiper-slide__text");
        if (activeSlide) {
          startTypingAnimation(activeSlide);
        }
        animateSlideImage(); // ✅ GSAPアニメも実行
      },
      slideChangeTransitionStart: () => {
        const activeSlide = document.querySelector(".swiper-slide-active .swiper-slide__text");
        if (activeSlide) {
          startTypingAnimation(activeSlide);
        }
        animateSlideImage(); // ✅ GSAPアニメも実行
      },
    },

    // ✅ 必要ならブレイクポイントで表示を変える（任意）
    // breakpoints: { 
    //   768: {
    //     slidesPerView: 1.2,
    //     spaceBetween: 15,
    //   },
    //   1500: {
    //     slidesPerView: 3,
    //     spaceBetween: 40,
    //   },
    // }
  });

  // ✅ オーバーレイのフェードアウト制御
  const overlay = document.getElementById("overlay");

  // ✅ 5秒後にフェードアウト開始
  setTimeout(() => {
    overlay.style.transition = "opacity 4s ease-in-out"; // ✅ フェードアウト時間を4秒に修正
    overlay.style.opacity = "0";

    // ✅ フェードアウト後に完全非表示 → サイトのコンテンツを表示
    overlay.addEventListener("transitionend", () => {
      overlay.style.display = "none"; // ✅ オーバーレイを非表示
      console.log("✅ オーバーレイが非表示になりました");

      const siteContent = document.getElementById('siteContent');
      if (siteContent) {
        siteContent.style.display = 'block';
      }
    });
  }, 5000);
});
// // サイト表示までのロゴとswiper=================================


// /* =================================================== 
// ※1 effectについて
// slide：左から次のスライドが流れてくる  
// fade：次のスライドがふわっと表示  
//   → fadeEffect: { crossFade: true } を加えると滑らか  
// cube：スライドが立方体になり、3D回転を繰り返す  
// coverFlow：写真やアルバムジャケットをめくるような動き  
// flip：平面が回転するような動き  
// cards：カードを順番に見ていくような動き  
// creative：カスタマイズしたアニメーション  

// =======================================================
// ※2 paginationのタイプ
// bullets：ドットで表示  
// fraction：分数表示（例：1 / 3）  
// progressbar：進捗バー形式で表示  
// custom：HTMLやJSで自由にカスタマイズ  

// ===================================================== */


// // サイト表示までのロゴ制御とswiper==========================================
// // document.addEventListener("DOMContentLoaded", () => {
// //   // ✅ Swiperスライド内のテキストを取得
// //   const swiperTexts = document.querySelectorAll(".swiper-slide__text");

// //   // ✅ 一文字ずつ出現の関数
// //   function startTypingAnimation(target, delay = 0) {
// //     const headings = target.querySelectorAll(".swiper-slide__heading, .swiper-slide__sub");

// //     headings.forEach((heading, index) => {
// //       const text = heading.innerText; // ✅ 元のテキストを取得
// //       heading.innerHTML = ""; // ✅ 文字をクリアしてから挿入
// //       text.split("").forEach((char, charIndex) => {
// //         const span = document.createElement("span");
// //         span.innerText = char;

// //         // ✅ heading と sub にラグを入れる
// //         const extraDelay = index === 1 ? 1.5 : 0; // ✅ sub だけ遅延
// //         span.style.animationDelay = `${charIndex * 0.15 + extraDelay}s`; // ✅ 0.2秒ごとに遅延
// //         heading.appendChild(span);
// //       });
// //     });
// //   }

// //   // ✅ トップビジュアルの全テキストに適用
// //   swiperTexts.forEach((text) => {
// //     startTypingAnimation(text);
// //   });

// //   // ✅ Swiper の初期化（カードスライダー）
// //   const cardSwiper = new Swiper(".card__swiper", {
// //     speed: 1000, // ✅ 表示切り替えのスピード
// //     effect: "fade", // ✅ 切り替えのmotion
// //     loop: true, // ✅ ループ再生
// //     autoplay: {
// //       delay: 5000, // ✅ 自動スライドの時間
// //     },
// //     pagination: {
// //       el: ".swiper-pagination",
// //       clickable: true,
// //     },
// //     navigation: {
// //       prevEl: ".swiper-button-prev",
// //       nextEl: ".swiper-button-next",
// //     },
// //     on: {
// //       init: () => {
// //         const activeSlide = document.querySelector(".swiper-slide-active .swiper-slide__text");
// //         if (activeSlide) {
// //           startTypingAnimation(activeSlide);
// //         }
// //       },
// //       slideChangeTransitionStart: () => {
// //         const activeSlide = document.querySelector(".swiper-slide-active .swiper-slide__text");
// //         if (activeSlide) {
// //           startTypingAnimation(activeSlide);
// //         }
// //       },
// //     },
// //   });

// //   // ✅ オーバーレイのフェードアウト制御
// //   const overlay = document.getElementById("overlay");

// //   // ✅ 5秒後にフェードアウト開始
// //   setTimeout(() => {
// //     overlay.style.transition = "opacity 4s ease-in-out"; // ✅ フェードアウト時間を4秒に修正
// //     overlay.style.opacity = "0";

// //     // ✅ フェードアウト後に完全非表示 → サイトのコンテンツを表示
// //     overlay.addEventListener("transitionend", () => {
// //       overlay.style.display = "none"; // ✅ オーバーレイを非表示
// //       console.log("✅ オーバーレイが非表示になりました");

// //       // ✅ サイトコンテンツを表示
// //       const siteContent = document.getElementById('siteContent'); // サイトのコンテンツ要素を取得
// //       if (siteContent) {
// //         siteContent.style.display = 'block'; // サイト表示
// //       }
// //     });
// //   }, 5000); // ✅ 5秒後にフェードアウト開始
// // });
// // // サイト表示までのロゴとswiper=================================



// //   //ブレイクポイントによって変える
// //   // breakpoints: { 
// //   //   768: {
// //   //     slidesPerView: 1.2,
// //   //     spaceBetween: 15,
// //   //   },
// //   //   1500: {
// //   //     slidesPerView: 3,
// //   //     spaceBetween: 40,
// //   //   },
// //   // }


// // /* =================================================== 
// // ※1 effectについて
// // slide：左から次のスライドが流れてくる
// // fade：次のスライドがふわっと表示
// // ■ fadeの場合は下記を記述
// //   fadeEffect: {
// //     crossFade: true
// //   },
// // cube：スライドが立方体になり、3D回転を繰り返す
// // coverFlow：写真やアルバムジャケットをめくるようなアニメーション
// // flip：平面が回転するようなアニメーション
// // cards：カードを順番にみていくようなアニメーション
// // creative：カスタマイズしたアニメーションを使うときに使用します

// // =======================================================
// // ※2 paginationのタイプ
// // bullets：スライド枚数と同じ数のドットが表示
// // fraction：分数で表示（例：1 / 3）
// // progressbar：スライドの進捗に応じてプログレスバーが伸びる
// // custom：自由にカスタマイズ

// // =====================================================*/


// ================header__nav-link
// ✅ SVGパスの長さを自動セット
document.querySelectorAll('.header__nav-link-icon path').forEach((path) => {
  const length = path.getTotalLength(); // パスの長さを取得
  path.style.strokeDasharray = length; // ✅ 線の長さをセット
  path.style.strokeDashoffset = length; // ✅ 初期状態で線を隠す
});

// ✅ ホバー時のアニメーション（パスのみ）
document.querySelectorAll('.header__nav-link').forEach((link) => {
  link.addEventListener('mouseenter', () => {
    const path = link.querySelector('.header__nav-link-icon path');
    path.style.transition = 'none'; // ✅ アニメーションなしで初期化
    path.style.strokeDashoffset = path.getTotalLength(); // ✅ 初期状態をリセット

    // ✅ 次のフレームでstroke-dashoffsetを0にしてアニメーション
    requestAnimationFrame(() => {
      path.style.transition = 'stroke-dashoffset 1.5s ease-in-out';
      path.style.strokeDashoffset = '0'; // ✅ なぞるアニメーション
    });
  });

  link.addEventListener('mouseleave', () => {
    const path = link.querySelector('.header__nav-link-icon path');
    const length = path.getTotalLength();
    path.style.strokeDashoffset = length; // ✅ ホバー解除時に元に戻す
  });
});
// ================header__nav-link


const newsElement = document.querySelector('.mv__info-news');

// ホバー時に計算してtranslateXを適用
newsElement.addEventListener('mouseenter', () => {
  const parentWidth = newsElement.offsetWidth; // 親要素の幅
  const childWidth = newsElement.querySelector('.mv__info-news-time').offsetWidth + newsElement.querySelector('.mv__info-news-text').offsetWidth + parseFloat(window.getComputedStyle(newsElement).gap); // 子要素の合計幅

  // 中央位置を計算
  const translateXValue = (parentWidth - childWidth) / 2;

  // transformで位置を動かす
  newsElement.style.transform = `scale(1.2) translateX(${translateXValue}px)`;
});

// ホバー解除時にリセット
newsElement.addEventListener('mouseleave', () => {
  newsElement.style.transform = 'scale(1) translateX(0)';
});

const buttonTop = document.querySelector('.button-top');

buttonTop.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // ブラウザのスムーススクロール機能を使う（時間は調整できない）
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const topButton = document.querySelector(".button-top");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    if (scrollY > 300) {
      topButton.classList.add("is-visible");
    } else {
      topButton.classList.remove("is-visible");
    }
  });

  topButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});



const drawerBtn = document.querySelector(".drawer-icon");
const bars = drawerBtn.querySelectorAll(".drawer-icon__bar");

let isOpen = false;

drawerBtn.addEventListener("click", () => {
  isOpen = !isOpen;

  if (isOpen) {
    // 🌀くるっと回転しながら交差
    gsap.to(bars[0], {
      y: 7,
      rotate: 405, // ← 360 + 45度くるっと！
      transformOrigin: "center",
      duration: 0.6,
      ease: "power3.out"
    });
    gsap.to(bars[1], {
      opacity: 0,
      duration: 0.3,
      ease: "power1.out"
    });
    gsap.to(bars[2], {
      y: -7,
      rotate: -405, // ← マイナス方向にもくるん！
      transformOrigin: "center",
      duration: 0.6,
      ease: "power3.out"
    });
  } else {
    // 元に戻るときもスムーズに回転戻す
    gsap.to(bars[0], {
      y: 0,
      rotate: 0,
      duration: 0.6,
      ease: "power3.inOut"
    });
    gsap.to(bars[1], {
      opacity: 1,
      duration: 0.3,
      ease: "power1.in"
    });
    gsap.to(bars[2], {
      y: 0,
      rotate: 0,
      duration: 0.6,
      ease: "power3.inOut"
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const buttonTop = document.querySelector('.button-top');

  if (!buttonTop) return;

  let rotateTl;

  buttonTop.addEventListener('mouseenter', () => {
    // 回転 + スケール演出
    rotateTl = gsap.timeline();

    rotateTl.to(buttonTop, {
      rotate: 1080,
      scale: 1.15,
      duration: 0.5,
      ease: 'power3.out'
    });

    // 追いかけるように「ポン！」と跳ねる
    gsap.fromTo(
      buttonTop,
      { scale: 1 },
      {
        scale: 1.2,
        duration: 0.2,
        ease: 'power1.out',
        yoyo: true,
        repeat: 1,
        delay: 0.1 // 少し遅らせて重ねると気持ちいい
      }
    );
  });

  buttonTop.addEventListener('mouseleave', () => {
    if (rotateTl) rotateTl.kill(); // 回転止める

    gsap.to(buttonTop, {
      rotate: 0,
      scale: 1,
      boxShadow: 'none',
      duration: 0.4,
      ease: 'power3.inOut'
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const drawerLinks = document.querySelectorAll('.drawer__item-link');

  drawerLinks.forEach(link => {
    const paths = link.querySelectorAll('svg path');

    // 🌀 マウスエンター演出
    link.addEventListener('mouseenter', () => {
      gsap.to(link, {
        y: -6,
        scale: 1.08,
        backgroundColor: '#ffffff1a',
        color: '#1391E6',
        boxShadow: '0 4px 15px rgba(19, 145, 230, 0.4)',
        duration: 0.4,
        ease: 'back.out(1.7)'
      });

      paths.forEach(path => {
        gsap.to(path, {
          fill: '#1391E6',
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });

    // 🎯 マウスリーブ演出
    link.addEventListener('mouseleave', () => {
      gsap.to(link, {
        y: 0,
        scale: 1,
        backgroundColor: 'transparent',
        color: '#ffffff',
        boxShadow: '0 0 0 rgba(0,0,0,0)',
        duration: 0.5,
        ease: 'power3.out'
      });

      paths.forEach(path => {
        gsap.to(path, {
          fill: '#ffffff',
          duration: 0.4,
          ease: 'power2.inOut'
        });
      });
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const spBottomItems = document.querySelectorAll('.sp-bottom__item');

  if (spBottomItems.length < 2) return;

  const reserveItem = spBottomItems[1]; // 2番目（WEB予約）

  setTimeout(() => {
    gsap.to(reserveItem, {
      y: -8,
      scale: 1.1,
      duration: 0.6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });
  }, 3000);
});

document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".reserve__button");
  const icon = button.querySelector("svg");
  const text = button.querySelector(".reserve__text");

  // 🔁 背景色アニメーションを定義して保持
  const bgColorAnim = gsap.to(button, {
    keyframes: [
      { backgroundColor: "#007acc", duration: 0.2 },
      { backgroundColor: "#0060a0", duration: 0.2 }
    ],
    repeat: -1,
    ease: "power1.inOut",
    yoyo: true
  });

  // 🎯 ホバー時：色アニメ停止＋色固定＋スライド・スケール
  button.addEventListener("mouseenter", () => {
    // 色アニメーションを一時停止
    bgColorAnim.pause();

    // 色を強制的に #0060a0 に固定
    gsap.to(button, {
      backgroundColor: "#0060a0",
      duration: 0.2
    });

    // スライド
    gsap.fromTo(
      button,
      { y: 0 },
      {
        y: -10,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: "power1.out"
      }
    );

    // スケール
    gsap.fromTo(
      [icon, text],
      { scale: 1 },
      {
        scale: 1.2,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: "power1.out"
      }
    );
  });

  // 🛫 ホバー解除時：アニメーション再開
  button.addEventListener("mouseleave", () => {
    bgColorAnim.resume(); // 色アニメーションを再開
  });
});

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const items = document.querySelectorAll(".recommend__item");

  items.forEach((item, i) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".recommend",
        start: "top 40%",
        toggleActions: "play none none none",
        markers: false // 必要なら true
      },
      delay: i * 0.3 // 順番に出したい場合
    });

    tl.fromTo(item,
      { scale: 0.5, opacity: 0 },
      {
        scale: 1.2,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out"
      }
    ).to(item,
      {
        scale: 1.0,
        duration: 0.3,
        ease: "power2.inOut"
      }
    );
  });
});

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const services = document.querySelectorAll(".medical__service");

  services.forEach((el, i) => {
    // ① スクロールでscaleYとopacityをアニメ（1回だけ）
    gsap.fromTo(el,
      {
        scaleY: 0.8,
        opacity: 0,
        transformOrigin: "center bottom",
        y: 30
      },
      {
        scaleY: 1,
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        delay: i * 0.2,
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        // onComplete: () => {
        //   // ② scaleXでピクピクをループ（ずっと）
        //   gsap.to(el, {
        //     scaleX: 1.05,
        //     duration: 0.8,
        //     yoyo: true,
        //     repeat: -1,
        //     ease: "power1.inOut"
        //   });
        // }
      }
    );
  });
});


gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  const cards = Array.from(document.querySelectorAll('.blog__card'));

  // offsetTopでグループ化（←こっちのが安定！）
  const cardGroups = [];
  let lastTop = null;
  let currentGroup = [];

  cards.forEach((card) => {
    const top = card.offsetTop;

    if (lastTop === null || top === lastTop) {
      currentGroup.push(card);
    } else {
      cardGroups.push(currentGroup);
      currentGroup = [card];
    }

    lastTop = top;
  });
  if (currentGroup.length > 0) {
    cardGroups.push(currentGroup);
  }

  // グループごとにアニメーション（交互に方向変える）
  cardGroups.forEach((group, index) => {
    const fromX = index % 2 === 0 ? '-300px' : '300px';

    gsap.fromTo(group,
      { x: fromX, opacity: 0 },
      {
        scrollTrigger: {
          trigger: group[0],
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        x: 0,
        opacity: 1,
        duration: 0.3,
        ease: 'power1.out',
        // stagger: 0.05, // ←グループ内もテンポ良く
      }
    );
  });
});

const footer = document.querySelector('.footer');

const waveMotion = { x: 0 }; // ← ダミーオブジェクト！

gsap.to(waveMotion, {
  x: -50,
  duration: 4,
  ease: 'sine.inOut',
  repeat: -1,
  yoyo: true,
  onUpdate: () => {
    footer.style.setProperty('--wave-x', `${waveMotion.x}px`);
  }
});

gsap.registerPlugin(ScrollTrigger);

// 🐟 1匹目
gsap.fromTo('.footer__mr2',
  {
    x: -100,
    y: 0,
    opacity: 1
  },
  {
    x: () => window.innerWidth + 100,
    y: 300,
    duration: 0.5,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 40%',
      once: true,
      toggleActions: 'play none none none',
      markers: true,
    }
  }
);

// 🐟 2匹目（0.4秒あとに出現）
gsap.fromTo('.footer__mr',
  {
    x: -100,
    y: 100, // 少し下からスタートすると自然
    opacity: 1
  },
  {
    x: () => window.innerWidth + 100,
    y: -200,
    duration: 0.5,
    ease: 'power2.inOut',
    delay: 0.4, // 時間差ポイント！
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 40%',
      once: true,
      toggleActions: 'play none none none'
    }
  }
);



















// 画面サイズ375px以下はいい感じに縮小
document.addEventListener("DOMContentLoaded", () => {
  function scaleContent() {
      const minWidth = 375;
      if (window.innerWidth < minWidth) {
          const scale = window.innerWidth / minWidth;
          document.body.style.transform = `scale(${scale})`;
          document.body.style.transformOrigin = "top left";
          document.body.style.width = `${minWidth}px`; // レイアウト維持
      } else {
          document.body.style.transform = ""; // 拡大・縮小を無効化
          document.body.style.width = ""; // デフォルトの幅に戻す
      }
  }
  scaleContent();
  window.addEventListener("resize", scaleContent);
});

/**
 * JavaScript（aria-current="page"も追加バージョン）
 * 現在のページのリンクに自動で is-active クラスと aria-current="page" を付与するスクリプト
 * 
 * - is-active → SCSSで色や下線などをコントロール
 * - aria-current → アクセシビリティ向上（スクリーンリーダーなどが「今いるページ」と認識できる）
 */

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
  drawer.style.transform = 'translateY(-100%)'; // 上からスライド
  drawer.style.overflow = 'hidden';
  drawer.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out, visibility 0.3s ease-in-out';

  const openMenu = () => {
    isMenuOpen = true;
    drawer.classList.add("js-show");
    drawerIcon.classList.add("js-show"); // 追加
    drawer.style.opacity = "1";
    drawer.style.visibility = "visible";
    drawer.style.transform = "translateY(0)";
    body.style.overflow = "hidden"; // スクロールを防止
    drawerIcon.setAttribute("aria-expanded", "true"); // アクセシビリティ対応
  };

  const closeMenu = () => {
    isMenuOpen = false;
    drawer.classList.remove("js-show");
    drawerIcon.classList.remove("js-show"); // 追加
    drawer.style.opacity = "0";
    drawer.style.visibility = "hidden";
    drawer.style.transform = "translateY(-100%)";
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

    headings.forEach((heading, index) => {
      const text = heading.innerText; // ✅ 元のテキストを取得
      heading.innerHTML = ""; // ✅ 文字をクリアしてから挿入
      text.split("").forEach((char, charIndex) => {
        const span = document.createElement("span");
        span.innerText = char;

        // ✅ heading と sub にラグを入れる
        const extraDelay = index === 1 ? 1.5 : 0; // ✅ sub だけ遅延
        span.style.animationDelay = `${charIndex * 0.15 + extraDelay}s`; // ✅ 0.2秒ごとに遅延
        heading.appendChild(span);
      });
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
      delay: 5000, // ✅ 自動スライドの時間
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      prevEl: ".swiper-button-prev",
      nextEl: ".swiper-button-next",
    },
    on: {
      init: () => {
        const activeSlide = document.querySelector(".swiper-slide-active .swiper-slide__text");
        if (activeSlide) {
          startTypingAnimation(activeSlide);
        }
      },
      slideChangeTransitionStart: () => {
        const activeSlide = document.querySelector(".swiper-slide-active .swiper-slide__text");
        if (activeSlide) {
          startTypingAnimation(activeSlide);
        }
      },
    },
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

      // ✅ サイトコンテンツを表示
      const siteContent = document.getElementById('siteContent'); // サイトのコンテンツ要素を取得
      if (siteContent) {
        siteContent.style.display = 'block'; // サイト表示
      }
    });
  }, 5000); // ✅ 5秒後にフェードアウト開始
});
// サイト表示までのロゴとswiper=================================



  //ブレイクポイントによって変える
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


/* =================================================== 
※1 effectについて
slide：左から次のスライドが流れてくる
fade：次のスライドがふわっと表示
■ fadeの場合は下記を記述
  fadeEffect: {
    crossFade: true
  },
cube：スライドが立方体になり、3D回転を繰り返す
coverFlow：写真やアルバムジャケットをめくるようなアニメーション
flip：平面が回転するようなアニメーション
cards：カードを順番にみていくようなアニメーション
creative：カスタマイズしたアニメーションを使うときに使用します

=======================================================
※2 paginationのタイプ
bullets：スライド枚数と同じ数のドットが表示
fraction：分数で表示（例：1 / 3）
progressbar：スライドの進捗に応じてプログレスバーが伸びる
custom：自由にカスタマイズ

=====================================================*/


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

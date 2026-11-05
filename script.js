window.addEventListener('DOMContentLoaded', () => {
  // 1. 💡 최초 접속 인트로 제어
  const gifImg = document.getElementById('envelopeGif');
  if (gifImg) {
    gifImg.src = "images/intro/envelope_motion.gif?v=" + Date.now();
  }
  
  // 2. 디데이 연산 함수
  function calculateDDay() {
    const ddayTarget = document.getElementById('ddayCount');
    if (!ddayTarget) return;
    const weddingDate = new Date(2027, 1, 21);
    const today = new Date();
    const todayPure = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffTime = weddingDate.getTime() - todayPure.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) ddayTarget.textContent = `D-${diffDays}`;
    else if (diffDays === 0) ddayTarget.textContent = "Today";
    else ddayTarget.textContent = `+${Math.abs(diffDays)}`;
  }
  calculateDDay();

  // 3. [중요] 갤러리 모달 및 스와이프 기능
	const modal = document.getElementById('galleryModal');
	const modalImg = document.getElementById('modalTargetImg');
	const modalClose = document.querySelector('.modal-close');
	const prevBtn = document.getElementById('prevBtn');
	const nextBtn = document.getElementById('nextBtn');

	const galleryImages = Array.from(document.querySelectorAll('.img-box img, .slide-item img'));
	let currentIndex = 0;

	const openModal = (index) => {
	  currentIndex = index;
	  modalImg.src = galleryImages[currentIndex].src;
	  modal.style.display = 'flex';
	};

	// 버튼 로직 추가
	const showNext = () => {
	  currentIndex = (currentIndex + 1) % galleryImages.length;
	  modalImg.src = galleryImages[currentIndex].src;
	};

	const showPrev = () => {
	  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
	  modalImg.src = galleryImages[currentIndex].src;
	};

	// 이벤트 리스너 등록
	galleryImages.forEach((img, index) => {
	  img.addEventListener('click', () => openModal(index));
	});

	modalClose.addEventListener('click', () => modal.style.display = 'none');
	nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
	prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

	// 배경 클릭 시 닫기
	modal.addEventListener('click', (e) => { 
	  if (e.target === modal || e.target.classList.contains('modal-zoom-container')) {
		modal.style.display = 'none'; 
	  }
	});

  // 4. Baby 섹션 애니메이션 관리
  const babySection = document.getElementById('baby');
  if (babySection) {
    const coupleContainer = babySection.querySelector('.couple-container');
    const jonghwaTxt = babySection.querySelector('.jonghwa-txt');
    const jinheeTxt = babySection.querySelector('.jinhee-txt');

    const jonghwaSrc = jonghwaTxt ? jonghwaTxt.src : '';
    const jinheeSrc = jinheeTxt ? jinheeTxt.src : '';

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          coupleContainer.classList.add('animate');
          setTimeout(() => {
            if (jonghwaTxt) { jonghwaTxt.style.opacity = '1'; jonghwaTxt.src = jonghwaSrc + '?v=' + Date.now(); }
          }, 1500);
          setTimeout(() => {
            if (jinheeTxt) { jinheeTxt.style.opacity = '1'; jinheeTxt.src = jinheeSrc + '?v=' + Date.now(); }
          }, 3300);
          observer.unobserve(babySection);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(babySection);
  }

  // 5. 스크롤 제어 로직 (기존 유지)
  let isScrolling = false;
  window.addEventListener('wheel', (e) => {
    if (isScrolling) return;
    const intro = document.getElementById('intro');
    const baby = document.getElementById('baby');
    if (!intro || !baby) return;

    const scrollY = window.scrollY;
    const introHeight = intro.offsetHeight;

    if (e.deltaY > 0 && scrollY < introHeight) {
      e.preventDefault();
      isScrolling = true;
      window.scrollTo({ top: baby.offsetTop, behavior: 'smooth' });
      setTimeout(() => { isScrolling = false; }, 800);
    } else if (e.deltaY < 0 && scrollY > 0 && scrollY < introHeight) {
      e.preventDefault();
      isScrolling = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => { isScrolling = false; }, 800);
    }
  }, { passive: false });
});

// [공통 기능 함수]
function toggleAccordion(headerElement) {
  const card = headerElement.parentElement;
  const content = headerElement.nextElementSibling;
  if (card.classList.contains('is-active')) {
    card.classList.remove('is-active');
    content.style.maxHeight = null;
  } else {
    card.classList.add('is-active');
    content.style.maxHeight = content.scrollHeight + "px";
  }
}

function copyAccount(text, message = "복사되었습니다.") {
  navigator.clipboard.writeText(text).then(() => {
    const toast = document.getElementById('toastMessage');
    if (toast) {
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => { toast.classList.remove('show'); }, 2000);
    }
  });
}




/* ===== Wedding Credits: 화면 진입 시 시작 ===== */
(function () {
    const credit = document.querySelector('.wedding-cradit');

    if (!credit) return;

    const track = credit.querySelector('.credit-track');
    const ending = credit.querySelector('.footer-ending-message');

    if (!track || !ending) return;

    let animation = null;
    let hasStarted = false;

    // 최초 상태 설정: 아직 애니메이션을 시작하지 않음
    track.style.opacity = '1';
    track.style.transform = 'translateY(0)';

    ending.style.animation = 'none';
    ending.style.opacity = '0';
    ending.style.visibility = 'hidden';
    ending.style.transform = 'translateY(22px)';
    ending.style.filter = 'blur(3px)';

    function startCredits() {
        if (hasStarted) return;

        hasStarted = true;

        // 폰트 로딩 완료 후 정확한 이동 거리 계산
        const distance = credit.clientHeight + track.scrollHeight;

        animation = track.animate(
            [
                { transform: 'translateY(0)' },
                { transform: `translateY(-${distance}px)` }
            ],
            {
                duration: 20000,
                delay: 500,
                easing: 'linear',
                fill: 'forwards'
            }
        );

        animation.onfinish = function () {
            ending.style.animation =
                'weddingEndingReveal 2.8s cubic-bezier(0.22, 1, 0.36, 1) forwards';
        };
    }

    // 마지막 감사 문구 등장 효과
    if (!document.getElementById('weddingEndingKeyframes')) {
        const style = document.createElement('style');
        style.id = 'weddingEndingKeyframes';
        style.textContent = `
            @keyframes weddingEndingReveal {
                0% {
                    opacity: 0;
                    visibility: visible;
                    transform: translateY(22px);
                    filter: blur(3px);
                }
                65% {
                    opacity: 0.85;
                    filter: blur(0);
                }
                100% {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                    filter: blur(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // 크레딧 영역이 실제로 화면에 들어왔을 때만 시작
    function observeCredits() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !hasStarted) {
                    observer.unobserve(credit);

                    if (document.fonts && document.fonts.ready) {
                        document.fonts.ready.then(startCredits);
                    } else {
                        startCredits();
                    }
                }
            });
        }, {
            threshold: 0.1
        });

        observer.observe(credit);
    }

    observeCredits();
})();


document.addEventListener("DOMContentLoaded", function () {

    const motionSection = document.querySelector("#marriedMotion");

    if (!motionSection) return;

    // 초기 상태는 숨김
    motionSection.classList.remove("is-visible");

    const observer = new IntersectionObserver(function (entries) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {

                motionSection.classList.add("is-visible");

                // 최초 한 번만 실행
                observer.unobserve(motionSection);

            }

        });

    }, {
        threshold: 0.2
    });

    observer.observe(motionSection);

});


/* =========================================
   Wedding Gallery
========================================= */

// 사진 확대 기능 사용 여부
const ENABLE_LIGHTBOX = true;

// 갤러리 사진 목록
const galleryPhotos = [
    "image/gallery/01.jpg",
    "image/gallery/02.jpg",
    "image/gallery/03.jpg",
    "image/gallery/04.jpg",
    "image/gallery/05.jpg",
    "image/gallery/06.jpg",
    "image/gallery/07.jpg",
    "image/gallery/08.jpg",
    "image/gallery/09.jpg",
    "image/gallery/10.jpg",
    "image/gallery/11.jpg",
    "image/gallery/12.jpg"
];

document.addEventListener("DOMContentLoaded", function () {

    const galleryGrid = document.getElementById("galleryGrid");
    const photoViewer = document.getElementById("photoViewer");
    const viewerImage = document.getElementById("viewerImage");
    const viewerCount = document.getElementById("viewerCount");

    const viewerClose = document.getElementById("viewerClose");
    const viewerPrev = document.getElementById("viewerPrev");
    const viewerNext = document.getElementById("viewerNext");

    // 필수 요소가 없으면 실행 중단
    if (
        !galleryGrid ||
        !photoViewer ||
        !viewerImage ||
        !viewerCount ||
        !viewerClose ||
        !viewerPrev ||
        !viewerNext
    ) return;

    let currentPhoto = 0;
    let touchStartX = 0;
    let isAnimating = false;

    // 갤러리 자동 생성
    galleryPhotos.forEach((src, index) => {

        const button = document.createElement("button");
        button.type = "button";
        button.className = "gallery-item";

        const img = document.createElement("img");
        img.src = src;
        img.alt = `웨딩 사진 ${index + 1}`;
        img.loading = "lazy";

        button.appendChild(img);

        if (ENABLE_LIGHTBOX) {
            button.addEventListener("click", () => {
                openViewer(index);
            });
        } else {
            button.disabled = true;
        }

        galleryGrid.appendChild(button);
    });


    // 사진 확대
    function openViewer(index) {

        currentPhoto = index;
        isAnimating = false;

        viewerImage.classList.remove("slide-next", "slide-prev");

        viewerImage.src = galleryPhotos[currentPhoto];

        updateCount();

        photoViewer.classList.add("active");
        document.body.style.overflow = "hidden";
    }


    // 사진 번호 업데이트
    function updateCount() {
        viewerCount.textContent =
            `${currentPhoto + 1} / ${galleryPhotos.length}`;
    }


    // 사진 변경
    function changePhoto(direction) {

        if (isAnimating) return;

        isAnimating = true;

        if (direction === "next") {
            currentPhoto = (currentPhoto + 1) % galleryPhotos.length;
        } else {
            currentPhoto =
                (currentPhoto - 1 + galleryPhotos.length) % galleryPhotos.length;
        }

        viewerImage.classList.remove("slide-next", "slide-prev");

        // 애니메이션 초기화 후 재실행
        void viewerImage.offsetWidth;

        viewerImage.src = galleryPhotos[currentPhoto];

        viewerImage.classList.add(
            direction === "next" ? "slide-next" : "slide-prev"
        );

        updateCount();

        // 애니메이션 종료 후 다음 입력 허용
        setTimeout(() => {
            isAnimating = false;
        }, 380);
    }


    // 이전 / 다음 사진
    function prevPhoto() {
        changePhoto("prev");
    }

    function nextPhoto() {
        changePhoto("next");
    }


    // 닫기
    function closeViewer() {
        photoViewer.classList.remove("active");
        document.body.style.overflow = "";
        isAnimating = false;
    }


    // 버튼 이벤트
    viewerClose.addEventListener("click", closeViewer);
    viewerPrev.addEventListener("click", prevPhoto);
    viewerNext.addEventListener("click", nextPhoto);


    // 검은 배경 클릭 시 닫기
    photoViewer.addEventListener("click", (e) => {
        if (e.target === photoViewer) {
            closeViewer();
        }
    });


    // 키보드 조작
    document.addEventListener("keydown", (e) => {

        if (!photoViewer.classList.contains("active")) return;

        if (e.key === "Escape") closeViewer();
        if (e.key === "ArrowLeft") prevPhoto();
        if (e.key === "ArrowRight") nextPhoto();
    });


    // 모바일 좌우 스와이프
    photoViewer.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });


    photoViewer.addEventListener("touchend", (e) => {

        if (!photoViewer.classList.contains("active")) return;

        const touchEndX = e.changedTouches[0].screenX;
        const distance = touchEndX - touchStartX;

        if (Math.abs(distance) < 50) return;

        if (distance < 0) {
            nextPhoto();
        } else {
            prevPhoto();
        }
    }, { passive: true });

});



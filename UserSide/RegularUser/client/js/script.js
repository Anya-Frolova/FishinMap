// === Обработка кнопки "Sign up" на главном экране (index.html) ===
const signupBtn = document.getElementById('signupBtn');
if (signupBtn) {
  signupBtn.addEventListener('click', function () {
    window.location.href = "signUpForUser.html";
  });
}

// === Обработка кнопки "Back" на экране регистрации (registerUser.html) ===
const backBtn = document.getElementById('backBtn');
if (backBtn) {
  backBtn.addEventListener('click', function () {
    window.location.href = "mainUserScrean.html";
  });
}

const signupForm = document.getElementById('userSignupForm');
if (signupForm) {
  const passwordInput        = document.querySelector('input[name="password"]');
  const verifyPasswordInput  = document.querySelector('input[name="verifyPassword"]');
  const errorDiv             = document.getElementById('error');

  // Очистка ошибок при вводе
  [passwordInput, verifyPasswordInput].forEach(input => {
    input.addEventListener('input', () => {
      errorDiv.textContent = '';
    });
  });

  signupForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const password = passwordInput.value;
    const verifyPassword = verifyPasswordInput.value;

    // Проверка пароля
    if (password.length < 8) {
      errorDiv.textContent = 'Password must be at least 8 characters long.';
      return;
    }
    if (!/[A-Z]/.test(password)) {
      errorDiv.textContent = 'Password must include at least one uppercase letter.';
      return;
    }
    if (!/\d/.test(password)) {
      errorDiv.textContent = 'Password must include at least one number.';
      return;
    }
    if (password !== verifyPassword) {
      errorDiv.textContent = 'Passwords do not match.';
      return;
    }

    // Всё в порядке — отправка данных
    const formData = new FormData(signupForm);
    const data = Object.fromEntries(formData);

    // Remove verifyPassword from data before sending
    delete data.verifyPassword;

    try {
      const resp = await fetch('https://fishinmap.onrender.com/api/auth/signup', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data)
      });
      const result = await resp.json();

      if (!resp.ok) {
        // Покажи ошибку сервера
        errorDiv.textContent = result.error || 'Registration failed.';
        return;
      }

      // Успешно!
      alert("Your registration request has been sent to the admin for approval.");
      window.location.href = "index.html";

    } catch (err) {
      errorDiv.textContent = 'Network/server error, please try again.';
      console.error('Signup error:', err);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const iconGroup = document.getElementById('sideIcons');

  if (hamburgerBtn && iconGroup) {
    hamburgerBtn.addEventListener('click', () => {
      iconGroup.classList.toggle('active');
    });
  }
});

// login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  const emailInput    = document.getElementById('username');  // переименовал на email
  const passwordInput = document.getElementById('password');
  const errorDiv      = document.getElementById('loginError');

  // Сбросим ошибку при любом вводе
  [emailInput, passwordInput].forEach(i =>
    i.addEventListener('input', () => { if (errorDiv) errorDiv.textContent = ''; })
  );

  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email    = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      if (errorDiv) errorDiv.textContent = 'Please enter email and password.';
      return;
    }

    try {
      const resp = await fetch('https://fishinmap.onrender.com/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password })
      });

      const result = await resp.json();

      if (!resp.ok) {
        // 400 / 401 / 500
        if (errorDiv) errorDiv.textContent = result.error || 'Login failed';
        return;
      }

      // Успешный логин
      // Сохраним данные пользователя, если нужно
      sessionStorage.setItem('user', JSON.stringify(result.user));

      // Перейдём на главный экран
      window.location.href = 'FirstUserScrean.html';

    } catch (err) {
      console.error('Login error:', err);
      if (errorDiv) errorDiv.textContent = 'Network error, please try later.';
    }
  });
}

// === Переход на экран выбора локации по нажатию на рыбку ===
const fishBtnMain = document.getElementById('fishBtn');
if (fishBtnMain) {
  fishBtnMain.addEventListener('click', () => {
    window.location.href = 'selectLocation.html';
  });
}

// === Логика на selectLocation.html ===
document.addEventListener('DOMContentLoaded', () => {
  // Подсветить рыбку
  const fishBtn = document.getElementById('fishBtn');
  if (fishBtn) {
    fishBtn.classList.add('active');
  }

  // Кнопка Назад (крестик)
  const backMapBtn = document.getElementById('backMapBtn');
  if (backMapBtn) {
    backMapBtn.addEventListener('click', () => {
      window.location.href = 'FirstUserScrean.html';
    });
  }

  const nextMapBtn = document.getElementById('nextMapBtn');
  if (nextMapBtn) {
    nextMapBtn.addEventListener('click', () => {
      // 1) Читаем текущее значение поля локации
      const locationValue = document.querySelector('input[name="location"]').value;
      // 2) Сохраняем в sessionStorage
      sessionStorage.setItem('selectedLocation', locationValue);
      // 3) Решаем, куда идти дальше: обычный или эксперт-экран
     const user = JSON.parse(sessionStorage.getItem('user') || '{}');
     const nextScreen = (user.rank >= 4)
      ? 'describeFishExpert.html'   // эксперт видит свой экран
      : 'describeFish.html';        // обычный пользователь
     window.location.href = nextScreen;
      
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const fishBtn = document.getElementById('fishBtn');
  if (fishBtn) {
    // при переходе на новый экран — ставим активный стиль
    fishBtn.classList.add('active');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop();

  // === Экран добавления информации о рыбке (describeFish.html) ===
  if (page === 'describeFish.html') {
    // 1) Подсветить рыбку чёрным, но отключить у неё навигацию
    const fishBtn = document.getElementById('fishBtn');
    if (fishBtn) {
      fishBtn.classList.add('active');
      fishBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopImmediatePropagation();
      }, true);
    }

        // === Превью фото на describeFish.html ===
    const selectImageBtn = document.getElementById('selectImage');
    const fishPhotoInput = document.getElementById('fishPhoto');
    const photoPreview   = document.getElementById('photoPreview');

    if (selectImageBtn && fishPhotoInput && photoPreview) {
      // Открываем диалог выбора файла
      selectImageBtn.addEventListener('click', () => {
        fishPhotoInput.click();
      });

      // Когда файл выбран — читаем и показываем
      fishPhotoInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
          photoPreview.src           = ev.target.result;
          photoPreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
      });
    }


    // 2) Стрелка влево возвращает на экран выбора локации
    const backBtnFish = document.getElementById('backBtnFish');
    if (backBtnFish) {
      backBtnFish.addEventListener('click', () => {
        window.location.href = 'selectLocation.html';
      });
    }

   // 3) Стрелка вправо — собирает данные и переходит на экран проверки
    const nextBtnFish = document.getElementById('nextBtnFish');
    if (nextBtnFish) {
      nextBtnFish.addEventListener('click', () => {
        // Собираем значения полей
        const fishType   = document.querySelector('input[name="fishType"]').value;
        const fishWeight = document.querySelector('input[name="fishWeight"]').value;
        const fishLength = document.querySelector('input[name="fishLength"]').value;
        const catchDate  = document.getElementById('catchDate').value;
        // берём src превью (или пустую строку)
        const photoPreview = document.getElementById('photoPreview');
        const photoSrc     = photoPreview && photoPreview.src ? photoPreview.src : '';

        // Сохраняем всё в sessionStorage
        sessionStorage.setItem('fishData', JSON.stringify({fishType,fishWeight,fishLength,catchDate,photoSrc}));

        // Переходим на экран проверки
        window.location.href = 'reviewPost.html';
      });
    }
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop();
  if (page === 'reviewPost.html') {
    // 1) Читаем данные
    const data     = JSON.parse(sessionStorage.getItem('fishData')       || '{}');
    const savedLoc = sessionStorage.getItem('selectedLocation')         || '';

    // 2) Заполняем поля
    const el = id => document.getElementById(id);
    if (el('displayFishType'))   el('displayFishType').innerText   = data.fishType   || '';
    if (el('displayFishWeight')) el('displayFishWeight').innerText = data.fishWeight || '';
    if (el('displayFishLength')) el('displayFishLength').innerText = data.fishLength || '';
    if (el('displayCatchDate'))  el('displayCatchDate').innerText  = data.catchDate  || '';
    if (el('displayLocation'))   el('displayLocation').innerText   = savedLoc;

    // 3) Показываем фото‑превью
    const img = el('displayPhoto');
    if (img && data.photoSrc) {
      img.src           = data.photoSrc;
      img.style.display = 'block';
    }

    // 4) ← Назад на describeFish.html
    const backBtn = el('backBtnReview');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.location.href = 'describeFish.html';
      });
    }

    // 5) ✔ Отправляем на сервер, alert и возвращаем на главный экран
const confirmBtn = el('confirmBtn');
if (confirmBtn) {
  confirmBtn.addEventListener('click', async () => {
    // 1) Берём залогиненного пользователя из sessionStorage
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (!user.id) {
      alert('User not logged in');
      return;
    }

    // 2) Собираем тело запроса
    const postBody = {
      user:     user.id,        // поле user в БД
      fishType:   data.fishType,
      fishWeight: data.fishWeight,
      fishLength: data.fishLength,
      catchDate:  data.catchDate,
      photoSrc:   data.photoSrc,
      location:   savedLoc
    };

    try {
      // 3) POST /api/posts
      const resp = await fetch('https://fishinmap.onrender.com/api/posts', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(postBody)
      });
      const result = await resp.json();

      // 4) Если сервер вернул ошибку
      if (!resp.ok) {
        alert(result.error || 'Failed to send post');
        return;
      }

      // 5) Успех
      alert('Your post has been sent to the admin for review.');
      window.location.href = 'FirstUserScrean.html';

    } catch (err) {
      console.error('Error sending post:', err);
      alert('Network error, please try later.');
    }
  });
}

  }
});


document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop();

  // === Экран описания рыбы экспертом (describeFishExpert.html) ===
  if (page === 'describeFishExpert.html') {
    // 1) Подсветить рыбку и отключить её навигацию
    const fishBtn = document.getElementById('fishBtn');
    if (fishBtn) {
      fishBtn.classList.add('active');
      fishBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopImmediatePropagation();
      }, true);
    }

    // 2) ← Назад на selectLocation.html
    const backExpert = document.getElementById('backBtnExpert');
    if (backExpert) {
      backExpert.addEventListener('click', () => {
        window.location.href = 'selectLocation.html';
      });
    }

    // 3) → Сбор полей эксперта и переход на reviewPostExpert.html
    const nextExpert = document.getElementById('nextBtnExpert');
    if (nextExpert) {
      nextExpert.addEventListener('click', () => {
        // читаем значения всех полей эксперта:
        const fishType   = document.querySelector('input[name="fishType"]').value;
        const season     = document.querySelector('input[name="Season"]').value;
        const fishWeight = document.querySelector('input[name="fishWeight"]').value;
        const fishLength = document.querySelector('input[name="fishLength"]').value;
        const amount     = document.querySelector('input[name="Amount"]').value;
        const catchDate  = document.querySelector('input[name="catchDate"]').value;

        // фото (если нужно, по аналогии с обычной страницей)
        const photoPreview = document.getElementById('photoPreview');
        const photoSrc     = photoPreview && photoPreview.src ? photoPreview.src : '';

        // сохраняем в sessionStorage
        const expertData = {
          fishType,
          season,
          fishWeight,
          fishLength,
          amount,
          catchDate,
          photoSrc
        };
        sessionStorage.setItem('expertFishData', JSON.stringify(expertData));

        // и переходим на экран проверки поста экспертом
        window.location.href = 'reviewPostExpert.html';
      });
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop();

  // === Экран проверки поста экспертом ===
  if (page === 'reviewPostExpert.html') {
    // 1) Считываем собранные данные
    const expertData = JSON.parse(sessionStorage.getItem('expertFishData')   || '{}');
    const location   = sessionStorage.getItem('selectedLocation')           || '';
    const user       = JSON.parse(sessionStorage.getItem('user')            || '{}');

    // 2) Заполняем поля на странице
    const fill = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.innerText = val;
    };
    fill('displayFishType',   expertData.fishType);
    fill('displaySeason',     expertData.season);
    fill('displayFishWeight', expertData.fishWeight);
    fill('displayFishLength', expertData.fishLength);
    fill('displayAmount',     expertData.amount);
    fill('displayCatchDate',  expertData.catchDate);
    fill('displayLocation',   location);

    const img = document.getElementById('displayPhoto');
    if (img && expertData.photoSrc) {
      img.src           = expertData.photoSrc;
      img.style.display = 'block';
    }

    // 3) ← Назад на describeFishExpert.html
    document.getElementById('backBtnReviewExpert')
      .addEventListener('click', () => {
        window.location.href = 'describeFishExpert.html';
      });

    // 4) ✔ Отправляем на сервер как «approved»
    document.getElementById('confirmBtnExpert')
      .addEventListener('click', async () => {
        
        const postBody = {
          user:     user.id,
          fishType:   expertData.fishType,
          season:     expertData.season,
          fishWeight: expertData.fishWeight,
          fishLength: expertData.fishLength,
          amount:     expertData.amount,
          catchDate:  expertData.catchDate,
          location,
          photoSrc:   expertData.photoSrc,
          status: 1 // всегда 1 для эксперта
        };
        try {
          const resp = await fetch('https://fishinmap.onrender.com/api/expert', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(postBody)
          });
          const result = await resp.json();
          if (!resp.ok) {
            alert(result.error || 'Failed to publish post.');
            return;
          }
          alert('Your expert post has been published!');
          window.location.href = 'FirstUserScrean.html';
        } catch (err) {
          console.error(err);
          alert('Network error. Please try again later.');
        }
      });
  }
});

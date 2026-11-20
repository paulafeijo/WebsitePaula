/* Login simples (usuário + senha) para o site.
   Aviso: roda no navegador, então afasta curiosos mas não é segurança de verdade. */
(function () {
  // ====== COLE AQUI OS HASHES (um por pessoa, separados por vírgula) ======
  var HASHES = [
    '23015f9cebac49f81d0be4f3dde83d74265a8d79ad458ab7731fcde99ffc5662'
    // , 'COLE_O_SEGUNDO_HASH_AQUI'
  ];
  var SALT = 'site-da-paula';
  // ========================================================
  var KEY = 'sdp-auth';

  var nl = (document.documentElement.lang || '').toLowerCase().indexOf('nl') === 0;
  var T = nl
    ? { title: 'inloggen', user: 'gebruikersnaam', pass: 'wachtwoord', btn: 'inloggen', err: 'gebruikersnaam of wachtwoord klopt niet' }
    : { title: 'entrar', user: 'usuário', pass: 'senha', btn: 'entrar', err: 'usuário ou senha incorretos' };

  function sha256(text) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
      return Array.from(new Uint8Array(buf)).map(function (b) {
        return b.toString(16).padStart(2, '0');
      }).join('');
    });
  }

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved && HASHES.indexOf(saved) !== -1) return; // já está logada: página abre normal

  // esconde a página até o login
  var hide = document.createElement('style');
  hide.textContent = 'html{visibility:hidden}';
  document.head.appendChild(hide);

  function showLogin() {
    var css = document.createElement('style');
    css.textContent =
      '#auth-box{visibility:visible;position:fixed;inset:0;z-index:99999;background:#fff;display:flex;align-items:center;justify-content:center;padding:20px}' +
      '#auth-box form{width:100%;max-width:320px;display:flex;flex-direction:column;gap:14px;font-family:"VT323",monospace;font-size:20px;color:#111}' +
      '#auth-box h1{font-family:"Press Start 2P",monospace;font-size:18px;margin:0 0 8px;font-weight:normal}' +
      '#auth-box input{font:inherit;padding:8px 10px;border:2px solid #111;background:#fff;color:#111;border-radius:0}' +
      '#auth-box input:focus{outline:2px dashed #ff5fa2;outline-offset:2px}' +
      '#auth-box button{font-family:"Press Start 2P",monospace;font-size:12px;padding:12px;border:2px solid #111;background:#ff5fa2;color:#111;cursor:pointer;border-radius:0}' +
      '#auth-box button:hover{background:#2ee6d6}' +
      '#auth-err{color:#c00;min-height:1.2em;margin:0}';
    document.head.appendChild(css);

    var box = document.createElement('div');
    box.id = 'auth-box';
    box.innerHTML =
      '<form autocomplete="on">' +
      '<h1>' + T.title + '</h1>' +
      '<input id="auth-user" name="username" type="text" placeholder="' + T.user + '" autocomplete="username" autocapitalize="none" required>' +
      '<input id="auth-pass" name="password" type="password" placeholder="' + T.pass + '" autocomplete="current-password" required>' +
      '<p id="auth-err" role="alert"></p>' +
      '<button type="submit">' + T.btn + '</button>' +
      '</form>';
    document.body.appendChild(box);
    document.getElementById('auth-user').focus();

    box.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      var u = document.getElementById('auth-user').value.trim().toLowerCase();
      var p = document.getElementById('auth-pass').value;
      sha256(SALT + ':' + u + ':' + p).then(function (h) {
        if (HASHES.indexOf(h) !== -1) {
          try { localStorage.setItem(KEY, h); } catch (e) {}
          box.remove();
          hide.remove();
        } else {
          document.getElementById('auth-err').textContent = T.err;
          document.getElementById('auth-pass').value = '';
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showLogin);
  } else {
    showLogin();
  }
})();

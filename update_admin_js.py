import re

with open('admin/admin.js', 'r') as f:
    content = f.read()

# Replace currentUser assignments
content = re.sub(r"const currentUser = localStorage\.getItem\('maudy_current_user'\) \|\| getUsers\(\)\[0\]\.username;",
                 "const currentUser = localStorage.getItem('maudy_current_user');", content)
content = re.sub(r"const currentUser = sessionStorage\.getItem\('maudy_current_user'\) \|\| getUsers\(\)\[0\]\.username;",
                 "const currentUser = localStorage.getItem('maudy_current_user');", content)

# 1. Update Security Settings (Change Password for current user)
old_sec_js = """document.getElementById('change-pass-btn').addEventListener('click', () => {
  const secStatus = document.getElementById('sec-status');
  secStatus.className = 'form-status';
  secStatus.style.display = 'none';

  const newUser    = document.getElementById('sec-user').value.trim();
  const oldPass    = document.getElementById('sec-pass-old').value;
  const newPass    = document.getElementById('sec-pass-new').value;
  const confirmPass= document.getElementById('sec-pass-confirm').value;

  const currentUser = localStorage.getItem('maudy_current_user');
  const users = getUsers();
  const myIdx = users.findIndex(u => u.username === currentUser);
  const me    = myIdx >= 0 ? users[myIdx] : users[0];

  if (!oldPass) { showSecStatus('error', 'Masukkan password lama.'); return; }
  if (oldPass !== me.password) { showSecStatus('error', 'Password lama salah.'); return; }
  if (newPass.length < 6) { showSecStatus('error', 'Password baru minimal 6 karakter.'); return; }
  if (newPass !== confirmPass) { showSecStatus('error', 'Konfirmasi password tidak cocok.'); return; }

  const username = newUser || me.username;
  // Cek duplikat username (kecuali diri sendiri)
  if (username !== me.username && users.some(u => u.username === username)) {
    showSecStatus('error', `Username "${username}" sudah digunakan.`); return;
  }
  users[myIdx >= 0 ? myIdx : 0] = { ...me, username, password: newPass };
  saveUsers(users);
  sessionStorage.setItem('maudy_current_user', username); // backward compat
  localStorage.setItem('maudy_current_user', username);
  showSecStatus('success', `✅ Kredensial berhasil diubah! Username: ${username}`);
  document.getElementById('sec-user').value = '';
  document.getElementById('sec-pass-old').value = '';
  document.getElementById('sec-pass-new').value = '';
  document.getElementById('sec-pass-confirm').value = '';
  // Refresh user list jika sedang di tab users
  renderUserList();
});"""

new_sec_js = """document.getElementById('change-pass-btn').addEventListener('click', async () => {
  const secStatus = document.getElementById('sec-status');
  secStatus.className = 'form-status';
  secStatus.style.display = 'none';

  const oldPass    = document.getElementById('sec-pass-old').value;
  const newPass    = document.getElementById('sec-pass-new').value;
  const confirmPass= document.getElementById('sec-pass-confirm').value;
  
  const currentUser = localStorage.getItem('maudy_current_user');

  if (!oldPass) { showSecStatus('error', 'Masukkan password lama.'); return; }
  if (newPass.length < 6) { showSecStatus('error', 'Password baru minimal 6 karakter.'); return; }
  if (newPass !== confirmPass) { showSecStatus('error', 'Konfirmasi password tidak cocok.'); return; }

  try {
    const res = await fetch('../api/auth.php?action=change_password', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: currentUser, oldPassword: oldPass, newPassword: newPass }),
      credentials: 'same-origin'
    });
    const data = await res.json();
    if (data.success) {
      showSecStatus('success', `✅ Password berhasil diubah!`);
      document.getElementById('sec-pass-old').value = '';
      document.getElementById('sec-pass-new').value = '';
      document.getElementById('sec-pass-confirm').value = '';
      renderUserList();
    } else {
      showSecStatus('error', data.message || 'Gagal mengubah password');
    }
  } catch (e) {
    showSecStatus('error', 'Terjadi kesalahan jaringan.');
  }
});"""
content = content.replace(old_sec_js, new_sec_js)

# 2. Update renderUserList
old_render = """async function renderUserList() {
  const users = getUsers();
  userListEl.innerHTML = '';
  users.forEach(u => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${u.username} ${u.role === 'admin' ? '<span style="font-size:0.7em;background:#2563EB;color:#fff;padding:2px 4px;border-radius:4px;margin-left:4px">Admin</span>' : ''}</span>
      <div class="user-actions">
        <button class="btn btn-secondary btn-sm" onclick="openChangePasswordModal('${u.username}')">Ganti Password</button>
        <button class="btn btn-danger btn-sm" onclick="deleteUser('${u.username}')">Hapus</button>
      </div>
    `;
    userListEl.appendChild(li);
  });
}"""

new_render = """async function renderUserList() {
  try {
    const res = await fetch('../api/auth.php?action=get_users', { credentials: 'same-origin' });
    const data = await res.json();
    if (!data.success) return;
    const users = data.users;
    userListEl.innerHTML = '';
    users.forEach(u => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${u.username} ${u.role === 'admin' ? '<span style="font-size:0.7em;background:#2563EB;color:#fff;padding:2px 4px;border-radius:4px;margin-left:4px">Admin</span>' : ''}</span>
        <div class="user-actions">
          <button class="btn btn-secondary btn-sm" onclick="openChangePasswordModal('${u.username}')">Ganti Password</button>
          <button class="btn btn-danger btn-sm" onclick="deleteUser('${u.username}')">Hapus</button>
        </div>
      `;
      userListEl.appendChild(li);
    });
  } catch (e) {
    console.error('Failed to load users');
  }
}"""
content = content.replace(old_render, new_render)

# 3. Update deleteUser
old_delete = """function deleteUser(username) {
  if (confirm(`Yakin ingin menghapus user "${username}"?`)) {
    const users = getUsers();
    if (users.length <= 1) {
      alert('Tidak dapat menghapus user satu-satunya!');
      return;
    }
    const newUsers = users.filter(u => u.username !== username);
    saveUsers(newUsers);
    renderUserList();
    if (username === (sessionStorage.getItem('maudy_current_user') || getUsers()[0].username)) {
      logout();
    }
  }
}"""

new_delete = """async function deleteUser(username) {
  if (confirm(`Yakin ingin menghapus user "${username}"?`)) {
    try {
      const res = await fetch('../api/auth.php?action=delete_user', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }), credentials: 'same-origin'
      });
      const data = await res.json();
      if (data.success) {
        renderUserList();
        if (username === localStorage.getItem('maudy_current_user')) {
          logout();
        }
      } else {
        alert(data.message || 'Gagal menghapus');
      }
    } catch (e) {
      alert('Terjadi kesalahan jaringan.');
    }
  }
}"""
content = content.replace(old_delete, new_delete)

# 4. Update Change Password Modal
old_modal_submit = """modal.querySelector('.btn-primary').onclick = () => {
    const np = document.getElementById('modal-new-pass').value;
    const cp = document.getElementById('modal-confirm-pass').value;
    if (np.length < 6) { alert('Password minimal 6 karakter'); return; }
    if (np !== cp) { alert('Konfirmasi password tidak cocok'); return; }

    const freshUsers = getUsers();
    const userIdx = freshUsers.findIndex(x => x.username === username);
    if (userIdx >= 0) {
      freshUsers[userIdx] = { ...freshUsers[userIdx], password: np };
      saveUsers(freshUsers);
      alert('Password berhasil diubah!');
      closeModal(modal);
    }
  };"""

new_modal_submit = """modal.querySelector('.btn-primary').onclick = async () => {
    const np = document.getElementById('modal-new-pass').value;
    const cp = document.getElementById('modal-confirm-pass').value;
    if (np.length < 6) { alert('Password minimal 6 karakter'); return; }
    if (np !== cp) { alert('Konfirmasi password tidak cocok'); return; }

    try {
      const res = await fetch('../api/auth.php?action=change_password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, newPassword: np }), credentials: 'same-origin'
      });
      const data = await res.json();
      if (data.success) {
        alert('Password berhasil diubah!');
        closeModal(modal);
      } else {
        alert(data.message || 'Gagal mengubah password');
      }
    } catch (e) {
      alert('Kesalahan jaringan');
    }
  };"""
content = content.replace(old_modal_submit, new_modal_submit)

# 5. Update formAddUser
old_add = """formAddUser.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('new-user-name').value.trim();
  const password = document.getElementById('new-user-pass').value;
  
  if (!username || !password) {
    alert('Harap isi username dan password');
    return;
  }
  if (password.length < 6) {
    alert('Password minimal 6 karakter');
    return;
  }
  
  const users = getUsers();
  if (users.some(u => u.username === username)) {
    alert('Username sudah ada!');
    return;
  }
  
  users.push({ username, password, role: 'admin' });
  saveUsers(users);
  
  alert(`User "${username}" berhasil ditambahkan!`);
  formAddUser.reset();
  renderUserList();
});"""

new_add = """formAddUser.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('new-user-name').value.trim();
  const password = document.getElementById('new-user-pass').value;
  
  if (!username || !password) {
    alert('Harap isi username dan password');
    return;
  }
  if (password.length < 6) {
    alert('Password minimal 6 karakter');
    return;
  }
  
  try {
    const res = await fetch('../api/auth.php?action=add_user', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }), credentials: 'same-origin'
    });
    const data = await res.json();
    if (data.success) {
      alert(`User "${username}" berhasil ditambahkan!`);
      formAddUser.reset();
      renderUserList();
    } else {
      alert(data.message || 'Gagal menambah user');
    }
  } catch (e) {
    alert('Terjadi kesalahan jaringan');
  }
});"""
content = content.replace(old_add, new_add)

# Make renderUserList async where it is called
content = content.replace("renderUserList();", "await renderUserList();")

with open('admin/admin.js', 'w') as f:
    f.write(content)

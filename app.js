const form = document.getElementById('search-form');
const input = document.getElementById('username-input');
const content = document.getElementById('content');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = input.value.trim();
  if (user) {
    fetchProfile(user);
  }
});

async function fetchProfile(username) {
  
  content.innerHTML = `<div class="text-center py-10 text-slate-400">Loading user info...</div>`;
  input.value = username;

  try {
    // Fetch User Info
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (!userRes.ok) {
      content.innerHTML = `<div class="text-center text-red-400 bg-[#151f2c] p-6 rounded-2xl">User not found</div>`;
      return;
    }
    const userData = await userRes.json();

    
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
    const reposData = await reposRes.json();

    renderProfile(userData, reposData);
  } catch (error) {
    content.innerHTML = `<div class="text-center text-red-400 bg-[#151f2c] p-6 rounded-2xl">Error fetching data. Please try again.</div>`;
  }
}

function renderProfile(user, repos) {
  const bioText = user.bio ? user.bio : 'No bio yet.';

  content.innerHTML = `
    <!-- Profile Card -->
    <div class="bg-[#151f2c] border border-slate-700/40 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-xl">
      <img src="${user.avatar_url}" alt="${user.login}" class="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-amber-400/80 object-cover" />
      
      <div class="flex-1 text-center md:text-left">
        <h2 class="text-2xl font-bold text-white">${user.name || user.login}</h2>
        <a href="${user.html_url}" target="_blank" class="text-blue-400 text-sm hover:underline">@${user.login}</a>
        <p class="text-slate-400 text-sm mt-2 mb-4">${bioText}</p>
        
        
        <div class="flex flex-wrap justify-center md:justify-start gap-3 text-xs font-semibold">
          <span class="bg-[#0b131e] px-4 py-2 rounded-lg text-amber-400">
            <strong class="text-white text-sm mr-1">${user.public_repos}</strong> repos
          </span>
          <span class="bg-[#0b131e] px-4 py-2 rounded-lg text-amber-400">
            <strong class="text-white text-sm mr-1">${user.followers.toLocaleString()}</strong> followers
          </span>
          <span class="bg-[#0b131e] px-4 py-2 rounded-lg text-amber-400">
            <strong class="text-white text-sm mr-1">${user.following}</strong> following
          </span>
        </div>
      </div>
    </div>

   
    <div>
      <h3 class="text-xl font-bold mb-4 text-white">Latest repositories</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${repos.map(repo => `
          <div class="bg-[#151f2c] border border-slate-700/40 rounded-xl p-4 flex flex-col justify-between hover:border-slate-500 transition">
            <div>
              <a href="${repo.html_url}" target="_blank" class="text-blue-400 font-bold hover:underline block mb-1 truncate">${repo.name}</a>
              <p class="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                ${repo.description || 'No description provided.'}
              </p>
            </div>
            <div class="flex items-center gap-3 text-xs text-slate-400 mt-4">
              ${repo.stargazers_count !== undefined ? `<span>⭐ ${repo.stargazers_count.toLocaleString()}</span>` : ''}
              ${repo.language ? `<span>${repo.language}</span>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
const playlist = [
    {
      file: "assets/music/AYYBO - HYPNOSIS feat. ero808 (Official Audio).mp3",
      title: "HYPNOSIS feat. ero808 (Official Audio)",
      artist: "AYYBO",
    },
    {
      file: "assets/music/Conducta & Sammy Virji - Whippet.mp3",
      title: "Whippet",
      artist: "Conducta & Sammy Virji",
    },
    {
      file: "assets/music/DROELOE - CATALYST.mp3",
      title: "CATALYST",
      artist: "DROELOE",
    },
    {
      file: "assets/music/Frou Frou - A new kind of love (sped up).mp3",
      title: "A new kind of love (sped up)",
      artist: "Frou Frou",
    },
    {
      file: "assets/music/IMANU - Of Two Minds.mp3",
      title: "Of Two Minds",
      artist: "IMANU",
    },
    {
      file: "assets/music/NUZB - Nevermind (Extended Mix).mp3",
      title: "Nevermind (Extended Mix)",
      artist: "NUZB",
    },
    {
      file: "assets/music/RÜFÜS DU SOL  Innerbloom (Official Video).mp3",
      title: "Innerbloom (Official Video)",
      artist: "RÜFÜS DU SOL",
    },
    {
      file: "assets/music/RÜFÜS DU SOL - On My Knees (Official Music Video).mp3",
      title: "On My Knees (Official Music Video)",
      artist: "RÜFÜS DU SOL",
    },
    {
      file: "assets/music/Sammy Virji - Find My Way Home.mp3",
      title: "Find My Way Home",
      artist: "Sammy Virji",
    },
    {
      file: "assets/music/Sammy Virji - I Guess We're Not The Same (Extended Mix).mp3",
      title: "I Guess We're Not The Same (Extended Mix)",
      artist: "Sammy Virji",
    },
    {
      file: "assets/music/Sammy Virji - If U Need It (Extended Version).mp3",
      title: "If U Need It (Extended Version)",
      artist: "Sammy Virji",
    },
  ];
  
  const audio = document.getElementById("audio");
  const playerCollapsed = document.getElementById("player-collapsed");
  const playerExpanded = document.getElementById("player-expanded");
  const songDisplay = document.getElementById("song-display");
  const toggleBtn = document.getElementById("audio-toggle");
  const toggleBtnExpanded = document.getElementById("audio-toggle-expanded");
  const playIcon = document.getElementById("play-icon");
  const playIconExpanded = document.getElementById("play-icon-expanded");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const loopBtn = document.getElementById("loop-btn");
  const closeBtn = document.getElementById("close-player");
  const progressFill = document.getElementById("progress-fill");
  const volumeFill = document.getElementById("volume-fill");
  const currentTimeDisplay = document.getElementById("current-time");
  const totalTimeDisplay = document.getElementById("total-time");
  
  let currentSongIndex = 0;
  let isExpanded = false;
  let isDraggingProgress = false;
  let isDraggingVolume = false;
  let isLooping = false;
  let wasPlaying = false; // Track if music was playing before song change
  
  // Set initial volume to 50%
  audio.volume = 0.5;
  
  // Load initial song
  function loadSong(index) {
    if (playlist.length === 0) return;
  
    currentSongIndex = index;
    const song = playlist[currentSongIndex];
  
    audio.src = song.file;
  
    // Update to single line format: "Song Title - Artist"
    const songInfo = document.getElementById("song-info");
    songInfo.innerHTML = `${song.title} <span class="song-artist-inline">- ${song.artist}</span>`;
  
    // Reset progress
    progressFill.style.width = "0%";
    currentTimeDisplay.textContent = "0:00";
  }
  
  // Format time helper
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
  
  // Update progress bar
  function updateProgress() {
    if (!isDraggingProgress && audio.duration) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = `${progress}%`;
      currentTimeDisplay.textContent = formatTime(audio.currentTime);
    }
  }
  
  // Update volume bar
  function updateVolumeBar() {
    const volumePercent = audio.volume * 100;
    volumeFill.style.width = `${volumePercent}%`;
  }
  
  // Show song display
  function showSongDisplay() {
    songDisplay.classList.add("visible");
  }
  
  // Hide song display
  function hideSongDisplay() {
    songDisplay.classList.remove("visible");
  }
  
  // Expand player
  function expandPlayer() {
    if (!isExpanded) {
      isExpanded = true;
      playerCollapsed.classList.add("hidden");
      showSongDisplay();
  
      setTimeout(() => {
        playerExpanded.classList.add("visible");
      }, 200);
    }
  }
  
  // Collapse player
  function collapsePlayer() {
    if (isExpanded) {
      isExpanded = false;
      playerExpanded.classList.remove("visible");
      hideSongDisplay();
  
      setTimeout(() => {
        playerCollapsed.classList.remove("hidden");
      }, 200);
    }
  }
  
  // Play/pause functionality
  async function togglePlayPause() {
    try {
      if (audio.paused) {
        await audio.play();
        playIcon.src = "assets/icons/pause.svg";
        playIcon.alt = "Pause";
        playIconExpanded.src = "assets/icons/pause.svg";
        playIconExpanded.alt = "Pause";
        expandPlayer();
      } else {
        audio.pause();
        playIcon.src = "assets/icons/play.svg";
        playIcon.alt = "Play";
        playIconExpanded.src = "assets/icons/play.svg";
        playIconExpanded.alt = "Play";
      }
    } catch (err) {
      console.error("Audio playback failed:", err);
    }
  }
  
  // Next song
  async function nextSong() {
    if (playlist.length === 0) return;
  
    // Remember if music was playing
    wasPlaying = !audio.paused;
  
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    loadSong(currentSongIndex);
  
    // If music was playing, continue playing the new song
    if (wasPlaying) {
      try {
        await audio.play();
      } catch (err) {
        console.error("Failed to play next song:", err);
      }
    }
  }
  
  // Previous song
  async function prevSong() {
    if (playlist.length === 0) return;
  
    // Remember if music was playing
    wasPlaying = !audio.paused;
  
    currentSongIndex =
      (currentSongIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentSongIndex);
  
    // If music was playing, continue playing the new song
    if (wasPlaying) {
      try {
        await audio.play();
      } catch (err) {
        console.error("Failed to play previous song:", err);
      }
    }
  }
  
  // Toggle loop
  function toggleLoop() {
    isLooping = !isLooping;
    audio.loop = isLooping;
  
    if (isLooping) {
      loopBtn.classList.add("active");
    } else {
      loopBtn.classList.remove("active");
    }
  }
  
  // Event listeners
  toggleBtn.addEventListener("click", togglePlayPause);
  toggleBtnExpanded.addEventListener("click", togglePlayPause);
  nextBtn.addEventListener("click", nextSong);
  prevBtn.addEventListener("click", prevSong);
  loopBtn.addEventListener("click", toggleLoop);
  closeBtn.addEventListener("click", collapsePlayer);
  
  // Progress bar interactions
  document.querySelector(".progress-bar").addEventListener("mousedown", (e) => {
    isDraggingProgress = true;
    updateProgressFromMouse(e);
    e.preventDefault();
  });
  
  document.addEventListener("mousemove", (e) => {
    if (isDraggingProgress) {
      updateProgressFromMouse(e);
    }
    if (isDraggingVolume) {
      updateVolumeFromMouse(e);
    }
  });
  
  document.addEventListener("mouseup", () => {
    isDraggingProgress = false;
    isDraggingVolume = false;
  });
  
  function updateProgressFromMouse(e) {
    const progressBar = document.querySelector(".progress-bar");
    const rect = progressBar.getBoundingClientRect();
    const percent = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width)
    );
  
    if (audio.duration) {
      audio.currentTime = percent * audio.duration;
      const progress = percent * 100;
      progressFill.style.width = `${progress}%`;
      currentTimeDisplay.textContent = formatTime(audio.currentTime);
    }
  }
  
  // Volume bar interactions
  document.querySelector(".volume-bar").addEventListener("mousedown", (e) => {
    isDraggingVolume = true;
    updateVolumeFromMouse(e);
    e.preventDefault();
  });
  
  function updateVolumeFromMouse(e) {
    const volumeBar = document.querySelector(".volume-bar");
    const rect = volumeBar.getBoundingClientRect();
    const percent = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width)
    );
  
    audio.volume = percent;
    volumeFill.style.width = `${percent * 100}%`;
  }
  
  // Audio event listeners
  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("loadedmetadata", () => {
    totalTimeDisplay.textContent = formatTime(audio.duration);
    updateVolumeBar();
  });
  
  audio.addEventListener("ended", () => {
    if (!isLooping) {
      nextSong();
    }
  });
  
  // Initialize
  if (playlist.length > 0) {
    loadSong(0);
  }
  updateVolumeBar();
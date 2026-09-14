const medleyPlayers = [...document.querySelectorAll('[data-medley-audio]')];

medleyPlayers.forEach((player) => {
  player.addEventListener('play', () => {
    medleyPlayers.forEach((otherPlayer) => {
      if (otherPlayer !== player && !otherPlayer.paused) otherPlayer.pause();
    });

    document.querySelectorAll('.is-playing').forEach((card) => card.classList.remove('is-playing'));
    const card = player.closest('.medley-master, .medley-track');
    if (card) card.classList.add('is-playing');
  });

  player.addEventListener('pause', () => {
    const card = player.closest('.medley-master, .medley-track');
    if (card && player.currentTime !== player.duration) card.classList.remove('is-playing');
  });

  player.addEventListener('ended', () => {
    const card = player.closest('.medley-master, .medley-track');
    if (card) card.classList.remove('is-playing');
  });
});

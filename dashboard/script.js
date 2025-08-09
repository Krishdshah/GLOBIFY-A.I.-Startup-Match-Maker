// Dashboard interactions
(function () {
  const welcome = document.querySelector('.dash-title');
  if (welcome) {
    // Example: dynamic greeting based on time of day
    const now = new Date();
    const hour = now.getHours();
    let timeGreeting = 'Welcome';
    if (hour < 12) timeGreeting = 'Good morning';
    else if (hour < 18) timeGreeting = 'Good afternoon';
    else timeGreeting = 'Good evening';

    // Append greeting softly
    welcome.textContent = `${timeGreeting} 👋`;
  }
})();


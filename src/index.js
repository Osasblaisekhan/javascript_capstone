const updateTime = (time) => {
  const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
  };
  return time.toLocaleString('en-US', options);
};

// Update the time display every second
setInterval(() => {
  const d = new Date();
  document.getElementById("time").innerHTML = updateTime(d);
}, 1000);
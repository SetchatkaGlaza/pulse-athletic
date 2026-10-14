export function initReviews() {
  const rv = document.getElementById('rv'), step = () => (rv.querySelector('.card').offsetWidth + 20) * (matchMedia('(min-width:1100px)').matches ? 1 : 1);
  document.getElementById('rv-prev').onclick = () => rv.scrollBy({ left: -step(), behavior: 'smooth' });
  document.getElementById('rv-next').onclick = () => rv.scrollBy({ left: step(), behavior: 'smooth' });
  rv.addEventListener('keydown', e => { if (e.key === 'ArrowRight') rv.scrollBy({ left: step(), behavior: 'smooth' }); if (e.key === 'ArrowLeft') rv.scrollBy({ left: -step(), behavior: 'smooth' }); });
}

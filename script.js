// MAKI — galería, animaciones, música y navegación
const photoCaptions = [
  "Mi pequeña estrella", "Una carita para guardar", "La dueña de la ternura",
  "Un recuerdo que sonríe", "Pequeñas patitas, mucho amor", "La reina de la casa",
  "Una pausa para ronronear", "Su mirada lo dice todo", "Mi compañera de aventuras",
  "Siempre preciosa, Maki"
];
const galleryGrid = document.getElementById("galleryGrid");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCount = document.getElementById("lightboxCount");
const lightboxCaption = document.getElementById("lightboxCaption");
const music = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");
const toast = document.getElementById("toast");
let currentPhoto = 0;
let toastTimer;

function imagePath(index) {
  return `fotos/maki${index + 1}.jpeg`;
}
function makePhoto(index) {
  const button = document.createElement("button");
  button.className = "gallery-item reveal";
  button.type = "button";
  button.setAttribute("aria-label", `Abrir foto ${index + 1}: ${photoCaptions[index]}`);
  const img = document.createElement("img");
  img.src = imagePath(index);
  img.alt = `Maki — foto ${index + 1}`;
  img.loading = "lazy";
  img.onerror = () => {
    button.classList.add("placeholder");
    img.style.display = "none";
  };
  const placeholder = document.createElement("div");
  placeholder.className = "photo-placeholder";
  placeholder.innerHTML = `<span>🐈</span><small>Foto ${index + 1} de Maki</small><small>fotos/maki${index + 1}.jpg</small>`;
  const number = document.createElement("span");
  number.className = "photo-index";
  number.textContent = String(index + 1).padStart(2, "0");
  const caption = document.createElement("span");
  caption.className = "photo-caption";
  caption.textContent = photoCaptions[index];
  button.append(img, placeholder, number, caption);
  button.addEventListener("click", () => openPhoto(index));
  return button;
}
for (let i = 0; i < 10; i++) galleryGrid.appendChild(makePhoto(i));

function openPhoto(index) {
  currentPhoto = (index + 10) % 10;
  const path = imagePath(currentPhoto);
  lightboxImage.src = path;
  lightboxImage.alt = `Maki — foto ${currentPhoto + 1}`;
  lightboxCount.textContent = `${currentPhoto + 1} / 10`;
  lightboxCaption.textContent = photoCaptions[currentPhoto];
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  lightboxImage.onerror = () => {
    showToast(`Agrega tu foto en ${path}`);
    lightboxImage.onerror = null;
  };
}
function closePhoto() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
function stepPhoto(direction) { openPhoto(currentPhoto + direction); }
document.getElementById("closeLightbox").addEventListener("click", closePhoto);
document.getElementById("prevPhoto").addEventListener("click", () => stepPhoto(-1));
document.getElementById("nextPhoto").addEventListener("click", () => stepPhoto(1));
lightbox.addEventListener("click", event => { if (event.target === lightbox) closePhoto(); });
document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closePhoto();
  if (event.key === "ArrowLeft") stepPhoto(-1);
  if (event.key === "ArrowRight") stepPhoto(1);
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}
musicToggle.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      musicToggle.classList.add("playing");
      musicToggle.setAttribute("aria-label", "Pausar música");
      document.getElementById("musicLabel").textContent = "Sonando para Maki";
    } catch {
      showToast("Coloca tu canción en musica/cancion.mp3 y vuelve a intentarlo.");
    }
  } else {
    music.pause();
    musicToggle.classList.remove("playing");
    musicToggle.setAttribute("aria-label", "Activar música");
    document.getElementById("musicLabel").textContent = "Nuestra canción";
  }
});

// Aparición suave de secciones al entrar en pantalla.
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

// Resalta el apartado que se está viendo.
const navLinks = [...document.querySelectorAll('nav a')];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
    }
  });
}, { rootMargin: "-35% 0px -55% 0px" });
document.querySelectorAll("main section[id]").forEach(section => sectionObserver.observe(section));

// Si el navegador no soporta IntersectionObserver, muestra todo el contenido.
if (!("IntersectionObserver" in window)) {
  document.querySelectorAll(".reveal").forEach(element => element.classList.add("visible"));
}
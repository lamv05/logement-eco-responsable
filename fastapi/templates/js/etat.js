const API_URL_CAPTEURS = '/api/capteurs-actionneurs';
const API_URL_MESURES = '/api/mesures/';

// Fonction pour récupérer et afficher la liste des capteurs
async function fetchCapteurs() {
  try {
    const response = await fetch(API_URL_CAPTEURS);
    const capteurs = await response.json();
    const capteursList = document.getElementById('capteursList');
    capteursList.innerHTML = '';

    capteurs.forEach((capteur) => {
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item');
      listItem.textContent = `${capteur.reference_commerciale} (${capteur.type_name} - ${capteur.piece_name})`;
      listItem.onclick = () => fetchMesures(capteur.id); // Quand on clique, on charge les mesures
      capteursList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Erreur:', error);
    alert('Impossible de charger les capteurs.');
  }
}

// Fonction pour récupérer les 5 dernières mesures d'un capteur
async function fetchMesures(capteurId) {
  try {
    const response = await fetch(API_URL_MESURES + capteurId);
    const mesures = await response.json();

    if (mesures.length === 0) {
      alert("Aucune mesure disponible pour ce capteur.");
      return;
    }

    const labels = mesures.map((mesure) => new Date(mesure.insert_date).toLocaleString()).reverse();
    const data = mesures.map((mesure) => mesure.valeur).reverse();

    // Créer ou mettre à jour le graphique
    const ctx = document.getElementById('mesureChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Mesures',
          data: data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'minute',
              tooltipFormat: 'll HH:mm',
            },
          },
          y: {
            beginAtZero: true,
          }
        }
      }
    });
  } catch (error) {
    console.error('Erreur:', error);
    alert('Impossible de charger les mesures.');
  }
}


// Charger la liste des capteurs au chargement de la page
window.onload = fetchCapteurs;

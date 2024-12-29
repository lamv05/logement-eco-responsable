// Variable pour stocker l'instance du graphique
let consommationChartInstance = null;

// Fonction pour récupérer et afficher la consommation
async function fetchConsommation(typeFacture) {
    try {
        console.log(`Chargement des données pour le type de facture: ${typeFacture}`);

        // Requête à l'API pour récupérer les données de consommation
        const response = await fetch('/api/consommation?type=' + typeFacture);

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données');
        }

        const factures = await response.json();

        // Si aucune facture n'est trouvée
        if (factures.length === 0) {
            alert("Aucune facture disponible pour ce type.");
            return;
        }

        // Extraire les dates et les consommations
        const labels = factures.map(facture => new Date(facture.date_facture).toLocaleDateString()).reverse();
        const consommationData = factures.map(facture => facture.consommation).reverse();

        // Si un graphique existe déjà, le détruire avant de créer un nouveau
        if (consommationChartInstance) {
            consommationChartInstance.destroy();
        }

        // Créer un nouveau graphique
        const ctx = document.getElementById('consommationChart').getContext('2d');
        consommationChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Consommation ${typeFacture}`,
                    data: consommationData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'category',
                        title: {
                            display: true,
                            text: 'Date de Facture'
                        }
                    },
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Consommation (unités)'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Erreur:', error);
        alert('Impossible de charger les données de consommation.');
    }
}

// Charger les données de consommation pour l'électricité au chargement initial
window.onload = () => fetchConsommation('electricite');
